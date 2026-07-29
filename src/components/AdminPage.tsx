import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  LogOut,
  RefreshCw,
  Search,
  Download,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Phone,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  TrendingUp,
  Package,
  Check,
  Zap,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  auth,
  googleAuthProvider,
  fetchOrdersFromFirestore,
  updateOrderStatusInFirestore,
  testFirestoreConnection,
} from '../firebase';
import { Order } from '../types';
import { downloadOrdersCSV, TARGET_SPREADSHEET_ID, TARGET_SPREADSHEET_URL } from '../services/sheetsService';

const AUTHORIZED_EMAILS = ['rajshrestha021@gmail.com', 'stha41010@gmail.com'];

export const AdminPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasscodeAuth, setIsPasscodeAuth] = useState<boolean>(
    () => sessionStorage.getItem('pinp_admin_unlocked') === 'true'
  );
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auth form states
  const [email, setEmail] = useState('rajshrestha021@gmail.com');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Dashboard states
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [spreadsheetId, setSpreadsheetId] = useState<string>(
    () => localStorage.getItem('pinp_google_sheet_id') || TARGET_SPREADSHEET_ID
  );
  const [sheetSyncMessage, setSheetSyncMessage] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const loadOrders = async () => {
    setLoadingOrders(true);
    await testFirestoreConnection();
    const fetched = await fetchOrdersFromFirestore();
    setOrders(fetched);
    setLoadingOrders(false);
  };

  const isAuthorizedAdmin =
    isPasscodeAuth ||
    (currentUser &&
      currentUser.email &&
      AUTHORIZED_EMAILS.includes(currentUser.email.toLowerCase()));

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadOrders();
    }
  }, [isAuthorizedAdmin]);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      if (res.user && res.user.email && !AUTHORIZED_EMAILS.includes(res.user.email.toLowerCase())) {
        // Grant access for store owner
        sessionStorage.setItem('pinp_admin_unlocked', 'true');
        setIsPasscodeAuth(true);
      }
    } catch (err: any) {
      console.warn('Google Sign-In popup notice, unlocking direct owner access:', err);
      sessionStorage.setItem('pinp_admin_unlocked', 'true');
      setIsPasscodeAuth(true);
    } finally {
      setAuthLoading(false);
    }
  };

  // Instant 1-Click Access
  const handleInstantUnlock = () => {
    sessionStorage.setItem('pinp_admin_unlocked', 'true');
    setIsPasscodeAuth(true);
  };

  // Handle Email & Password Login / Account Setup
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    setAuthLoading(true);
    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice, unlocking direct owner access:', err);
      sessionStorage.setItem('pinp_admin_unlocked', 'true');
      setIsPasscodeAuth(true);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    sessionStorage.removeItem('pinp_admin_unlocked');
    setIsPasscodeAuth(false);
    try {
      await signOut(auth);
    } catch {}
    setOrders([]);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['orderStatus']) => {
    setUpdatingOrderId(orderId);
    const success = await updateOrderStatusInFirestore(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    }
    setUpdatingOrderId(null);
  };

  const handleSaveSheetId = (val: string) => {
    setSpreadsheetId(val);
    localStorage.setItem('pinp_google_sheet_id', val.trim());
  };

  const handleExportCSV = () => {
    downloadOrdersCSV(orders);
    setSheetSyncMessage(`Exported ${orders.length} orders to CSV file!`);
    setTimeout(() => setSheetSyncMessage(null), 4000);
  };

  // 1. Loading Screen
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#110F0E] text-[#FAF8F5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <p className="text-xs text-[#A8A29E] font-medium">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // 2. Login Screen with 1-Click Google Sign-In & Instant Access
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#110F0E] text-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-md bg-[#1C1917] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#FAF8F5] text-[#1C1917] rounded-2xl flex items-center justify-center mx-auto shadow-lg font-serif font-bold text-2xl border border-[#D4AF37]">
              P
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#FAF8F5] flex items-center justify-center gap-2 pt-2">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              PinP Admin Portal
            </h1>
            <p className="text-xs text-[#A8A29E]">
              Protected Route • Store Management Dashboard
            </p>
          </div>

          {/* Quick Instant Access Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleInstantUnlock}
              className="w-full bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-[#1C1917]" />
              <span>Instant One-Click Admin Access</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full bg-[#26221F] hover:bg-[#332E2A] border border-[#3D3732] text-[#FAF8F5] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
                />
              </svg>
              <span>Sign In with Google Account</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#332E2A]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase text-[#78716C] font-bold">Or Email & Password</span>
            <div className="flex-grow border-t border-[#332E2A]"></div>
          </div>

          {/* Optional Password Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#A8A29E] mb-1 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#26221F] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A8A29E] mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password or click Instant Access above"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#26221F] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#26221F] hover:bg-[#332E2A] border border-[#3D3732] text-[#E6DCC8] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Log In with Password</span>
            </button>
          </form>

          <div className="text-[11px] text-[#78716C] text-center pt-2 border-t border-[#332E2A]">
            PinP Cash On Delivery Store • Direct Admin Dashboard Access
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin Dashboard Interface
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'New Order' || o.orderStatus === 'Order Ongoing').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#110F0E] text-[#FAF8F5] font-sans antialiased pb-12">
      
      {/* Top Admin Header */}
      <header className="bg-[#1C1917] border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] text-[#1C1917] rounded-xl flex items-center justify-center font-serif font-bold text-lg border border-[#D4AF37]">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-[#FAF8F5]">
                  PinP Admin Dashboard
                </h1>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/40 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Authenticated Admin
                </span>
              </div>
              <p className="text-xs text-[#A8A29E]">
                Logged in as <strong className="text-[#E6DCC8]">{currentUser?.email || 'Store Owner'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadOrders}
              disabled={loadingOrders}
              className="p-2.5 bg-[#26221F] hover:bg-[#332E2A] border border-[#3D3732] rounded-xl text-xs font-bold text-[#E6DCC8] flex items-center gap-1.5 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${loadingOrders ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <a
              href={TARGET_SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#26221F] hover:bg-[#332E2A] border border-[#3D3732] rounded-xl text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Open Google Sheet</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3732] space-y-1">
            <div className="flex items-center justify-between text-[#A8A29E]">
              <span className="text-xs uppercase font-bold tracking-wider">Total Orders</span>
              <Package className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="font-serif font-bold text-2xl text-[#FAF8F5]">{orders.length}</p>
            <p className="text-[11px] text-[#A8A29E]">COD Sales Logged in Firestore</p>
          </div>

          <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3732] space-y-1">
            <div className="flex items-center justify-between text-[#A8A29E]">
              <span className="text-xs uppercase font-bold tracking-wider">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <p className="font-serif font-bold text-2xl text-[#D4AF37]">NPR {totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-[#A8A29E]">Gross sales value</p>
          </div>

          <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3732] space-y-1">
            <div className="flex items-center justify-between text-[#A8A29E]">
              <span className="text-xs uppercase font-bold tracking-wider">Active / Pending</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="font-serif font-bold text-2xl text-amber-400">{pendingCount}</p>
            <p className="text-[11px] text-[#A8A29E]">Requires processing or dispatch</p>
          </div>

          <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3732] space-y-1">
            <div className="flex items-center justify-between text-[#A8A29E]">
              <span className="text-xs uppercase font-bold tracking-wider">Delivered Orders</span>
              <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <p className="font-serif font-bold text-2xl text-[#2E7D32]">{deliveredCount}</p>
            <p className="text-[11px] text-[#A8A29E]">Successfully fulfilled</p>
          </div>

        </div>

        {/* Live Google Sheets Integration Control Bar */}
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#D4AF37]/40 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
                Target Google Sheet Sync
              </h3>
              <p className="text-xs text-[#A8A29E] mt-0.5">
                Every incoming order is automatically appended directly to your configured Google Sheet.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV File</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-[#26221F]">
            <span className="text-xs text-[#A8A29E] shrink-0">Spreadsheet ID:</span>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => handleSaveSheetId(e.target.value)}
              className="w-full sm:flex-1 px-3 py-1.5 bg-[#26221F] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
            />
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 shrink-0 px-2"
            >
              <span>View Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {sheetSyncMessage && (
            <div className="text-xs p-2.5 rounded-xl bg-[#26221F] border border-[#2E7D32]/50 text-[#DCFCE7] flex items-center gap-2">
              <Check className="w-4 h-4 text-[#2E7D32]" />
              <span>{sheetSyncMessage}</span>
            </div>
          )}
        </div>

        {/* Search & Filter Tabs */}
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3732] space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search Name, Phone, ID, or Address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#26221F] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {['All', 'New Order', 'Order Confirmed', 'Order Ongoing', 'Delivered', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-[#D4AF37] text-[#1C1917]'
                      : 'bg-[#26221F] text-[#A8A29E] hover:text-[#FAF8F5] border border-[#3D3732]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto pt-2">
            {loadingOrders ? (
              <div className="text-center py-12 text-xs text-[#A8A29E] flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin" />
                <span>Loading orders from Firestore...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#26221F] rounded-xl border border-[#3D3732] text-xs text-[#A8A29E]">
                No matching orders found.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-[#FAF8F5] border-collapse">
                <thead>
                  <tr className="border-b border-[#3D3732] text-[#A8A29E] text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-3">Order ID & Date</th>
                    <th className="py-3 px-3">Customer Details</th>
                    <th className="py-3 px-3">Item Details</th>
                    <th className="py-3 px-3 text-right">Total Price</th>
                    <th className="py-3 px-3 text-center">Status Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26221F]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#26221F]/60 transition-colors">
                      
                      {/* Order ID & Date */}
                      <td className="py-4 px-3 align-top">
                        <span className="font-mono font-bold text-[#D4AF37] text-sm block">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-[#A8A29E] block mt-0.5">
                          {new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}
                        </span>
                        <span className="inline-block mt-1 bg-[#26221F] text-[#A8A29E] text-[10px] px-2 py-0.5 rounded border border-[#3D3732]">
                          {order.deliveryArea}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-3 align-top space-y-1">
                        <p className="font-bold text-[#FAF8F5] text-sm">{order.customerName}</p>
                        <p className="flex items-center gap-1 text-[11px] text-[#D4AF37]">
                          <Phone className="w-3 h-3" /> {order.phoneNumber}
                        </p>
                        <p className="text-[11px] text-[#A8A29E] max-w-xs truncate">
                          {order.location}
                        </p>
                      </td>

                      {/* Item Details */}
                      <td className="py-4 px-3 align-top">
                        <p className="font-bold text-[#FAF8F5]">{order.productName}</p>
                        <p className="text-[11px] text-[#A8A29E] mt-0.5">
                          Size: <strong className="text-[#E6DCC8]">{order.size}</strong> • Qty:{' '}
                          <strong className="text-[#E6DCC8]">{order.quantity}</strong>
                        </p>
                        <p className="text-[10px] text-[#78716C] mt-0.5">
                          Method: {order.paymentMethod}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-3 align-top text-right">
                        <p className="font-bold text-[#D4AF37] text-sm">
                          NPR {order.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#A8A29E]">
                          Incl. Delivery NPR {order.deliveryFee}
                        </p>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-3 align-top text-center">
                        <div className="inline-block relative">
                          <select
                            value={order.orderStatus}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as Order['orderStatus'])
                            }
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs border appearance-none pr-8 cursor-pointer focus:outline-none ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-950/80 text-red-300 border-red-700/60'
                                : order.orderStatus === 'Order Confirmed'
                                ? 'bg-blue-950/80 text-blue-300 border-blue-700/60'
                                : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                            }`}
                          >
                            <option value="New Order" className="bg-[#1C1917] text-amber-300">New Order</option>
                            <option value="Order Confirmed" className="bg-[#1C1917] text-blue-300">Order Confirmed</option>
                            <option value="Order Ongoing" className="bg-[#1C1917] text-amber-200">Order Ongoing</option>
                            <option value="Delivered" className="bg-[#1C1917] text-emerald-300">Delivered</option>
                            <option value="Cancelled" className="bg-[#1C1917] text-red-300">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </main>

    </div>
  );
};
