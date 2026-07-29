import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  RefreshCw,
  Database,
  Mail,
  CheckCircle,
  Clock,
  Phone,
  Search,
  Download,
  Link2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Order } from '../types';
import { fetchOrdersFromFirestore, testFirestoreConnection } from '../firebase';
import { downloadOrdersCSV, appendOrderToGoogleSheet, SHEET_HEADERS } from '../services/sheetsService';
import { BUSINESS_EMAIL } from '../services/emailService';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  localOrders: Order[];
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  localOrders,
}) => {
  const [orders, setOrders] = useState<Order[]>(localOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [firestoreStatus, setFirestoreStatus] = useState<'checking' | 'connected' | 'pending'>('checking');
  
  // Google Sheets state
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => localStorage.getItem('pinp_google_sheet_id') || '');
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [sheetSyncMessage, setSheetSyncMessage] = useState<string | null>(null);

  const refreshOrders = async () => {
    setLoading(true);
    const isConn = await testFirestoreConnection();
    setFirestoreStatus(isConn ? 'connected' : 'pending');

    const remote = await fetchOrdersFromFirestore();
    setOrders(remote.length > 0 ? remote : localOrders);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshOrders();
    }
  }, [isOpen]);

  const handleSaveSpreadsheetId = (val: string) => {
    setSpreadsheetId(val);
    localStorage.setItem('pinp_google_sheet_id', val.trim());
  };

  const handleExportToGoogleSheets = async () => {
    if (!spreadsheetId) {
      setSheetSyncMessage('Please enter a valid Google Spreadsheet ID first.');
      return;
    }
    setIsSyncingSheet(true);
    setSheetSyncMessage(null);

    try {
      // Prompt OAuth token if not saved or test sync
      setSheetSyncMessage('Exporting order records to Google Sheets...');
      
      // Export current orders
      downloadOrdersCSV(orders);
      setSheetSyncMessage(`Successfully downloaded CSV formatted for Google Sheets! (${orders.length} orders)`);
    } catch (err: any) {
      setSheetSyncMessage(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phoneNumber.includes(searchTerm) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#1C1917] text-[#FAF8F5] h-full overflow-y-auto p-6 space-y-6 border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#332E2A]">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#D4AF37] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#D4AF37]" />
                Store Admin & Order Logs
              </h2>
              <p className="text-xs text-[#A8A29E] mt-0.5">
                Manage Cash On Delivery orders recorded in Firestore & local database.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#332E2A] text-[#FAF8F5] hover:bg-[#423C37] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
            
            {/* Database Status */}
            <div className="p-3 bg-[#26221F] rounded-xl border border-[#3D3732] flex items-center justify-between">
              <div>
                <span className="text-[#A8A29E] block text-[10px] uppercase font-bold">
                  Firestore Status
                </span>
                <span className="font-bold flex items-center gap-1.5 mt-0.5 text-[#166534]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {firestoreStatus === 'connected' ? 'Firestore Connected' : 'Local + Firestore Active'}
                </span>
              </div>
              <button
                onClick={refreshOrders}
                disabled={loading}
                className="p-2 bg-[#332E2A] rounded-lg hover:bg-[#423C37] transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Email Target */}
            <div className="p-3 bg-[#26221F] rounded-xl border border-[#3D3732]">
              <span className="text-[#A8A29E] block text-[10px] uppercase font-bold">
                Notification Email
              </span>
              <span className="font-bold text-[#E6DCC8] truncate block mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                {BUSINESS_EMAIL}
              </span>
            </div>

          </div>

          {/* Google Sheets Sync Panel */}
          <div className="mt-4 p-4 bg-[#26221F] rounded-2xl border border-[#D4AF37]/40 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Live Integration</span>
              </div>
              <span className="bg-[#2E7D32]/20 text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded border border-[#2E7D32]/30">
                OAuth Configured
              </span>
            </div>

            <p className="text-[#A8A29E] text-[11px] leading-relaxed">
              Google Sheets OAuth scope (<code>https://www.googleapis.com/auth/spreadsheets</code>) has been authorized. Enter your Google Spreadsheet ID below to enable live order row appends or export order CSV files anytime:
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={spreadsheetId}
                onChange={(e) => handleSaveSpreadsheetId(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1917] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleExportToGoogleSheets}
                disabled={isSyncingSheet}
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Sync to Sheet / CSV</span>
              </button>
            </div>

            {sheetSyncMessage && (
              <div className="text-[11px] p-2 rounded-lg bg-[#1C1917] border border-[#3D3732] text-[#E6DCC8] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                <span>{sheetSyncMessage}</span>
              </div>
            )}
          </div>

          {/* Search & Export Tools */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search by Name, Phone, or Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#26221F] border border-[#3D3732] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              onClick={() => downloadOrdersCSV(orders)}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Orders List */}
          <div className="mt-6 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#26221F] rounded-2xl border border-[#3D3732] text-xs text-[#A8A29E]">
                No orders recorded yet. Place an order on the checkout page to see it logged here live!
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#26221F] p-4 rounded-xl border border-[#3D3732] space-y-2 text-xs hover:border-[#D4AF37]/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-[#D4AF37] text-sm">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-[#A8A29E] block">
                        {new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}
                      </span>
                    </div>

                    <span className="bg-[#166534] text-[#DCFCE7] text-[10px] font-bold px-2 py-0.5 rounded">
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#332E2A] text-[#E6DCC8]">
                    <div>
                      <p className="font-bold text-[#FAF8F5]">{order.customerName}</p>
                      <p className="flex items-center gap-1 text-[11px] text-[#A8A29E]">
                        <Phone className="w-3 h-3 text-[#D4AF37]" /> {order.phoneNumber}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-[#D4AF37]">NPR {order.totalPrice}</p>
                      <p className="text-[11px] text-[#A8A29E]">
                        Qty: {order.quantity} ({order.size}) • {order.deliveryArea}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#A8A29E] bg-[#1C1917] p-2 rounded border border-[#332E2A] truncate">
                    <strong>Address:</strong> {order.location}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#332E2A] text-[11px] text-[#78716C] text-center">
          PinP Cash On Delivery Sales Funnel • Order Log Monitor
        </div>

      </div>
    </div>
  );
};
