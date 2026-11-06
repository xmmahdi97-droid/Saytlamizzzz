import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MenuSection } from './components/Menu/MenuSection';
import { CartSection } from './components/Cart/CartSection';
import { OrderTracker } from './components/Tracking/OrderTracker';
import { LoyaltyCard } from './components/Loyalty/LoyaltyCard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { PaymentModal } from './components/Checkout/PaymentModal';
import { SMSModal } from './components/SMS/SMSModal';
import { Footer } from './components/Footer';
import { 
  Coffee, 
  ShoppingBag, 
  Clock, 
  Award, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, cart, activeOrder, unreadSmsCount, setIsSMSModalOpen } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#2C1810]">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {activeTab === 'menu' && <MenuSection />}
        {activeTab === 'cart' && <CartSection />}
        {activeTab === 'tracker' && <OrderTracker />}
        {activeTab === 'loyalty' && <LoyaltyCard />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Global Modals */}
      <PaymentModal />
      <SMSModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE2D7] px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'menu' ? 'text-[#6F4E37] font-bold' : 'text-[#826E61]'
          }`}
        >
          <Coffee className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">منو محصولات</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'cart' ? 'text-[#6F4E37] font-bold' : 'text-[#826E61]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#2C1810] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">سبد خرید</span>
        </button>

        <button
          onClick={() => setActiveTab('tracker')}
          className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'tracker' ? 'text-[#6F4E37] font-bold' : 'text-[#826E61]'
          }`}
        >
          <div className="relative">
            <Clock className="w-5 h-5 mb-0.5" />
            {activeOrder && activeOrder.status !== 'delivered' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </div>
          <span className="text-[10px]">رهگیری</span>
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'loyalty' ? 'text-[#6F4E37] font-bold' : 'text-[#826E61]'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5 text-[#D4AF37]" />
          <span className="text-[10px]">لمیز کلاب</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            activeTab === 'admin' ? 'text-[#2C1810] font-black' : 'text-[#826E61]'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">مدیریت</span>
        </button>
      </div>

      {/* Floating SMS Button for Quick Access on Bottom Right */}
      <button
        onClick={() => setIsSMSModalOpen(true)}
        className="fixed bottom-20 md:bottom-6 left-6 z-30 p-3.5 rounded-2xl bg-[#2C1810] text-[#E8D8C8] shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-[#D4AF37]/40"
        title="صندوق پیامک‌های وضعیت سفارش"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          {unreadSmsCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
              {unreadSmsCount}
            </span>
          )}
        </div>
        <span className="hidden sm:inline font-bold text-xs">پیامک‌های لمیز</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
