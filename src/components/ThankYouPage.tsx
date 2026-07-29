import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  PhoneCall,
  ShoppingBag,
  Printer,
  Home,
  Truck,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { Order } from '../types';

interface ThankYouPageProps {
  order: Order;
  onBackToHome: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order, onBackToHome }) => {
  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#C59B27', '#1C1917', '#FAF8F5', '#E6DCC8', '#2E7D32'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#D4AF37', '#C59B27', '#1C1917', '#FAF8F5', '#E6DCC8', '#2E7D32'],
      });
    }, 250);
  };

  useEffect(() => {
    triggerConfetti();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E0D8C8] shadow-lg text-center space-y-4 relative overflow-hidden">
          
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-[#E2F0D9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner border border-[#C5E0B4] animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <button
              onClick={triggerConfetti}
              title="Re-trigger Confetti Celebration"
              className="absolute -bottom-1 -right-1 bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] p-2 rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 border border-[#1C1917]/20"
            >
              <PartyPopper className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-[#57534E]">
              Order Reference ID: <strong className="font-mono text-[#1C1917] bg-[#F4EFE6] px-2 py-0.5 rounded border border-[#E0D8C8]">{order.id}</strong>
            </p>
          </div>

          {/* Prominent Callout Message */}
          <div className="p-4 bg-[#FFF8E6] border-l-4 border-[#D4AF37] rounded-r-xl text-left text-xs sm:text-sm text-[#7A5800] space-y-1 my-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1C1917]">
              <PhoneCall className="w-4 h-4 text-[#C59B27]" />
              <span>Next Step: Order Confirmation Call</span>
            </div>
            <p>
              Our sales representative will call you soon at <strong className="text-[#1C1917]">{order.phoneNumber}</strong> to confirm your order details and dispatch your package.
            </p>
          </div>

          <p className="text-xs text-[#78716C]">
            A confirmation receipt has also been sent to <strong>{order.email}</strong>.
          </p>

        </div>

        {/* Order Receipt Details Card */}
        <div className="bg-[#1C1917] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#332E2A]">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#D4AF37]">
                Order Receipt Summary
              </h3>
              <p className="text-xs text-[#A8A29E] mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}
              </p>
            </div>

            <span className="bg-[#166534] text-[#DCFCE7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {order.orderStatus}
            </span>
          </div>

          {/* Customer & Address Details Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#26221F] p-4 rounded-2xl border border-[#3D3732]">
            <div className="space-y-1.5">
              <span className="text-[#A8A29E] font-bold uppercase tracking-wider block text-[10px]">
                Customer Contact
              </span>
              <p className="font-bold text-sm text-[#FAF8F5]">{order.customerName}</p>
              <p className="text-[#E6DCC8]">{order.phoneNumber}</p>
              <p className="text-[#E6DCC8] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                {order.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#A8A29E] font-bold uppercase tracking-wider block text-[10px]">
                Delivery Address
              </span>
              <p className="font-semibold text-[#FAF8F5] flex items-start gap-1">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{order.location}</span>
              </p>
              <p className="text-[#E6DCC8]">Region: {order.deliveryArea}</p>
            </div>
          </div>

          {/* Product & Payment Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Itemized Breakdown
            </h4>

            <div className="bg-[#26221F] p-4 rounded-2xl border border-[#3D3732] space-y-3 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#332E2A]">
                <div>
                  <p className="font-bold text-sm text-[#FAF8F5]">{order.productName}</p>
                  <p className="text-[11px] text-[#A8A29E]">
                    Size: <strong className="text-[#D4AF37]">{order.size}</strong> • Brand: PinP
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[#FAF8F5]">
                    {order.quantity} x NPR {order.pricePerPiece}
                  </p>
                  <p className="text-[11px] text-[#A8A29E]">NPR {order.quantity * order.pricePerPiece}</p>
                </div>
              </div>

              <div className="flex justify-between text-[#E6DCC8]">
                <span>Delivery Charge ({order.deliveryArea}):</span>
                <span className="font-semibold text-[#166534]">
                  {order.deliveryFee === 0 ? 'FREE' : `NPR ${order.deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-[#E6DCC8]">
                <span>Payment Method:</span>
                <span className="font-bold text-[#D4AF37] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-[#3D3732] text-base font-bold text-[#FAF8F5]">
                <span>Total Amount Payable on Delivery:</span>
                <span className="text-lg text-[#D4AF37] font-serif">
                  NPR {order.totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#332E2A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-[#332E2A] hover:bg-[#423C37] text-[#FAF8F5] px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print Invoice Receipt</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#1C1917]" />
              <span>Back to Home Page</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
