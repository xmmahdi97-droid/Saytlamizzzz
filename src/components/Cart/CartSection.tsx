import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Coffee, 
  Bike, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Tag,
  Gift
} from 'lucide-react';
import { LOYALTY_REWARDS } from '../../data/mockData';

export const CartSection: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartTotal,
    appliedRewardTitle,
    clearAppliedDiscount,
    customer,
    redeemReward,
    setActiveTab,
    setIsPaymentGatewayOpen,
    setPendingOrderDetails
  } = useApp();

  const [orderType, setOrderType] = useState<'takeaway' | 'dinein' | 'delivery'>('takeaway');
  const [tableNumber, setTableNumber] = useState('میز ۴ - فضای باز');
  const [deliveryAddress, setDeliveryAddress] = useState('تهران، تجریش، خیابان ولیعصر، بالاتر از پسیان، پلاک ۲۴');
  const [customerName, setCustomerName] = useState(customer.name);
  const [customerPhone, setCustomerPhone] = useState(customer.phone);
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryFee = orderType === 'delivery' ? 35000 : 0;
  const finalPayable = cartTotal + deliveryFee;

  // Expected loyalty points for this order
  const calculatedPoints = Math.floor((finalPayable / 10000) * (customer.tier === 'gold' ? 1.0 : 0.8));

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      setErrorMsg('سبد خرید شما خالی است!');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('لطفاً نام و شماره همراه خود را جهت دریافت پیامک وضعیت وارد نمایید.');
      return;
    }
    if (orderType === 'dinein' && !tableNumber.trim()) {
      setErrorMsg('لطفاً شماره میز را مشخص فرمایید.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('لطفاً آدرس دقیق تحویل را وارد فرمایید.');
      return;
    }

    setErrorMsg('');

    // Prepare pending payload
    setPendingOrderDetails({
      customerName,
      customerPhone,
      orderType,
      tableNumber: orderType === 'dinein' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      notes: orderNotes || undefined,
      amount: finalPayable,
      itemsCount: cart.reduce((s, i) => s + i.quantity, 0)
    });

    setIsPaymentGatewayOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-[#F5ECE1] flex items-center justify-center text-[#8C7463] border border-[#E5DACD] shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#2C1810]">سبد خرید شما در حال حاضر خالی است</h2>
          <p className="text-sm text-[#7A6354] max-w-md mx-auto">
            انواع قهوه‌های تازه برشته‌شده لمیز، نوشیدنی‌های دست‌ساز و کیک‌های روز را در منو بررسی و انتخاب نمایید.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('menu')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#2C1810] text-[#E8D8C8] hover:bg-[#402313] font-bold text-sm shadow-lg hover:shadow-xl transition-all"
        >
          <Coffee className="w-4 h-4 text-[#D4AF37]" />
          <span>مشاهده منوی کافه لمیز</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-[#EAE2D7] pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810]">سبد خرید و ثبت سفارش آنلاین</h1>
          <p className="text-xs sm:text-sm text-[#7A6354]">
            بررسی اقلام سفارش، انتخاب نوع تحویل و اتصال به درگاه امن بانکی
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف همه اقلام</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items List & Order Delivery Details (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D7] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#2C1810] flex items-center gap-2 border-b border-[#F2ECE3] pb-3">
              <ShoppingBag className="w-5 h-5 text-[#6F4E37]" />
              <span>اقلام انتخاب شده ({cart.reduce((s, i) => s + i.quantity, 0)} عدد)</span>
            </h2>

            <div className="divide-y divide-[#F2ECE3]">
              {cart.map(item => (
                <div key={item.cartItemId} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.nameFa}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#EAE2D7]"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-[#2C1810] truncate">
                        {item.product.nameFa}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#A38D7D] hover:text-rose-600 p-1"
                        title="حذف این آیتم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customizations tags */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-[#7A6354]">
                      {item.selectedSize && (
                        <span className="bg-[#F5ECE1] px-2 py-0.5 rounded-lg border border-[#E6D9CA]">
                          {item.selectedSize}
                        </span>
                      )}
                      {item.selectedMilk && (
                        <span className="bg-[#F5ECE1] px-2 py-0.5 rounded-lg border border-[#E6D9CA]">
                          {item.selectedMilk}
                        </span>
                      )}
                      {item.selectedSweet && (
                        <span className="bg-[#F5ECE1] px-2 py-0.5 rounded-lg border border-[#E6D9CA]">
                          {item.selectedSweet}
                        </span>
                      )}
                      {item.extraShots > 0 && (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg font-bold">
                          +{item.extraShots} شات اضافه
                        </span>
                      )}
                      {item.notes && (
                        <span className="italic text-[#8C7464] block w-full mt-0.5">
                          یادداشت: {item.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="font-black text-sm text-[#2C1810]">
                        {item.totalPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#E0D4C5]">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white text-[#2C1810] flex items-center justify-center font-bold shadow-2xs hover:bg-[#F2ECE3]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs text-[#2C1810] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-2xs hover:bg-[#523A29]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Ordering Type Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D7] shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#2C1810] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#6F4E37]" />
              <span>نحوه دریافت و تحویل سفارش</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-4 rounded-2xl text-right transition-all border ${
                  orderType === 'takeaway'
                    ? 'border-[#2C1810] bg-[#F7F2EC] ring-1 ring-[#2C1810]'
                    : 'border-[#E5DACD] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#2C1810] text-[#D4AF37] flex items-center justify-center mb-2">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-[#2C1810]">بیرون‌بر (Takeaway)</div>
                <div className="text-xs text-[#7A6354] mt-1">تحویل از پیشخوان شعبه تجریش</div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dinein')}
                className={`p-4 rounded-2xl text-right transition-all border ${
                  orderType === 'dinein'
                    ? 'border-[#2C1810] bg-[#F7F2EC] ring-1 ring-[#2C1810]'
                    : 'border-[#E5DACD] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-[#2C1810]">سرو در سالن کافه</div>
                <div className="text-xs text-[#7A6354] mt-1">سرو روی میز شما توسط باریستا</div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-2xl text-right transition-all border ${
                  orderType === 'delivery'
                    ? 'border-[#2C1810] bg-[#F7F2EC] ring-1 ring-[#2C1810]'
                    : 'border-[#E5DACD] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center mb-2">
                  <Bike className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-[#2C1810]">ارسال سریع با پیک</div>
                <div className="text-xs text-[#7A6354] mt-1">+۳۵,۰۰۰ تومان پیک اختصاصی</div>
              </button>
            </div>

            {/* Context Fields based on selection */}
            {orderType === 'dinein' && (
              <div className="space-y-1.5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCE]">
                <label className="text-xs font-bold text-[#4A3B32]">شماره یا موقعیت میز در شعبه:</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="مثال: میز شماره ۶ سالن همکف یا میز تراس"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5C7B8] text-xs text-[#2C1810] focus:outline-hidden focus:border-[#6F4E37]"
                />
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="space-y-1.5 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCE]">
                <label className="text-xs font-bold text-[#4A3B32]">آدرس دقیق ارسال با پیک:</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  placeholder="تهران، خیابان، کوچه، پلاک، زنگ یا واحد..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D5C7B8] text-xs text-[#2C1810] focus:outline-hidden focus:border-[#6F4E37]"
                />
              </div>
            )}

            {/* Customer Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F2ECE3]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3B32]">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="نام شما"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] focus:outline-hidden focus:border-[#6F4E37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3B32]">شماره همراه (جهت دریافت پیامک ردیابی):</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="۰۹۱۲..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] focus:outline-hidden focus:border-[#6F4E37] text-left dir-ltr"
                />
              </div>
            </div>

            {/* General Order Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#4A3B32]">توضیحات کلی سفارش (اختیاری):</label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="مثلاً: قند رژیمی همراه داشته باشد، لیوان دوجداره اضافه..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] focus:outline-hidden focus:border-[#6F4E37]"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary, Club Rewards, Checkout (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Lamiz Club Loyalty Redemption Box */}
          <div className="bg-gradient-to-br from-[#FAF5EE] to-[#F2E8DC] p-5 rounded-3xl border border-[#D8C7B3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-bold text-sm text-[#2C1810]">تخفیف‌های لمیز کلاب</span>
              </div>
              <span className="text-xs bg-[#D4AF37]/20 text-[#8B620D] px-2.5 py-0.5 rounded-full font-black">
                {customer.points} امتیاز در دسترس
              </span>
            </div>

            {appliedRewardTitle ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
                <div>
                  <span className="font-bold block">پاداش فعال: {appliedRewardTitle}</span>
                  <span>{cartDiscount.toLocaleString('fa-IR')} تومان از فاکتور کسر شد.</span>
                </div>
                <button
                  onClick={clearAppliedDiscount}
                  className="text-xs underline text-emerald-800 font-bold hover:text-rose-700"
                >
                  حذف
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#7A6354]">
                  با امتیازات موجود خود می‌توانید پاداش زیر را فورا فعال و از هزینه فاکتور کسر نمایید:
                </p>
                {LOYALTY_REWARDS.slice(0, 2).map(r => (
                  <button
                    key={r.id}
                    onClick={() => redeemReward(r)}
                    disabled={customer.points < r.pointsCost}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#DAC8B4] hover:border-[#6F4E37] text-right text-xs flex items-center justify-between disabled:opacity-50 transition-all"
                  >
                    <div>
                      <span className="font-bold text-[#2C1810] block">{r.titleFa}</span>
                      <span className="text-[11px] text-[#8C7464]">{r.pointsCost} امتیاز لمیز</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                      {r.discountAmount.toLocaleString('fa-IR')} تومان تخفیف
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Receipt Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-lg space-y-5">
            <h3 className="font-bold text-base text-[#2C1810] border-b border-[#F2ECE3] pb-3">
              خلاصه صورت‌حساب سفارش
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#5E4C41]">
                <span>جمع کل اقلام منو:</span>
                <span className="font-semibold">{cartSubtotal.toLocaleString('fa-IR')} تومان</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>تخفیف وفاداری لمیز:</span>
                  <span>- {cartDiscount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#5E4C41]">
                <span>مالیات بر ارزش افزوده و عوارض (۹٪):</span>
                <span className="font-semibold">{cartTax.toLocaleString('fa-IR')} تومان</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex items-center justify-between text-[#5E4C41]">
                  <span>هزینه پیک اکسپرس لمیز:</span>
                  <span className="font-semibold">{deliveryFee.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#ECE2D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C7464] block">مبلغ نهایی قابل پرداخت</span>
                  <span className="text-xl sm:text-2xl font-black text-[#2C1810]">
                    {finalPayable.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-[#6E5B4F]">تومان</span>
                  </span>
                </div>

                <div className="text-left bg-[#FBF7F0] p-2 rounded-xl border border-[#EADFCF]">
                  <span className="text-[10px] text-[#8C7464] block">امتیاز باشگاه</span>
                  <span className="text-xs font-black text-[#966C12] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    +{calculatedPoints} امتیاز
                  </span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Payment CTA */}
            <button
              onClick={handleProceedToPayment}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#3D2314] via-[#2A160C] to-[#1A0D07] text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-[#D4AF37]/30 group"
            >
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>پرداخت امن با کلیه کارت‌های شتاب</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#8C7667] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                درگاه رسمی شاپرک
              </span>
              <span>•</span>
              <span>پیامک لحظه‌ای وضعیت</span>
              <span>•</span>
              <span>فاکتور رسمی</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
