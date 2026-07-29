import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Compass,
} from 'lucide-react';
import { PINP_PRODUCT } from '../data/productData';

interface ProductShowcaseProps {
  onProceedToCheckout: (quantity: number, size: string, deliveryArea: 'Kathmandu Valley' | 'Outside Kathmandu Valley') => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onProceedToCheckout }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('L');
  const [deliveryArea, setDeliveryArea] = useState<'Kathmandu Valley' | 'Outside Kathmandu Valley'>('Kathmandu Valley');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const deliveryFee = deliveryArea === 'Kathmandu Valley' ? 0 : 50;
  const unitPrice = PINP_PRODUCT.offerPrice;
  const subtotal = unitPrice * quantity;
  const totalPrice = subtotal + deliveryFee;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? PINP_PRODUCT.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === PINP_PRODUCT.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="showcase" className="py-16 bg-[#FAF8F5] border-b border-[#E0D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Interactive Showcase & Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
            Craftsmanship in Every Detail
          </h2>
          <p className="text-sm text-[#57534E] mt-2">
            Select your preferred size, delivery location, and quantity below to place your Cash On Delivery order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Side: Image Gallery & Carousel */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E0D8C8] shadow-lg aspect-[3/4] group">
              <img
                src={PINP_PRODUCT.images[selectedImageIndex]}
                alt={`${PINP_PRODUCT.name} view ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1C1917]/70 text-white hover:bg-[#1C1917] flex items-center justify-center backdrop-blur-sm transition-all border border-[#D4AF37]/30 shadow-md"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1C1917]/70 text-white hover:bg-[#1C1917] flex items-center justify-center backdrop-blur-sm transition-all border border-[#D4AF37]/30 shadow-md"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Fullscreen Zoom Trigger */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 bg-[#1C1917]/80 text-[#FAF8F5] p-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm hover:bg-[#1C1917] border border-[#D4AF37]/30 transition-all shadow-md"
              >
                <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Enlarge View</span>
              </button>

              {/* Image Counter Badge */}
              <div className="absolute top-4 left-4 bg-[#1C1917]/80 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-[#D4AF37]/30">
                {selectedImageIndex + 1} / {PINP_PRODUCT.images.length}
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-3">
              {PINP_PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#1C1917] ring-2 ring-[#D4AF37] scale-95 shadow-md'
                      : 'border-[#E0D8C8] opacity-70 hover:opacity-100 hover:border-[#A89F91]'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quality Note */}
            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E0D8C8] text-xs text-[#57534E] flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#C59B27] shrink-0" />
              <span>
                <strong>Original Photography:</strong> 100% genuine product shots. What you see is exactly what will be delivered to your doorstep.
              </span>
            </div>

          </div>

          {/* Right Side: Specifications & Order Customizer */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Brand */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8C6D3B]">
                {PINP_PRODUCT.brand}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1 leading-snug">
                {PINP_PRODUCT.name}
              </h2>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2D9C8] flex items-center justify-between shadow-sm">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#1C1917] font-serif">
                    NPR {PINP_PRODUCT.offerPrice}
                  </span>
                  <span className="text-base text-[#78716C] line-through font-serif">
                    NPR {PINP_PRODUCT.regularPrice}
                  </span>
                </div>
                <p className="text-xs text-[#166534] font-medium mt-0.5">
                  Save NPR {PINP_PRODUCT.regularPrice - PINP_PRODUCT.offerPrice} per shirt!
                </p>
              </div>

              <div className="text-right">
                <span className="bg-[#1C1917] text-[#D4AF37] text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider block">
                  Limited Offer
                </span>
                <span className="text-[11px] text-[#57534E] mt-1 block">
                  Cash On Delivery
                </span>
              </div>
            </div>

            {/* Key Benefits List */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                Key Product Highlights
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#44403C]">
                {PINP_PRODUCT.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#1C1917]">{benefit.title}:</strong> {benefit.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-[#1C1917] uppercase tracking-wider">
                  Select Size
                </label>
                <span className="text-[#78716C]">Standard Fit (Relaxed Cut)</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {PINP_PRODUCT.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#1C1917] text-[#D4AF37] border-[#1C1917] shadow-md scale-[1.02]'
                        : 'bg-[#FAF8F5] text-[#292524] border-[#E0D8C8] hover:border-[#1C1917]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Area Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block">
                Delivery Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryArea('Kathmandu Valley')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    deliveryArea === 'Kathmandu Valley'
                      ? 'bg-[#FAF8F5] border-[#1C1917] ring-2 ring-[#D4AF37]'
                      : 'bg-white border-[#E0D8C8] hover:border-[#1C1917]'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-xs text-[#1C1917]">Kathmandu Valley</span>
                    <span className="text-[11px] text-[#166534] font-semibold">FREE Delivery (1-2 Days)</span>
                  </div>
                  <Truck className="w-5 h-5 text-[#C59B27]" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryArea('Outside Kathmandu Valley')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    deliveryArea === 'Outside Kathmandu Valley'
                      ? 'bg-[#FAF8F5] border-[#1C1917] ring-2 ring-[#D4AF37]'
                      : 'bg-white border-[#E0D8C8] hover:border-[#1C1917]'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-xs text-[#1C1917]">Outside Valley</span>
                    <span className="text-[11px] text-[#8C6D3B] font-semibold">NPR 50 Delivery Fee</span>
                  </div>
                  <Truck className="w-5 h-5 text-[#8C6D3B]" />
                </button>
              </div>
            </div>

            {/* Quantity Selector & Live Total Price Calculation */}
            <div className="p-4 bg-[#F4EFE6] rounded-xl border border-[#E0D8C8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Quantity
                </span>

                <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#D8CFC0] rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-md bg-[#E8E0D0] text-[#1C1917] hover:bg-[#D4AF37] hover:text-[#1C1917] flex items-center justify-center font-bold transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-bold text-base text-[#1C1917]">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-md bg-[#E8E0D0] text-[#1C1917] hover:bg-[#D4AF37] hover:text-[#1C1917] flex items-center justify-center font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#E0D8C8] space-y-1.5 text-xs text-[#57534E]">
                <div className="flex justify-between">
                  <span>Shirt ({quantity} x NPR {unitPrice}):</span>
                  <span className="font-semibold text-[#1C1917]">NPR {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({deliveryArea}):</span>
                  <span className="font-semibold text-[#166534]">
                    {deliveryFee === 0 ? 'FREE' : `NPR ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E0D8C8] text-sm font-bold text-[#1C1917]">
                  <span>Total Amount Payable (COD):</span>
                  <span className="text-base text-[#1C1917] font-serif">
                    NPR {totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onProceedToCheckout(quantity, selectedSize, deliveryArea)}
                className="w-full bg-[#1C1917] hover:bg-[#292524] text-[#FAF8F5] py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/40 group"
              >
                <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Order Cash On Delivery Now — NPR {totalPrice}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onProceedToCheckout(quantity, selectedSize, deliveryArea)}
                  className="bg-[#EFE8DA] hover:bg-[#E4DBC8] text-[#1C1917] py-3 rounded-xl font-semibold text-xs border border-[#C8BEA8] transition-all text-center"
                >
                  Buy Now (COD)
                </button>
                <button
                  onClick={() => onProceedToCheckout(quantity, selectedSize, deliveryArea)}
                  className="bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#1C1917] py-3 rounded-xl font-semibold text-xs border border-[#D8CFC0] transition-all text-center"
                >
                  Purchase Now
                </button>
              </div>
            </div>

            {/* Guarantee badges */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-[11px] text-[#78716C]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                <span>No Advance Payment Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#C59B27]" />
                <span>3 Days Size Exchange Policy</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Fullscreen Enlarge Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={PINP_PRODUCT.images[selectedImageIndex]}
              alt="Expanded view"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};
