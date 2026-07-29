import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, ArrowRight, PhoneCall } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface FinalCTASectionProps {
  onOrderClick: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onOrderClick }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#1C1917] text-[#FAF8F5] relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest">
            Limited Stock Available in Nepal
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF8F5] leading-tight">
            Elevate Your Everyday Style Today
          </h2>
          <p className="text-sm sm:text-base text-[#E6DCC8] max-w-2xl mx-auto font-sans leading-relaxed">
            Get the {PINP_PRODUCT.name} delivered straight to your door with Cash On Delivery. Pay only after inspecting your order.
          </p>
        </div>

        {/* Offer Box */}
        <div className="p-6 bg-[#26221F] rounded-2xl border border-[#D4AF37]/30 max-w-xl mx-auto shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-xs text-[#A8A29E] uppercase tracking-wider font-bold">
              Special Offer Price
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-serif text-3xl font-bold text-[#D4AF37]">
                NPR {PINP_PRODUCT.offerPrice}
              </span>
              <span className="text-sm text-[#78716C] line-through">
                NPR {PINP_PRODUCT.regularPrice}
              </span>
            </div>
            <p className="text-[11px] text-[#166534] font-medium bg-[#166534]/20 px-2 py-0.5 rounded mt-1 inline-block">
              Free Delivery in Kathmandu Valley
            </p>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] px-8 py-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
            <span>Order Cash On Delivery</span>
          </button>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto bg-[#FAF8F5] hover:bg-[#EFE8DA] text-[#1C1917] px-8 py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Purchase Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOrderClick}
            className="w-full sm:w-auto bg-transparent border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 text-[#FAF8F5] px-8 py-3.5 rounded-full font-bold text-sm transition-all"
          >
            <span>Buy Now (COD)</span>
          </button>
        </div>

        {/* Trust row */}
        <div className="pt-6 border-t border-[#332E2A] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#A8A29E]">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>100% Cash On Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
            <span>Express 1-2 Day Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
            <span>Helpline Support</span>
          </div>
        </div>

      </div>
    </section>
  );
};
