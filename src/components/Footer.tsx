import React from 'react';
import { Coffee, MapPin, Phone, Instagram, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-[#24130B] text-[#D8C7B5] pt-16 pb-12 border-t border-[#3D2517]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4A2D1B] to-[#1C0E07] flex items-center justify-center text-white border border-[#D4AF37]/40">
                <Coffee className="w-5 h-5 text-[#E8D8C8]" />
              </div>
              <span className="text-xl font-black text-white">کافه لمیز</span>
            </div>
            <p className="text-xs text-[#BFAEA0] leading-relaxed">
              برشته‌کاری تخصصی و کافه‌های زنجیره‌ای لمیز با بیش از دو دهه تجربه در ارائه باکیفیت‌ترین دانه‌های قهوه تازه‌برشت و فرهنگ اصیل قهوه در ایران.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#E8D8C8] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                نماد اعتماد الکترونیک
              </span>
              <span>•</span>
              <span>درگاه امن شاپرک</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white border-r-2 border-[#D4AF37] pr-2.5">
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('menu')} className="hover:text-white transition-colors">
                  منوی کامل محصولات
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('cart')} className="hover:text-white transition-colors">
                  سبد خرید و ثبت سفارش
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracker')} className="hover:text-white transition-colors">
                  پیگیری لحظه‌ای سفارش
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('loyalty')} className="hover:text-white transition-colors">
                  باشگاه مشتریان لمیز کلاب
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">
                  ورود به پنل مدیریت کافه
                </button>
              </li>
            </ul>
          </div>

          {/* Famous Branches */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white border-r-2 border-[#D4AF37] pr-2.5">
              شعب منتخب کافه لمیز
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BFAEA0]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>شعبه تجریش: میدان تجریش، ابتدای خیابان ولیعصر (سفارش آنلاین فعال)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>شعبه ولیعصر: بالاتر از زرتشت، پلاک ۱۸۹۴</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>شعبه سعادت‌آباد: بلوار دریا، تقاطع مطهری</span>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white border-r-2 border-[#D4AF37] pr-2.5">
              ساعات کاری و پشتیبانی
            </h4>
            <div className="space-y-2 text-xs text-[#BFAEA0]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>ساعت کاری: همه‌روزه از ۰۷:۰۰ صبح الی ۲۳:۳۰ شب</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>تلفن تماس مرکزی: ۰۲۱-۲۲۷۰۰۰۰۰</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span className="dir-ltr font-mono">@lamizcoffee</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#3D2517] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E8B7C] gap-3">
          <p>© تمامی حقوق برای شرکت برشته‌کاری و کافه‌های لمیز محفوظ است.</p>
          <div className="flex items-center gap-1">
            <span>طراحی شده با عشق به قهوه</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
