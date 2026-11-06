import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Smartphone, 
  CheckCheck, 
  Coffee, 
  Trash2,
  Clock
} from 'lucide-react';

export const SMSModal: React.FC = () => {
  const { 
    isSMSModalOpen, 
    setIsSMSModalOpen, 
    smsInbox, 
    markSmsRead, 
    unreadSmsCount 
  } = useApp();

  if (!isSMSModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D5C7B8] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Smartphone Header Simulation */}
        <div className="bg-[#2C1810] text-white p-5 flex items-center justify-between border-b border-[#3E2314]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#D4AF37] border border-white/15">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">صندوق پیامک‌های مشتری</span>
                {unreadSmsCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadSmsCount} جدید
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#D8C7B5]">فرستنده رسمی: 1000LAMIZ</span>
            </div>
          </div>

          <button
            onClick={() => setIsSMSModalOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMS List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#F9F6F1]">
          {smsInbox.length === 0 ? (
            <div className="text-center py-12 text-[#8C7667] space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-xs">هنوز پیامکی دریافت نشده است.</p>
            </div>
          ) : (
            smsInbox.map(sms => (
              <div
                key={sms.id}
                onClick={() => markSmsRead(sms.id)}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-2 cursor-pointer ${
                  !sms.read
                    ? 'bg-white border-[#6F4E37] ring-1 ring-[#6F4E37] shadow-sm'
                    : 'bg-white/80 border-[#E8DDCE]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#2C1810]">
                    <Coffee className="w-3.5 h-3.5 text-[#6F4E37]" />
                    <span>{sms.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#8C7464]">
                    <Clock className="w-3 h-3" />
                    <span>{sms.timestamp}</span>
                  </div>
                </div>

                <p className="text-[#4A3B32] leading-relaxed">
                  {sms.text}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE3] text-[10px] text-[#8C7464]">
                  <span>گیرنده: {sms.phone}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCheck className="w-3.5 h-3.5" />
                    تحویل شده
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#EAE2D7] text-center text-[11px] text-[#7A6354]">
          شبیه‌ساز سامانه پیامکی اختصاصی کافه لمیز جهت اطلاع‌رسانی سفارش و باشگاه مشتریان
        </div>
      </div>
    </div>
  );
};
