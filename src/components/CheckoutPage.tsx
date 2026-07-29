import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';
import { submitOrderToFirestore } from '../firebase';
import { appendOrderToGoogleSheet, TARGET_SPREADSHEET_ID } from '../services/sheetsService';
import { sendOrderNotificationEmails } from '../services/emailService';

interface CheckoutPageProps {
  initialQuantity: number;
  initialSize: string;
  initialDeliveryArea: 'Kathmandu Valley' | 'Outside Kathmandu Valley';
  productName: string;
  pricePerPiece: number;
  onBackToProduct: () => void;
  onOrderSuccess: (order: Order) => void;
  googleSpreadsheetId?: string;
  googleAccessToken?: string | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialQuantity,
  initialSize,
  initialDeliveryArea,
  productName,
  pricePerPiece,
  onBackToProduct,
  onOrderSuccess,
  googleSpreadsheetId,
  googleAccessToken = null,
}) => {
  const activeSheetId = googleSpreadsheetId || localStorage.getItem('pinp_google_sheet_id') || TARGET_SPREADSHEET_ID;
  // Lock initial values passed from landing page
  const quantity = Math.max(1, initialQuantity);
  const size = initialSize || 'L';
  const price = pricePerPiece > 0 ? pricePerPiece : 139;

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'Kathmandu Valley' | 'Outside Kathmandu Valley'>(
    initialDeliveryArea
  );
  const [notes, setNotes] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const deliveryFee = deliveryArea === 'Kathmandu Valley' ? 0 : 50;
  const subtotal = price * quantity;
  const totalPrice = subtotal + deliveryFee;

  // Client-side Validation
  const validateForm = (): string | null => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      return 'Please enter your full name (minimum 2 characters).';
    }
    
    // Phone validation
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 7 || !/^[0-9+\-()]{7,20}$/.test(cleanPhone)) {
      return 'Please enter a valid phone number (e.g. 98XXXXXXXX).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }

    // Location validation
    if (!location.trim() || location.trim().length < 3) {
      return 'Kindly share your exact location (e.g. Street, Area, landmark).';
    }

    if (quantity < 1) {
      return 'Quantity must be at least 1.';
    }

    if (price <= 0 || totalPrice <= 0) {
      return 'Invalid order total price.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Client-side Validation
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Generate Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim().toLowerCase(),
      location: location.trim(),
      deliveryArea,
      productName,
      quantity,
      size,
      pricePerPiece: price,
      deliveryFee,
      totalPrice,
      paymentMethod: 'Cash On Delivery',
      orderStatus: 'New Order',
      notes: notes.trim() || undefined,
    };

    try {
      // 2. Write order to Firestore (with local resilience fallback)
      await submitOrderToFirestore(newOrder);

      // 3. Attempt Google Sheets row write via Workspace connector if connected
      if (activeSheetId && googleAccessToken) {
        try {
          await appendOrderToGoogleSheet(newOrder, activeSheetId, googleAccessToken);
        } catch (sheetErr) {
          console.warn('Sheets sync skipped/failed:', sheetErr);
        }
      }

      // 4. Trigger Email Notifications (Dispatches to rajshrestha021@gmail.com and customer)
      sendOrderNotificationEmails(newOrder).catch((err) =>
        console.warn('Email notification warning:', err)
      );

      // 5. Success -> Instantly show Thank You Page & Confetti
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Order submission error:', err);
      // 6. Failure -> Show clear inline error & do NOT redirect
      setErrorMessage(
        err.message || 'Something went wrong while submitting your order. Please try again or call us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0D8C8]">
          <button
            onClick={onBackToProduct}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Product Details</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#E2F0D9] px-3 py-1 rounded-full border border-[#C5E0B4]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Secure Cash On Delivery Checkout</span>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8 bg-[#F4EFE6] p-4 rounded-xl border border-[#E0D8C8] flex items-center justify-between text-xs font-bold text-[#57534E]">
          <div className="flex items-center gap-2 text-[#78716C]">
            <span className="w-6 h-6 rounded-full bg-[#E0D8C8] text-[#1C1917] flex items-center justify-center text-xs">1</span>
            <span className="hidden sm:inline">Product Selection</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-[#D8CFC0]"></div>
          <div className="flex items-center gap-2 text-[#1C1917]">
            <span className="w-6 h-6 rounded-full bg-[#1C1917] text-[#D4AF37] flex items-center justify-center text-xs">2</span>
            <span>Delivery Info</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-[#D8CFC0]"></div>
          <div className="flex items-center gap-2 text-[#78716C]">
            <span className="w-6 h-6 rounded-full bg-[#E0D8C8] text-[#1C1917] flex items-center justify-center text-xs">3</span>
            <span className="hidden sm:inline">Order Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-xl text-[#1C1917] pb-3 border-b border-[#E8E0D0]">
                Customer & Delivery Information
              </h3>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-4 bg-[#FEF2F2] border-l-4 border-[#DC2626] rounded-r-lg text-xs sm:text-sm text-[#991B1B] flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#DC2626]" />
                  <div>
                    <strong className="block font-bold">Submission Issue:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label htmlFor="customerName" className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  required
                  placeholder="e.g. Bikash Thapa"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8CFC0] focus:border-[#1C1917] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  placeholder="e.g. 98XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8CFC0] focus:border-[#1C1917] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none transition-all"
                />
                <span className="text-[11px] text-[#78716C] mt-1 block">
                  Our sales representative will call this number to confirm your order.
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. bikash@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8CFC0] focus:border-[#1C1917] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none transition-all"
                />
                <span className="text-[11px] text-[#78716C] mt-1 block">
                  An order confirmation email will be sent here.
                </span>
              </div>

              {/* Delivery Area Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Delivery Region <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryArea === 'Kathmandu Valley'
                        ? 'bg-[#FAF8F5] border-[#1C1917] ring-2 ring-[#D4AF37]'
                        : 'bg-white border-[#E0D8C8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryArea"
                        checked={deliveryArea === 'Kathmandu Valley'}
                        onChange={() => setDeliveryArea('Kathmandu Valley')}
                        className="accent-[#1C1917]"
                      />
                      <div>
                        <span className="block font-bold text-xs text-[#1C1917]">Kathmandu Valley</span>
                        <span className="text-[11px] text-[#166534] font-semibold">FREE Delivery</span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryArea === 'Outside Kathmandu Valley'
                        ? 'bg-[#FAF8F5] border-[#1C1917] ring-2 ring-[#D4AF37]'
                        : 'bg-white border-[#E0D8C8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryArea"
                        checked={deliveryArea === 'Outside Kathmandu Valley'}
                        onChange={() => setDeliveryArea('Outside Kathmandu Valley')}
                        className="accent-[#1C1917]"
                      />
                      <div>
                        <span className="block font-bold text-xs text-[#1C1917]">Outside Valley</span>
                        <span className="text-[11px] text-[#8C6D3B] font-semibold">NPR 50 Fee</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Exact Location */}
              <div>
                <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Exact Location / Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="location"
                  rows={3}
                  required
                  placeholder="Kindly share your exact location (e.g. House No., Street Name, Area, Landmark near Civil Hospital, Kathmandu)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8CFC0] focus:border-[#1C1917] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-1.5">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  id="notes"
                  type="text"
                  placeholder="e.g. Call before delivery, deliver after 2 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8CFC0] focus:border-[#1C1917] focus:ring-2 focus:ring-[#D4AF37]/30 text-sm outline-none transition-all"
                />
              </div>

            </div>

          </div>

          {/* Right Column: Auto-Filled Order Summary & COD Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#1C1917] text-[#FAF8F5] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#332E2A]">
                <h3 className="font-serif font-bold text-lg text-[#D4AF37]">
                  Order Summary
                </h3>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Auto-Filled
                </span>
              </div>

              {/* Locked Product Summary Box */}
              <div className="p-4 bg-[#26221F] rounded-xl border border-[#3D3732] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#FAF8F5]">
                      {productName}
                    </h4>
                    <p className="text-xs text-[#A8A29E] mt-0.5">
                      Size: <strong className="text-[#D4AF37]">{size}</strong> • Brand: PinP
                    </p>
                  </div>
                  <span className="bg-[#D4AF37] text-[#1C1917] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    100% COD
                  </span>
                </div>

                {/* Auto-filled & Locked Fields Indicator */}
                <div className="pt-3 border-t border-[#332E2A] space-y-2 text-xs">
                  <div className="flex justify-between text-[#E6DCC8]">
                    <span>Quantity:</span>
                    <span className="font-bold text-[#FAF8F5]">{quantity} pc(s)</span>
                  </div>
                  <div className="flex justify-between text-[#E6DCC8]">
                    <span>Price Per Piece:</span>
                    <span className="font-bold text-[#FAF8F5]">NPR {price}</span>
                  </div>
                  <div className="flex justify-between text-[#E6DCC8]">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#FAF8F5]">NPR {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#E6DCC8]">
                    <span>Delivery Charge ({deliveryArea}):</span>
                    <span className="font-bold text-[#166534]">
                      {deliveryFee === 0 ? 'FREE' : `NPR ${deliveryFee}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-3 border-t border-[#3D3732] text-base font-bold">
                    <span className="text-[#FAF8F5]">Total Payable on Delivery:</span>
                    <span className="text-[#D4AF37] font-serif text-lg">
                      NPR {totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="p-3.5 bg-[#FAF8F5] text-[#1C1917] rounded-xl flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#C59B27] shrink-0" />
                <div>
                  <strong className="block text-xs uppercase tracking-wider font-bold">
                    Payment Method: Cash On Delivery
                  </strong>
                  <p className="text-[11px] text-[#57534E] leading-tight mt-0.5">
                    No online or advance payment required. Pay cash to the delivery agent when your shirt arrives.
                  </p>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-[#A8934C] text-[#1C1917] py-4 px-6 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#1C1917]" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                    <span>Order Now — NPR {totalPrice} (COD)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#A8A29E] text-center leading-relaxed">
                By clicking "Order Now", your order will be placed instantly and assigned an Order ID.
              </p>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
