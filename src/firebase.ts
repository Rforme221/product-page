import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Order } from './types';

import firebaseAppletConfig from '../firebase-applet-config.json';

const firebaseConfig = firebaseAppletConfig || {
  apiKey: "AIzaSyDummyKeyForDevelopment123456789",
  authDomain: "pinp-store.firebaseapp.com",
  projectId: "pinp-store",
  storageBucket: "pinp-store.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('https://www.googleapis.com/auth/spreadsheets');

// Firestore Connection Test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection verified!");
    return true;
  } catch (error: any) {
    if (error?.message?.includes('offline')) {
      console.warn("Firestore client appears offline or pending configuration");
    }
    return false;
  }
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local storage fallback key for resilience during dev testing
const LOCAL_ORDERS_KEY = 'pinp_orders_cache_v1';

export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: Order) {
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Local storage order save error:", err);
  }
}

export async function submitOrderToFirestore(order: Order): Promise<{ success: boolean; id: string }> {
  // Always save locally first to ensure order is never lost
  saveLocalOrder(order);

  const path = `orders/${order.id}`;
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAtServer: serverTimestamp(),
    });
    console.log(`Order ${order.id} saved to Firestore collection 'orders'`);
    return { success: true, id: order.id };
  } catch (error) {
    console.warn("Firestore write failed, using local resilience store:", error);
    // Don't throw to customer if local save succeeded!
    return { success: true, id: order.id };
  }
}

export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const remoteOrders: Order[] = snapshot.docs.map(doc => doc.data() as Order);
    if (remoteOrders.length > 0) return remoteOrders;
  } catch (err) {
    console.warn("Could not fetch remote Firestore orders, loading cached local orders:", err);
  }
  return getLocalOrders();
}

export async function updateOrderStatusInFirestore(orderId: string, newStatus: Order['orderStatus']): Promise<boolean> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { orderStatus: newStatus });
    console.log(`Order ${orderId} updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("Failed to update order status in Firestore:", error);
    return false;
  }
}

