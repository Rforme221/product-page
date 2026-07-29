import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductShowcase } from './components/ProductShowcase';
import { BenefitsSection } from './components/BenefitsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { MobileStickyBar } from './components/MobileStickyBar';
import { CheckoutPage } from './components/CheckoutPage';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminPage } from './components/AdminPage';
import { Order } from './types';
import { PINP_PRODUCT } from './data/productData';
import { getLocalOrders } from './firebase';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin'
    );
  });

  const [currentView, setCurrentView] = useState<'landing' | 'checkout' | 'thankyou'>('landing');

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#admin';
      setIsAdminRoute(isAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Selected Order Parameters passed from Landing Showcase to Checkout
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSize, setOrderSize] = useState('L');
  const [orderDeliveryArea, setOrderDeliveryArea] = useState<'Kathmandu Valley' | 'Outside Kathmandu Valley'>('Kathmandu Valley');

  // Placed Order for Thank You Page
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getLocalOrders());
  }, [currentView]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, isAdminRoute]);

  const handleOrderNowClick = () => {
    setCurrentView('checkout');
  };

  const handleProceedToCheckout = (
    quantity: number,
    size: string,
    deliveryArea: 'Kathmandu Valley' | 'Outside Kathmandu Valley'
  ) => {
    setOrderQuantity(quantity);
    setOrderSize(size);
    setOrderDeliveryArea(deliveryArea);
    setCurrentView('checkout');
  };

  const handleOrderSuccess = (completedOrder: Order) => {
    setPlacedOrder(completedOrder);
    setOrders((prev) => [completedOrder, ...prev]);
    setCurrentView('thankyou');
  };

  // Dedicated Protected /admin Route
  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#1C1917]">
      
      {/* Navigation Header */}
      <Navbar
        onOrderClick={handleOrderNowClick}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'landing' && (
          <>
            {/* Section 1: Hero */}
            <HeroSection onOrderClick={handleOrderNowClick} />

            {/* Section 2: Product Showcase & Customizer */}
            <ProductShowcase onProceedToCheckout={handleProceedToCheckout} />

            {/* Section 4: Benefits */}
            <BenefitsSection onOrderClick={handleOrderNowClick} />

            {/* Section 5: Testimonials */}
            <TestimonialsSection />

            {/* Section 6: FAQs */}
            <FAQSection />

            {/* Section 7: Final CTA */}
            <FinalCTASection onOrderClick={handleOrderNowClick} />

            {/* Mobile Bottom Floating CTA */}
            <MobileStickyBar onOrderClick={handleOrderNowClick} />
          </>
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            initialQuantity={orderQuantity}
            initialSize={orderSize}
            initialDeliveryArea={orderDeliveryArea}
            productName={PINP_PRODUCT.name}
            pricePerPiece={PINP_PRODUCT.offerPrice}
            onBackToProduct={() => setCurrentView('landing')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'thankyou' && placedOrder && (
          <ThankYouPage
            order={placedOrder}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#110F0E] text-[#8C827A] py-10 border-t border-[#26221F] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center font-bold font-serif text-sm">
              P
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-[#FAF8F5]">
                {PINP_PRODUCT.brand}
              </p>
              <p className="text-[11px] text-[#A8A29E]">
                Kathmandu, Nepal • Cash On Delivery Sales Funnel
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] space-y-1">
            <p>© {new Date().getFullYear()} PinP Shirts. All rights reserved.</p>
            <p className="text-[#D4AF37]">
              Business Email: rajshrestha021@gmail.com
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

