import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Phone } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface NavbarProps {
  onOrderClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D5]">
      {/* Top Banner Notice */}
      <div className="bg-[#1C1917] text-[#D4AF37] px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2 tracking-wide">
        <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Cash On Delivery Available Nationwide in Nepal • Free Delivery inside Kathmandu Valley!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1917] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xl shadow-sm border border-[#D4AF37]/30">
              P
            </div>
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] tracking-tight block leading-none">
                PinP
              </span>
              <span className="text-[10px] text-[#78716C] uppercase tracking-widest block font-sans mt-0.5">
                Custom Printed Shirts
              </span>
            </div>
          </div>

          {/* Desktop Trust Badges */}
          <div className="hidden md:flex items-center gap-6 text-xs text-[#57534E]">
            <div className="flex items-center gap-1.5 bg-[#F5F0E6] px-3 py-1.5 rounded-full border border-[#E7DFD0]">
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
              <span className="font-medium text-[#292524]">100% Cash On Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span>Helpline: +977 9800000000</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOrderClick}
              className="relative bg-[#1C1917] hover:bg-[#292524] text-[#FAF8F5] px-4 sm:px-6 py-2.5 rounded-full font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[#D4AF37]/30 group"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Order Now — NPR {PINP_PRODUCT.offerPrice}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
