import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx((current) => (current === idx ? null : idx));
  };

  return (
    <section className="py-16 bg-[#F4EFE6] border-b border-[#E0D8C8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            Everything you need to know about placing a Cash On Delivery order with PinP.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {PINP_PRODUCT.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-xl border border-[#E2D9C8] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[#1C1917] hover:bg-[#F8F4EA] transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#C59B27] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C6D3B] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#1C1917]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans border-t border-[#E8E0D0] pt-3 bg-[#FAF8F5]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
