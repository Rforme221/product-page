import React from 'react';
import { ShoppingCart, ShieldCheck, ArrowRight, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface HeroSectionProps {
  onOrderClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOrderClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EFE8DA] py-12 sm:py-20 border-b border-[#E0D8C8]">
      
      {/* Decorative subtle background mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text & Conversion copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#E6DCC8] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1C1917] tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Limited Release • Exclusive Custom Print</span>
            </div>

            {/* Main Headline & Subheadline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1C1917] leading-[1.15] tracking-tight">
                {PINP_PRODUCT.name}
              </h1>
              <p className="text-lg sm:text-2xl text-[#8C6D3B] font-serif italic">
                Unfold your voyage with effortlessly relaxed nautical elegance.
              </p>
            </div>

            {/* Short Product Description */}
            <p className="text-sm sm:text-base text-[#44403C] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
              {PINP_PRODUCT.description}
            </p>

            {/* Price Banner */}
            <div className="flex items-center justify-center lg:justify-start gap-4 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#1C1917] font-serif">
                  NPR {PINP_PRODUCT.offerPrice}
                </span>
                <span className="text-lg text-[#78716C] line-through font-serif">
                  NPR {PINP_PRODUCT.regularPrice}
                </span>
              </div>
              <span className="bg-[#1C1917] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Save 30% Off
              </span>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-[#44403C] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-[#FAF8F5]/80 p-2.5 rounded-lg border border-[#E2D9C8]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>Cash On Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF8F5]/80 p-2.5 rounded-lg border border-[#E2D9C8]">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>Cotton-Linen Blend</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF8F5]/80 p-2.5 rounded-lg border border-[#E2D9C8] col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>Free Valley Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto bg-[#1C1917] hover:bg-[#292524] text-[#FAF8F5] px-8 py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/40 group"
              >
                <ShoppingCart className="w-5 h-5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                <span>Order Now (Cash On Delivery)</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto bg-[#EFE8DA] hover:bg-[#E4DBC8] text-[#1C1917] px-6 py-4 rounded-xl font-semibold text-base transition-all border border-[#C8BEA8] flex items-center justify-center gap-2"
              >
                <span>Purchase Now — NPR {PINP_PRODUCT.offerPrice}</span>
              </button>
            </div>

            {/* Testimonial snippet */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs text-[#57534E]">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-[#1C1917]">4.9/5</span>
              <span>• Loved by 500+ customers in Nepal</span>
            </div>

          </div>

          {/* Right Column: Hero Image (Single Flat-Lay Image) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer decorative frame */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/30 to-transparent blur-md"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 bg-[#FAF8F5] group">
                <img
                  src={PINP_PRODUCT.heroImage}
                  alt={PINP_PRODUCT.name}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlaid Badge */}
                <div className="absolute top-4 right-4 bg-[#1C1917]/90 text-[#D4AF37] backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/30 shadow-lg">
                  Original Hand-Drawn Art
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/30 to-transparent p-4 text-[#FAF8F5]">
                  <p className="font-serif font-bold text-sm sm:text-base">
                    Compass & Wave Chest Print
                  </p>
                  <p className="text-xs text-[#E6DCC8] opacity-90">
                    Mandarin Collar Henley Cut in Warm Sand
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
