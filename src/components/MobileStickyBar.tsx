import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface MobileStickyBarProps {
  onOrderClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOrderClick }) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1C1917]/95 backdrop-blur-md border-t border-[#D4AF37]/30 p-3 shadow-2xl flex items-center justify-between gap-3">
      <div>
        <span className="text-[10px] text-[#A8A29E] uppercase tracking-wider block font-medium">
          COD Special Offer
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-[#D4AF37] font-serif">
            NPR {PINP_PRODUCT.offerPrice}
          </span>
          <span className="text-xs text-[#78716C] line-through font-serif">
            NPR {PINP_PRODUCT.regularPrice}
          </span>
        </div>
      </div>

      <button
        onClick={onOrderClick}
        className="flex-1 bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <ShoppingBag className="w-4 h-4 text-[#1C1917]" />
        <span>Order Cash On Delivery</span>
      </button>
    </div>
  );
};
