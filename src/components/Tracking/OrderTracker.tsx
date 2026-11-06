import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Coffee, 
  Bike, 
  PackageCheck, 
  Receipt, 
  MessageSquare, 
  QrCode,
  MapPin,
  ChevronRight,
  Sparkles,
  Printer
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrderTracker: React.FC = () => {
  const { 
    orders, 
    activeOrder, 
    setActiveOrderId, 
    updateOrderStatus, 
    setIsSMSModalOpen 
  } = useApp();

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!activeOrder && orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 bg-white rounded-3xl border border-[#EAE2D7] p-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5ECE1] flex items-center justify-center text-[#8C7463]">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C1810]">هیچ سفارشی در حال حاضر ثبت نشده است</h2>
        <p className="text-xs text-[#7A6354]">
          پس از ثبت سفارش در منو، وضعیت سفارش، باریستا و زمان تحویل را در این بخش پیگیری کنید.
        </p>
      </div>
    );
  }

  const currentOrder = activeOrder || orders[0];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'paid': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const stepIndex = getStepIndex(currentOrder.status);

  const steps = [
    {
      num: 1,
      title: 'پرداخت و ثبت سفارش',
      desc: 'فاکتور صادر و به شعبه تجریش ارسال شد',
      icon: CheckCircle2,
      time: 'لحظه‌ای'
    },
    {
      num: 2,
      title: 'دم‌آوری و آماده‌سازی',
      desc: 'باریستای لمیز در حال تهیه نوشیدنی‌هاست',
      icon: Coffee,
      time: '۸-۱۲ دقیقه'
    },
    {
      num: 3,
      title: currentOrder.orderType === 'delivery' ? 'تحویل به پیک لمیز' : 'آماده در پیشخوان شعبه',
      desc: currentOrder.orderType === 'delivery' ? 'سفارش در مسیر تحویل به آدرس شما' : 'لطفاً به پیشخوان مراجعه فرمایید',
      icon: currentOrder.orderType === 'delivery' ? Bike : PackageCheck,
      time: '۳ دقیقه'
    },
    {
      num: 4,
      title: 'تحویل نهایی به مشتری',
      desc: 'نوش جان! امتیاز وفاداری لمیز کلاب ثبت شد',
      icon: Sparkles,
      time: 'تکمیل شد'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Header & Order Selector if multiple orders */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#8C7464]">رهگیری سفارش شماره:</span>
            <span className="font-mono font-black text-lg text-[#2C1810] px-2.5 py-0.5 rounded-lg bg-[#F5ECE1] border border-[#E0D3C1]">
              {currentOrder.orderNumber}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              currentOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
              currentOrder.status === 'ready' ? 'bg-blue-100 text-blue-800 animate-pulse' :
              currentOrder.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentOrder.status === 'delivered' ? 'تحویل شده' :
               currentOrder.status === 'ready' ? 'آماده تحویل' :
               currentOrder.status === 'preparing' ? 'در حال آماده‌سازی' : 'ثبت شده'}
            </span>
          </div>
          <p className="text-xs text-[#7A6354]">
            زمان ثبت: {new Date(currentOrder.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} • شعبه تجریش
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSMSModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5ECE1] hover:bg-[#EAE0D3] text-[#2C1810] font-bold text-xs transition-colors border border-[#E0D3C1]"
          >
            <MessageSquare className="w-4 h-4 text-[#6F4E37]" />
            <span>پیامک‌های دریافتی</span>
          </button>

          <button
            onClick={() => setShowReceiptModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2C1810] text-[#E8D8C8] hover:bg-[#402313] font-bold text-xs transition-colors shadow-sm"
          >
            <Receipt className="w-4 h-4 text-[#D4AF37]" />
            <span>مشاهده فاکتور</span>
          </button>
        </div>
      </div>

      {/* Select active order if customer has multiple orders */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-xs font-bold text-[#7A6354] shrink-0">سفارش‌های قبلی شما:</span>
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => setActiveOrderId(o.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border shrink-0 transition-all ${
                o.id === currentOrder.id
                  ? 'bg-[#2C1810] text-white border-[#2C1810]'
                  : 'bg-white text-[#5E4C41] border-[#E5DACD] hover:bg-[#FAF7F2]'
              }`}
            >
              {o.orderNumber} ({o.status === 'delivered' ? 'تکمیل' : 'فعال'})
            </button>
          ))}
        </div>
      )}

      {/* Live Order Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-lg space-y-8">
        <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/15 text-[#6F4E37] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2C1810]">وضعیت زنده سفارش در آشپزخانه لمیز</h3>
              <p className="text-xs text-[#7A6354]">مراحل به صورت لحظه‌ای با پیامک به تلفن شما مخابره می‌شود</p>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[11px] text-[#8C7464] block">زمان تخمینی آماده‌سازی</span>
            <span className="text-lg font-black text-[#6F4E37]">
              {currentOrder.status === 'delivered' ? 'تحویل شده' : '۱۰ تا ۱۵ دقیقه'}
            </span>
          </div>
        </div>

        {/* Timeline Steps Display */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((st, idx) => {
            const isCompleted = stepIndex >= st.num;
            const isCurrent = stepIndex === st.num;
            const IconComponent = st.icon;

            return (
              <div 
                key={st.num}
                className={`p-4 rounded-2xl border transition-all relative ${
                  isCurrent
                    ? 'bg-[#FAF4ED] border-[#6F4E37] ring-1 ring-[#6F4E37] shadow-sm'
                    : isCompleted
                    ? 'bg-[#F8F9FA] border-emerald-300'
                    : 'bg-[#FCFCFC] border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-[#6F4E37] text-white shadow-md'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-bold ${
                    isCurrent ? 'text-[#6F4E37]' : isCompleted ? 'text-emerald-700' : 'text-gray-400'
                  }`}>
                    مرحله {st.num}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#2C1810] mb-1">{st.title}</h4>
                <p className="text-[11px] text-[#7A6354] leading-relaxed mb-2">{st.desc}</p>

                <div className="text-[10px] text-[#9E897A] font-medium pt-2 border-t border-[#EFE7DE]">
                  {st.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Testing Simulator Bar (Useful for testing states and SMS generation) */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DDCE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4A3B32]">
            <span className="font-bold text-xs">تغییر وضعیت توسط باریستا (تست زنده پیامک و رهگیری):</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'paid')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentOrder.status === 'paid' ? 'bg-[#2C1810] text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              ۱. ثبت سفارش
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'preparing')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentOrder.status === 'preparing' ? 'bg-[#6F4E37] text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              ۲. دم‌آوری باریستا
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'ready')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentOrder.status === 'ready' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              ۳. آماده تحویل
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.id, 'delivered')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentOrder.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              ۴. تحویل شد
            </button>
          </div>
        </div>
      </div>

      {/* Order Items & Customer Receipt Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#2C1810] flex items-center justify-between border-b border-[#F2ECE3] pb-3">
          <span>اقلام سفارش</span>
          <span className="text-xs font-normal text-[#7A6354]">
            نوع: {currentOrder.orderType === 'takeaway' ? 'بیرون‌بر' : currentOrder.orderType === 'dinein' ? `سالن (میز ${currentOrder.tableNumber})` : 'ارسال با پیک'}
          </span>
        </h3>

        <div className="space-y-3">
          {currentOrder.items.map(item => (
            <div key={item.cartItemId} className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-dashed border-[#F2ECE3]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#F5ECE1] text-[#2C1810] font-bold flex items-center justify-center text-xs">
                  {item.quantity}×
                </span>
                <div>
                  <span className="font-bold text-[#2C1810] block">{item.product.nameFa}</span>
                  <span className="text-[11px] text-[#8C7464]">
                    {[item.selectedSize, item.selectedMilk, item.selectedSweet].filter(Boolean).join(' • ')}
                  </span>
                </div>
              </div>
              <span className="font-black text-[#2C1810]">
                {item.totalPrice.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <div className="text-[#6F5B4E]">
              تحویل‌گیرنده: <span className="font-bold text-[#2C1810]">{currentOrder.customerName}</span> ({currentOrder.customerPhone})
            </div>
            {currentOrder.deliveryAddress && (
              <div className="text-[#6F5B4E] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{currentOrder.deliveryAddress}</span>
              </div>
            )}
          </div>

          <div className="text-left">
            <span className="text-xs text-[#8C7464] block">مجموع پرداخت‌شده با شاپرک</span>
            <span className="text-lg font-black text-[#2C1810]">
              {currentOrder.total.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
            </span>
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-[#E0D3C1] shadow-2xl">
            <div className="text-center border-b border-dashed border-[#DAC8B4] pb-4 space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#2C1810] text-[#D4AF37] flex items-center justify-center mb-2">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl text-[#2C1810]">فاکتور رسمی کافه لمیز</h3>
              <p className="text-xs text-[#7A6354]">شعبه تجریش - صندوق شماره ۱</p>
              <p className="text-[11px] font-mono text-[#8C7464]">شماره فاکتور: {currentOrder.orderNumber}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6F5B4E]">
                <span>تاریخ و ساعت:</span>
                <span>{new Date(currentOrder.createdAt).toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex justify-between text-[#6F5B4E]">
                <span>کد رهگیری بانکی شاپرک:</span>
                <span className="font-mono font-bold text-[#2C1810]">{currentOrder.paymentRef}</span>
              </div>
              <div className="flex justify-between text-[#6F5B4E]">
                <span>نام مشتری:</span>
                <span>{currentOrder.customerName}</span>
              </div>
            </div>

            <div className="border-t border-b border-[#ECE2D5] py-3 space-y-2 text-xs">
              {currentOrder.items.map(item => (
                <div key={item.cartItemId} className="flex justify-between">
                  <span>{item.quantity}× {item.product.nameFa}</span>
                  <span className="font-bold">{item.totalPrice.toLocaleString('fa-IR')} ت</span>
                </div>
              ))}
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>تخفیف لمیز کلاب:</span>
                  <span>- {currentOrder.discount.toLocaleString('fa-IR')} ت</span>
                </div>
              )}
              <div className="flex justify-between text-[#7A6354]">
                <span>مالیات بر ارزش افزوده (۹٪):</span>
                <span>{currentOrder.tax.toLocaleString('fa-IR')} ت</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#2C1810] pt-2 border-t border-dashed border-[#ECE2D5]">
                <span>مبلغ کل پرداختی:</span>
                <span>{currentOrder.total.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            <div className="text-center text-[11px] text-[#8C7464] space-y-1">
              <p>از انتخاب و همراهی شما با کافه لمیز سپاسگزاریم.</p>
              <p className="font-bold text-[#966C12]">+{currentOrder.pointsEarned} امتیاز وفاداری به حساب شما افزوده شد.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#2C1810] text-[#E8D8C8] font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ فاکتور</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
