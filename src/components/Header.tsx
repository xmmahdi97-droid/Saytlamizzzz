import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coffee, 
  ShoppingBag, 
  Clock, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  Menu, 
  X,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { initAuth, googleSignIn, logout } from '../services/authService';
import { User } from 'firebase/auth';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    customer, 
    unreadSmsCount, 
    setIsSMSModalOpen,
    activeOrder
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
      }
    } catch (err) {
      console.error('Google Sign-in error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EAE2D7] shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#2C1810] text-[#E8D8C8] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>عضویت در «لمیز کلاب» با کارت وفاداری دیجیتال | سفارش آنلاین، تحویل سریع و کسب امتیاز با هر فنجان</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3D2314] to-[#1C0E07] flex items-center justify-center text-white shadow-md shadow-[#2C1810]/20 group-hover:scale-105 transition-transform duration-300 border border-[#D4AF37]/30">
              <Coffee className="w-6 h-6 text-[#E8D8C8]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#2C1810] tracking-tight">کافه لمیز</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#F4ECE1] text-[#6F4E37] border border-[#E0D3C1]">
                  LAMIZ COFFEE
                </span>
              </div>
              <span className="text-xs text-[#7A6253] font-medium">برشته‌کاری تخصصی و کافه‌های زنجیره‌ای</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#F7F3EE] p-1.5 rounded-2xl border border-[#E5DACD]">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'menu'
                  ? 'bg-white text-[#2C1810] shadow-xs shadow-black/5 font-bold text-[#6F4E37]'
                  : 'text-[#655246] hover:text-[#2C1810] hover:bg-white/50'
              }`}
            >
              <Coffee className="w-4 h-4 text-[#6F4E37]" />
              <span>منوی محصولات</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'tracker'
                  ? 'bg-white text-[#2C1810] shadow-xs shadow-black/5 font-bold text-[#6F4E37]'
                  : 'text-[#655246] hover:text-[#2C1810] hover:bg-white/50'
              }`}
            >
              <Clock className="w-4 h-4 text-[#6F4E37]" />
              <span>پیگیری سفارش</span>
              {activeOrder && activeOrder.status !== 'delivered' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-2 left-2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'loyalty'
                  ? 'bg-white text-[#2C1810] shadow-xs shadow-black/5 font-bold text-[#6F4E37]'
                  : 'text-[#655246] hover:text-[#2C1810] hover:bg-white/50'
              }`}
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>لمیز کلاب</span>
              <span className="bg-[#D4AF37]/15 text-[#996D12] text-xs px-2 py-0.5 rounded-full font-bold">
                {customer.points} امتیاز
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-[#2C1810] text-white shadow-xs font-bold'
                  : 'text-[#655246] hover:text-[#2C1810] hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>پنل مدیریت و انبار</span>
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* SMS Notifications Button */}
            <button
              onClick={() => setIsSMSModalOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#F7F3EE] hover:bg-[#EFE7DE] text-[#4A3B32] transition-colors border border-[#E5DACD]"
              title="پیامک‌های دریافتی وضعیت سفارش"
            >
              <MessageSquare className="w-5 h-5 text-[#6F4E37]" />
              {unreadSmsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadSmsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3D2314] to-[#25130A] text-white shadow-md shadow-[#2C1810]/15 hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span className="hidden sm:inline font-bold text-sm">سبد خرید</span>
              {totalCartCount > 0 && (
                <span className="bg-[#D4AF37] text-[#2C1810] font-black text-xs px-2 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Google Account Profile Button (Client-side Workspace Auth) */}
            <div className="hidden lg:flex items-center border-r border-[#E0D3C1] pr-2.5 mr-1">
              {googleUser ? (
                <div className="flex items-center gap-2 bg-[#F7F3EE] pl-3 pr-1 py-1 rounded-full border border-[#E5DACD]">
                  {googleUser.photoURL ? (
                    <img 
                      src={googleUser.photoURL} 
                      alt={googleUser.displayName || 'کاربر'} 
                      className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#2C1810] max-w-[100px] truncate">
                    {googleUser.displayName || googleUser.email?.split('@')[0]}
                  </span>
                  <button 
                    onClick={handleGoogleLogout}
                    title="خروج از حساب گوگل"
                    className="text-[#967C6D] hover:text-rose-600 p-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#4A3B32] hover:text-[#2C1810] bg-[#F7F3EE] hover:bg-[#EFE7DE] px-3 py-2 rounded-xl border border-[#E5DACD] transition-colors"
                  title="ورود با حساب گوگل جهت همگام‌سازی گوگل شیت"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{isLoggingIn ? 'در حال اتصال...' : 'اتصال گوگل'}</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#F7F3EE] text-[#4A3B32] border border-[#E5DACD]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE2D7] bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <button
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm ${
              activeTab === 'menu' ? 'bg-[#F5ECE1] text-[#2C1810] font-bold' : 'text-[#5A483E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-[#6F4E37]" />
              <span>منوی محصولات کافه لمیز</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab('tracker'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm ${
              activeTab === 'tracker' ? 'bg-[#F5ECE1] text-[#2C1810] font-bold' : 'text-[#5A483E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#6F4E37]" />
              <span>پیگیری وضعیت سفارش آنلاین</span>
            </div>
            {activeOrder && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                فعال
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('loyalty'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm ${
              activeTab === 'loyalty' ? 'bg-[#F5ECE1] text-[#2C1810] font-bold' : 'text-[#5A483E]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span>کارت وفاداری و لمیز کلاب</span>
            </div>
            <span className="text-xs bg-[#D4AF37]/20 text-[#8C6008] px-2 py-0.5 rounded-full font-black">
              {customer.points} امتیاز
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm ${
              activeTab === 'admin' ? 'bg-[#2C1810] text-white font-bold' : 'bg-[#F9F6F0] text-[#2C1810]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>پنل مدیریتی و انبارداری لمیز</span>
            </div>
          </button>

          {/* Mobile Google Auth */}
          <div className="pt-2 border-t border-[#EAE2D7]">
            {googleUser ? (
              <div className="flex items-center justify-between p-2 bg-[#F9F6F0] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2C1810]">
                    متصل به حساب گوگل: {googleUser.displayName}
                  </span>
                </div>
                <button 
                  onClick={handleGoogleLogout} 
                  className="text-xs text-rose-600 font-bold px-2 py-1"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#D5C7B8] bg-white text-xs font-bold text-[#2C1810]"
              >
                <span>ورود با حساب گوگل (اتصال Google Sheets)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
