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

  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAtServer: serverTimestamp(),
    });
    console.log(`Order ${order.id} saved to Firestore collection 'orders'`);
    return { success: true, id: order.id };
  } catch (error) {
    console.warn("Firestore write notice (saved in local backup):", error);
    return { success: true, id: order.id };
  }
}

export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  const localOrders = getLocalOrders();
  let remoteOrders: Order[] = [];

  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    remoteOrders = snapshot.docs.map(doc => {
      const data = doc.data() as Order;
      return data;
    });
    console.log(`Fetched ${remoteOrders.length} orders from Firestore`);
  } catch (err) {
    console.warn("Could not fetch remote Firestore orders, using cached local orders:", err);
  }

  // Merge remote and local orders, removing duplicates by order ID
  const orderMap = new Map<string, Order>();
  
  // Local first
  localOrders.forEach(o => {
    if (o && o.id) orderMap.set(o.id, o);
  });
  
  // Remote overwrites local (fresher status)
  remoteOrders.forEach(o => {
    if (o && o.id) orderMap.set(o.id, o);
  });

  const merged = Array.from(orderMap.values());
  // Sort descending by date
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return merged;
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

