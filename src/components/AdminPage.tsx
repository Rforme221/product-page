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
  DollarSign,
  Check,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, fetchOrdersFromFirestore, updateOrderStatusInFirestore, testFirestoreConnection } from '../firebase';
import { Order } from '../types';
import { downloadOrdersCSV, TARGET_SPREADSHEET_ID, TARGET_SPREADSHEET_URL } from '../services/sheetsService';
import { BUSINESS_EMAIL } from '../services/emailService';

const AUTHORIZED_ADMIN_EMAIL = 'rajshrestha021@gmail.com';

export const AdminPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auth form states
  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Admin Dashboard states
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
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

  // Fetch orders when authorized admin is detected
  const loadOrders = async () => {
    setLoadingOrders(true);
    const isConn = await testFirestoreConnection();
    setFirestoreConnected(isConn);

    const fetched = await fetchOrdersFromFirestore();
    setOrders(fetched);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (currentUser && currentUser.email === AUTHORIZED_ADMIN_EMAIL) {
      loadOrders();
    }
  }, [currentUser]);

  // Handle Login or Initial Admin Account Setup
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (email.trim().toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setAuthError(`Only ${AUTHORIZED_ADMIN_EMAIL} is authorized to access the Admin Dashboard.`);
      return;
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setAuthLoading(true);
    try {
      if (isRegisterMode) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (!isRegisterMode) {
          setAuthError(
            'Invalid credentials or admin account not initialized yet. If this is your first login, click "First Time Setup" below.'
          );
        } else {
          setAuthError(err.message || 'Failed to create admin account.');
        }
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('Admin account already exists. Please sign in with your password.');
        setIsRegisterMode(false);
      } else {
        setAuthError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
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
          <p className="text-xs text-[#A8A29E] font-medium">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated or Unauthorized User -> Login Screen
  const isAuthorizedAdmin = currentUser && currentUser.email === AUTHORIZED_ADMIN_EMAIL;

  if (!currentUser || !isAuthorizedAdmin) {
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
              Protected Route • Authorized Personnel Only
            </p>
          </div>

          {/* Unauthorized account warning if logged in with wrong email */}
          {currentUser && !isAuthorizedAdmin && (
            <div className="p-4 bg-red-950/50 border border-red-500/40 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Access Denied</span>
              </div>
              <p className="text-red-200 text-[11px] leading-relaxed">
                Logged in as <strong>{currentUser.email}</strong>. Only <strong>{AUTHORIZED_ADMIN_EMAIL}</strong> is authorized to view store order records.
              </p>
              <button
                onClick={handleSignOut}
                className="w-full mt-2 bg-red-900/80 hover:bg-red-800 text-white py-1.5 rounded-xl font-bold text-xs transition-colors"
              >
                Sign Out & Retry
              </button>
            </div>
          )}

          {/* Login Form */}
          {(!currentUser || currentUser) && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1.5 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajshrestha021@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#26221F] border border-[#3D3732] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#26221F] border border-[#3D3732] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#1C1917]" />
                ) : (
                  <Lock className="w-4 h-4 text-[#1C1917]" />
                )}
                <span>{isRegisterMode ? 'Initialize Admin Account' : 'Authenticate & Sign In'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setAuthError(null);
                  }}
                  className="text-xs text-[#A8A29E] hover:text-[#D4AF37] underline transition-colors"
                >
                  {isRegisterMode
                    ? 'Already created password? Back to Sign In'
                    : 'First time logging in? Initialize password for rajshrestha021@gmail.com'}
                </button>
              </div>
            </form>
          )}

          <div className="text-[11px] text-[#78716C] text-center pt-2 border-t border-[#332E2A]">
            PinP Cash On Delivery Store • Firebase Authenticated Admin
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
                  Protected Route
                </span>
              </div>
              <p className="text-xs text-[#A8A29E]">
                Logged in as <strong className="text-[#E6DCC8]">{currentUser.email}</strong>
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
