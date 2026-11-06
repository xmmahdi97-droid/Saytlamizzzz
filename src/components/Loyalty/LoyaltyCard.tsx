import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Sparkles, 
  Coffee, 
  Gift, 
  TrendingUp, 
  Check, 
  QrCode, 
  Heart, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Ticket
} from 'lucide-react';
import { LOYALTY_REWARDS } from '../../data/mockData';
import confetti from 'canvas-confetti';

export const LoyaltyCard: React.FC = () => {
  const { customer, redeemReward, appliedRewardTitle, setActiveTab } = useApp();

  const handleRedeem = (reward: any) => {
    const success = redeemReward(reward);
    if (success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // Stamp progress (5 cups)
  const stamps = customer.stamps;

  // Tier info
  const tierNames = {
    bronze: 'عضو برنزی',
    silver: 'عضو نقره‌ای',
    gold: 'عضو طلایی (Gold VIP)',
    black: 'عضو لمیز بلک (VIP Elite)'
  };

  const tierColors = {
    bronze: 'from-[#4D3319] via-[#6F4E37] to-[#2B1B0E]',
    silver: 'from-[#4A5568] via-[#718096] to-[#2D3748]',
    gold: 'from-[#3D2314] via-[#634832] to-[#20120A]',
    black: 'from-[#1A1A1A] via-[#2D2D2D] to-[#0D0D0D]'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Page Title */}
      <div className="border-b border-[#EAE2D7] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-[#D4AF37]/20 text-[#8B620D] font-black px-2.5 py-0.5 rounded-full">
            LAMIZ CLUB
          </span>
          <span className="text-xs text-[#7A6354]">باشگاه وفاداری هوشمند مشتریان</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810]">کارت دیجیتال و امتیازات لمیز کلاب</h1>
        <p className="text-xs sm:text-sm text-[#7A6354] mt-1">
          با هر سفارش امتیاز کسب کنید، از استمپ‌کارت قهوه رایگان بگیرید و تحلیل هوشمند سلیقه خرید خود را ببینید.
        </p>
      </div>

      {/* Realistic Digital VIP Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#3D2314] via-[#2A160C] to-[#140B06]">
        
        {/* Decorative Watermark & Light streaks */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between min-h-[220px] space-y-6">
          
          {/* Card Top */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D4AF37]">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-white">کافه لمیز</span>
                  <span className="text-[10px] bg-[#D4AF37] text-[#2C1810] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    CLUB
                  </span>
                </div>
                <span className="text-xs text-[#D8C7B5] font-mono">LAMIZ DIGITAL CARD</span>
              </div>
            </div>

            <div className="text-left bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <span className="text-[10px] text-gray-300 block">سطح عضویت</span>
              <span className="text-xs font-black text-[#E8C868] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                {tierNames[customer.tier]}
              </span>
            </div>
          </div>

          {/* Card Middle: Points & Number */}
          <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
            <div>
              <span className="text-xs text-[#D4C4B3] block mb-1">موجودی امتیاز وفاداری</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#F4E3D0] tracking-tight">
                  {customer.points}
                </span>
                <span className="text-xs text-[#D4AF37] font-bold">امتیاز معادل {((customer.points) * 1000).toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/15 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-[#E8D8C8]" />
              <div className="text-left font-mono text-[11px] text-gray-300">
                <span className="block text-[9px] text-gray-400">کد عضویت</span>
                <span>{customer.id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Card Bottom: Holder Name & Total spent */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#D8C7B5]">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">دارنده کارت:</span>
              <span className="font-bold text-white text-sm">{customer.name}</span>
              <span className="text-gray-400">({customer.phone})</span>
            </div>

            <div>
              عضو از: <span className="font-semibold text-white">{customer.joinDate}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Digital Stamp Card (استمپ کارت ۵ فنجان) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE2D7] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#6F4E37]" />
            <h3 className="font-bold text-base text-[#2C1810]">استمپ‌کارت لمیز (۵ فنجان = ۱ فنجان رایگان)</h3>
          </div>
          <span className="text-xs bg-[#F5ECE1] text-[#6F4E37] font-bold px-3 py-1 rounded-full">
            {stamps} از ۵ استمپ دریافت شده
          </span>
        </div>

        <p className="text-xs text-[#7A6354]">
          با خرید هر نوشیدنی از منو، ۱ مُهر استمپ دیجیتال دریافت می‌کنید. با تکمیل ۵ استمپ، یک فنجان قهوه دمی یا لاته هدیه بگیرید!
        </p>

        <div className="grid grid-cols-5 gap-3 sm:gap-4 py-2">
          {[1, 2, 3, 4, 5].map((cupNum) => {
            const isStamped = cupNum <= stamps;
            const isGift = cupNum === 5;

            return (
              <div
                key={cupNum}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center ${
                  isStamped
                    ? 'bg-[#F7F2EC] border-[#6F4E37] text-[#6F4E37] shadow-xs'
                    : 'bg-[#FAF8F5] border-[#E8DDCE] text-gray-300'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                  isStamped ? 'bg-[#6F4E37] text-white scale-105 shadow-sm' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isStamped ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>

                <span className={`text-[10px] sm:text-xs font-bold ${
                  isStamped ? 'text-[#2C1810]' : 'text-gray-400'
                }`}>
                  {isGift ? '🎁 قهوه هدیه' : `فنجان ${cupNum}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Purchase Behavior Analytics (تحلیل رفتار خرید و هوش تجاری مشتری) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE2D7] shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-[#F2ECE3] pb-3">
          <TrendingUp className="w-5 h-5 text-[#6F4E37]" />
          <h3 className="font-bold text-base text-[#2C1810]">تحلیل هوشمند رفتار و سلیقه خرید شما در کافه لمیز</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCE] space-y-1">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold mb-1">
              <Heart className="w-4 h-4" />
              <span>نوشیدنی محبوب شما</span>
            </div>
            <div className="font-black text-sm text-[#2C1810]">{customer.favoriteItem}</div>
            <span className="text-[11px] text-[#8C7464] block">انتخاب شده در ۷۰٪ از کل سفارش‌ها</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCE] space-y-1">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>زمان طلایی سفارش</span>
            </div>
            <div className="font-black text-sm text-[#2C1810]">{customer.favoriteOrderHour}</div>
            <span className="text-[11px] text-[#8C7464] block">پیشنهاد آماده‌سازی خودکار قبل از ورود</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCE] space-y-1">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>شاخص کافئین دریافتی</span>
            </div>
            <div className="font-black text-sm text-[#2C1810]">{customer.caffeineScore} از ۱۰۰ (انرژی بهینه)</div>
            <span className="text-[11px] text-[#8C7464] block">علاقه‌مند به اسپرسو دابل و ریسترتو</span>
          </div>
        </div>

        {/* Personalized Barista Recommendation */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4ECE1] to-[#EFE4D6] border border-[#D5C7B7] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8C6008] block">پیشنهاد هوشمند باریستا برای شما:</span>
              <span className="text-sm font-bold text-[#2C1810]">
                «فلت وایت با شیر جو دوسر و کرواسان فرانسوی شکلاتی»
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('menu')}
            className="px-4 py-2 rounded-xl bg-[#2C1810] text-white text-xs font-bold shrink-0 hover:bg-[#432616] transition-colors"
          >
            سفارش در منو
          </button>
        </div>
      </div>

      {/* Rewards Catalog (فروشگاه جوایز) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE2D7] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-bold text-base text-[#2C1810]">فروشگاه پاداش‌ها و جوایز لمیز کلاب</h3>
          </div>
          <span className="text-xs text-[#7A6354]">موجودی شما: {customer.points} امتیاز</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOYALTY_REWARDS.map(reward => {
            const canAfford = customer.points >= reward.pointsCost;

            return (
              <div 
                key={reward.id}
                className="p-4 rounded-2xl border border-[#E5DACD] bg-[#FCFAF7] hover:border-[#C4B29E] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-[#D4AF37]/20 text-[#8B620D] font-black px-2 py-0.5 rounded-md">
                      {reward.badge}
                    </span>
                    <span className="text-xs font-black text-[#6F4E37]">
                      {reward.pointsCost} امتیاز لمیز
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#2C1810] pt-1">{reward.titleFa}</h4>
                  <p className="text-xs text-[#7A6354] leading-relaxed">{reward.descriptionFa}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EFE7DE]">
                  <span className="text-xs font-bold text-emerald-800">
                    ارزش: {reward.discountAmount.toLocaleString('fa-IR')} تومان
                  </span>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-[#2C1810] text-[#E8D8C8] hover:bg-[#432616] shadow-sm'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'تبدیل به کوپن خرید' : 'امتیاز ناکافی'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
