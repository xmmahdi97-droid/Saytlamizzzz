import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentGatewayOpen, 
    setIsPaymentGatewayOpen, 
    pendingOrderDetails, 
    createOrder, 
    setActiveTab,
    sendManualSMS
  } = useApp();

  const [cardNumber, setCardNumber] = useState('۶۰۳۷-۹۹۷۵-۸۲۴۱-۹۰۳۲');
  const [cvv2, setCvv2] = useState('۷۴۱');
  const [expMonth, setExpMonth] = useState('۰۸');
  const [expYear, setExpYear] = useState('۰۶');
  const [otp, setOtp] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8349');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Randomize captcha
  const generateNewCaptcha = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(num);
  };

  useEffect(() => {
    if (isPaymentGatewayOpen) {
      generateNewCaptcha();
      setCaptchaInput('');
      setOtp('');
      setErrorMessage('');
      setPaymentSuccess(false);
    }
  }, [isPaymentGatewayOpen]);

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isPaymentGatewayOpen || !pendingOrderDetails) return null;

  const handleRequestOtp = () => {
    setIsRequestingOtp(true);
    setTimeout(() => {
      setIsRequestingOtp(false);
      setOtpTimer(120); // 2 minutes countdown
      const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(sampleOtp);

      // Trigger an authentic bank SMS simulation
      sendManualSMS(
        pendingOrderDetails.customerPhone,
        'بانک ملی / شاپرک - رمز پویا',
        `رمز یکبار مصرف خرید اینترنتی شما در کافه لمیز: ${sampleOtp} (معتبر به مدت ۲ دقیقه). خرید به مبلغ: ${pendingOrderDetails.amount.toLocaleString('fa-IR')} ریال`
      );
    }, 600);
  };

  const handlePay = () => {
    if (!cardNumber || cardNumber.replace(/\D/g, '').length < 16) {
      setErrorMessage('شماره کارت ۱۶ رقمی نامعتبر است.');
      return;
    }
    if (!cvv2 || cvv2.length < 3) {
      setErrorMessage('کد CVV2 نامعتبر است.');
      return;
    }
    if (!otp) {
      setErrorMessage('لطفاً ابتدا رمز پویا را دریافت و وارد نمایید.');
      return;
    }
    if (captchaInput !== captchaCode) {
      setErrorMessage('کد امنیتی تصویر صحیح نیست.');
      generateNewCaptcha();
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const refCode = `SHP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setGeneratedRef(refCode);

      // Finalize order in Context
      createOrder({
        customerName: pendingOrderDetails.customerName,
        customerPhone: pendingOrderDetails.customerPhone,
        orderType: pendingOrderDetails.orderType,
        tableNumber: pendingOrderDetails.tableNumber,
        deliveryAddress: pendingOrderDetails.deliveryAddress,
        notes: pendingOrderDetails.notes,
        paymentRef: refCode
      });

      setIsProcessing(false);
      setPaymentSuccess(true);

      // Trigger Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Redirect to tracker after 1.8s
      setTimeout(() => {
        setIsPaymentGatewayOpen(false);
        setActiveTab('tracker');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D5C7B8] my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gateway Header */}
        <div className="bg-[#1C2C42] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2B3F5C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">درگاه پرداخت الکترونیک شاپرک</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  SSL SECURE 256-BIT
                </span>
              </div>
              <span className="text-xs text-[#9BB1CF]">سامانه جامع پرداخت اینترنتی بانک مرکزی جمهوری اسلامی ایران</span>
            </div>
          </div>

          <button
            onClick={() => setIsPaymentGatewayOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Merchant & Order Details Bar */}
        <div className="bg-[#F4F7FB] px-5 py-3 border-b border-[#E2EAF3] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 text-[#243B55]">
            <span className="text-gray-500">پذیرنده:</span>
            <span className="font-bold">کافه لمیز (شعبه مرکزی تجریش)</span>
          </div>

          <div className="flex items-center gap-2 text-[#243B55]">
            <span className="text-gray-500">مبلغ تراکنش:</span>
            <span className="font-black text-sm text-emerald-700">
              {pendingOrderDetails.amount.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>

        {/* Success View */}
        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-emerald-900">تراکنش با موفقیت انجام شد</h3>
            <p className="text-xs text-[#526277] max-w-sm mx-auto">
              سفارش شما در سیستم ثبت و باریستای لمیز مطلع گردید. کد پیگیری شاپرک:
            </p>
            <div className="font-mono font-bold text-base bg-[#F0F5FA] py-2 px-4 rounded-xl text-[#1C2C42] inline-block border border-[#D5E1ED]">
              {generatedRef}
            </div>
            <div className="text-xs text-gray-500 pt-2 animate-pulse">
              در حال انتقال به صفحه پیگیری زنده سفارش...
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            
            {/* Card Number */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1C2C42] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#4A7BB0]" />
                <span>شماره ۱۶ رقمی کارت بانکی شتاب:</span>
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                className="w-full px-4 py-3 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-base text-[#1C2C42] tracking-wider text-center dir-ltr focus:outline-hidden focus:border-[#4A7BB0] focus:ring-1 focus:ring-[#4A7BB0]"
              />
            </div>

            {/* CVV2 and Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#1C2C42]">کد شناسایی (CVV2):</label>
                <input
                  type="password"
                  maxLength={4}
                  value={cvv2}
                  onChange={(e) => setCvv2(e.target.value)}
                  placeholder="۳ یا ۴ رقم"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-sm text-[#1C2C42] text-center dir-ltr focus:outline-hidden focus:border-[#4A7BB0]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1C2C42]">تاریخ انقضا (ماه / سال):</label>
                <div className="flex items-center gap-2 dir-ltr">
                  <input
                    type="text"
                    maxLength={2}
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    placeholder="ماه"
                    className="w-full px-2 py-2.5 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-sm text-[#1C2C42] text-center focus:outline-hidden focus:border-[#4A7BB0]"
                  />
                  <span className="text-gray-400 font-bold">/</span>
                  <input
                    type="text"
                    maxLength={2}
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    placeholder="سال"
                    className="w-full px-2 py-2.5 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-sm text-[#1C2C42] text-center focus:outline-hidden focus:border-[#4A7BB0]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic OTP (رمز پویا) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#1C2C42] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#4A7BB0]" />
                  <span>رمز دوم پویا (یکبار مصرف):</span>
                </label>
                {otpTimer > 0 ? (
                  <span className="text-xs text-amber-700 font-bold">
                    زمان معتبر: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </span>
                ) : null}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="رمز ۶ رقمی پیامک‌شده"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-sm text-[#1C2C42] text-center dir-ltr focus:outline-hidden focus:border-[#4A7BB0]"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isRequestingOtp || otpTimer > 0}
                  className="px-3 py-2.5 rounded-xl bg-[#E8F1FC] hover:bg-[#D7E7FA] text-[#1B4B82] font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isRequestingOtp ? 'ارسال...' : otpTimer > 0 ? 'رمز ارسال شد' : 'دریافت رمز پویا'}</span>
                </button>
              </div>
            </div>

            {/* Security Captcha */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#1C2C42]">کد امنیتی تصویر:</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={4}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="کد ۴ رقمی"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAFCFF] border border-[#CCDCEE] font-mono font-bold text-sm text-[#1C2C42] text-center dir-ltr focus:outline-hidden focus:border-[#4A7BB0]"
                />
                <div className="bg-slate-200 px-4 py-2 rounded-xl font-mono text-lg font-black tracking-widest text-slate-800 select-none line-through border border-slate-300">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateNewCaptcha}
                  className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                  title="تغییر کد امنیتی"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit & Cancel Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#1B8045] hover:bg-[#166938] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال تأیید تراکنش شاپرک...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>پرداخت {pendingOrderDetails.amount.toLocaleString('fa-IR')} تومان</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsPaymentGatewayOpen(false)}
                className="px-5 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
              >
                انصراف
              </button>
            </div>

          </div>
        )}

        {/* Security Footer */}
        <div className="bg-[#F8FAFC] p-3 text-[11px] text-gray-500 border-t border-[#EAEFF5] text-center flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>امنیت این درگاه توسط مرکز شاپرک تأیید شده است. اطلاعات کارت شما به صورت رمزنگاری‌شده ارسال می‌شود.</span>
        </div>

      </div>
    </div>
  );
};
