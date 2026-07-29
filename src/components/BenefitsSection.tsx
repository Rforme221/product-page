import React from 'react';
import { Feather, Compass, Sparkles, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface BenefitsSectionProps {
  onOrderClick: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Feather: <Feather className="w-6 h-6 text-[#D4AF37]" />,
  Compass: <Compass className="w-6 h-6 text-[#D4AF37]" />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
  Sliders: <Sliders className="w-6 h-6 text-[#D4AF37]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
};

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ onOrderClick }) => {
  return (
    <section className="py-16 bg-[#F4EFE6] border-b border-[#E0D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Why Choose PinP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Engineered For Comfort & Distinction
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            Every stitch and print is tailored to give you an exclusive nautical aesthetic without sacrificing daily comfort.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PINP_PRODUCT.benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E2D9C8] shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1C1917] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                {iconMap[benefit.icon] || <Sparkles className="w-6 h-6 text-[#D4AF37]" />}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}

          {/* Special Cash on Delivery Guarantee Card */}
          <div className="bg-[#1C1917] p-6 rounded-2xl border border-[#D4AF37]/30 text-[#FAF8F5] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FAF8F5] mb-2">
                Risk-Free Cash On Delivery
              </h3>
              <p className="text-xs sm:text-sm text-[#E6DCC8] leading-relaxed">
                Pay only when the shirt is delivered to your hands. No credit card or pre-payment required.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#333]">
              <button
                onClick={onOrderClick}
                className="w-full bg-[#D4AF37] hover:bg-[#C59B27] text-[#1C1917] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Order Now (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-3 bg-[#1C1917] hover:bg-[#292524] text-[#FAF8F5] px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all border border-[#D4AF37]/40"
          >
            <span>Claim Your Henley Shirt Now — NPR {PINP_PRODUCT.offerPrice}</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

      </div>
    </section>
  );
};
