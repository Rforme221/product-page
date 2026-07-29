import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#FAF8F5] border-b border-[#E0D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Real Customer Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Loved Across Nepal
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            Read what verified buyers have to say about our fabric quality, compass print artwork, and express COD delivery.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PINP_PRODUCT.testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F4EFE6] p-6 rounded-2xl border border-[#E2D9C8] shadow-sm flex flex-col justify-between relative group hover:border-[#D4AF37] transition-all"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[#D4AF37]/20 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex text-[#D4AF37] gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-xs sm:text-sm text-[#292524] italic leading-relaxed mb-6 font-serif">
                  "{t.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-[#E0D8C8] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917] font-sans">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-[#78716C]">
                    {t.location}, Nepal
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#E2F0D9] px-2.5 py-1 rounded-full border border-[#C5E0B4]">
                  <CheckCircle className="w-3 h-3 text-[#2E7D32]" />
                  <span>Verified Buyer</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Aggregate Social Proof Counter */}
        <div className="mt-10 p-4 bg-[#1C1917] rounded-xl text-[#FAF8F5] max-w-xl mx-auto flex items-center justify-between gap-4 border border-[#D4AF37]/30 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-serif font-bold text-lg">98.4%</span>
            <span>Customer Satisfaction Rating</span>
          </div>
          <div className="text-right text-[#E6DCC8] text-xs">
            <span>Fast 1-2 Day Delivery in Valley</span>
          </div>
        </div>

      </div>
    </section>
  );
};
