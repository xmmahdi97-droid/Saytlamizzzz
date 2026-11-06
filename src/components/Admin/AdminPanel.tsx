import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  BarChart3, 
  Package, 
  ShoppingBag, 
  FileSpreadsheet, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Download, 
  Search,
  Users,
  Send,
  Coffee,
  Check,
  ChevronDown
} from 'lucide-react';
import { 
  createCafeSpreadsheet, 
  syncOrdersToGoogleSheet, 
  syncInventoryToGoogleSheet 
} from '../../services/googleSheetsService';
import { getAccessToken, googleSignIn } from '../../services/authService';

export const AdminPanel: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    inventory, 
    restockItem, 
    updateInventoryItem, 
    financialStats, 
    customer,
    sendManualSMS 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'orders' | 'inventory' | 'finance' | 'sheets' | 'crm'>('orders');
  
  // Inventory Restock Form state
  const [selectedRestockItem, setSelectedRestockItem] = useState(inventory[0]?.id || '');
  const [restockAmount, setRestockAmount] = useState<number>(5);
  const [restockSuccess, setRestockSuccess] = useState(false);

  // Manual SMS Form State
  const [smsPhone, setSmsPhone] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [smsText, setSmsText] = useState('مشتری گرامی کافه لمیز، سفارش شما آماده تحویل است.');
  const [smsSuccess, setSmsSuccess] = useState(false);

  // Google Sheets state
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem('lamiz_sheets_id') || '';
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>(() => {
    return localStorage.getItem('lamiz_sheets_url') || '';
  });
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsSyncSuccess, setSheetsSyncSuccess] = useState<string | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);

  // Low stock items count
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStockAlert);

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestockItem || restockAmount <= 0) return;
    restockItem(selectedRestockItem, Number(restockAmount));
    setRestockSuccess(true);
    setTimeout(() => setRestockSuccess(false), 2000);
  };

  const handleSendManualSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone || !smsText) return;
    sendManualSMS(smsPhone, 'کافه لمیز - پیام مدیریت', smsText);
    setSmsSuccess(true);
    setTimeout(() => setSmsSuccess(false), 2500);
  };

  // Google Sheets Sync Flow
  const handleSyncToGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSheetsError(null);
    setSheetsSyncSuccess(null);

    try {
      let token = await getAccessToken();
      if (!token) {
        // Prompt Google Sign-In if not authenticated yet
        const authRes = await googleSignIn();
        if (!authRes?.accessToken) {
          throw new Error('برای اتصال به گوگل شیت، لطفاً با حساب کاربری گوگل خود وارد شوید.');
        }
        token = authRes.accessToken;
      }

      let activeSheetId = spreadsheetId;

      // If no spreadsheet exists yet, create one
      if (!activeSheetId) {
        const result = await createCafeSpreadsheet(
          token,
          `گزارش جامع سفارشات و انبار کافه لمیز - ${new Date().toLocaleDateString('fa-IR')}`
        );
        activeSheetId = result.spreadsheetId;
        setSpreadsheetId(result.spreadsheetId);
        setSpreadsheetUrl(result.spreadsheetUrl);
        localStorage.setItem('lamiz_sheets_id', result.spreadsheetId);
        localStorage.setItem('lamiz_sheets_url', result.spreadsheetUrl);
      }

      // Sync Orders and Inventory to Google Sheets
      await syncOrdersToGoogleSheet(token, activeSheetId, orders);
      await syncInventoryToGoogleSheet(token, activeSheetId, inventory);

      setSheetsSyncSuccess('اطلاعات فروش و انبارداری با موفقیت در گوگل شیت همگام‌سازی شد.');
    } catch (err: any) {
      console.error('Google Sheets Sync Error:', err);
      setSheetsError(err.message || 'خطا در اتصال به سرویس Google Sheets');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Local CSV Export fallback
  const handleExportCsv = () => {
    const headers = ['OrderNumber', 'Customer', 'Phone', 'Type', 'Total', 'PaymentRef', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerPhone,
      o.orderType,
      o.total,
      o.paymentRef,
      o.status,
      `"${new Date(o.createdAt).toLocaleString('fa-IR')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lamiz-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-[#2C1810] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
              LAMIZ BARISTA & MANAGEMENT CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">پنل جامع مدیریت، فروش و انبارداری کافه لمیز</h1>
          <p className="text-xs sm:text-sm text-[#D4C3B3] max-w-xl">
            کنترل لحظه‌ای صف سفارشات، کسر خودکار موجودی انبار، گزارشات پیشرفته سود و زیان و اتصال به گوگل شیت
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncToGoogleSheets}
            disabled={isSyncingSheets}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{isSyncingSheets ? 'در حال ثبت در شیت...' : 'همگام‌سازی Google Sheets'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>خروجی CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D7] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6354] block">درآمد امروز (ناخالص)</span>
            <span className="text-xl font-black text-[#2C1810]">
              {financialStats.todayRevenue.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              +۱۳٪ نسبت به دیروز
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D7] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6354] block">سود خالص تخمینی امروز</span>
            <span className="text-xl font-black text-emerald-800">
              {financialStats.netProfitToday.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
            </span>
            <span className="text-[11px] text-[#7A6354] block mt-0.5">
              حاشیه سود: {financialStats.profitMarginPercent}٪
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D7] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6354] block">تعداد کل سفارشات امروز</span>
            <span className="text-xl font-black text-[#2C1810]">
              {financialStats.totalOrdersToday} <span className="text-xs font-normal">فاکتور</span>
            </span>
            <span className="text-[11px] text-[#7A6354] block mt-0.5">
              میانگین سبد: {financialStats.averageOrderValue.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EAE2D7] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#7A6354] block">هشدارهای کسری انبار</span>
            <span className={`text-xl font-black ${lowStockItems.length > 0 ? 'text-rose-700' : 'text-[#2C1810]'}`}>
              {lowStockItems.length} <span className="text-xs font-normal">قلم کالا</span>
            </span>
            <span className="text-[11px] text-rose-600 font-bold block mt-0.5">
              {lowStockItems.length > 0 ? 'نیاز به تأمین فوری بار' : 'موجودی انبار متعادل است'}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            lowStockItems.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#EAE2D7] overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            adminTab === 'orders'
              ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20'
              : 'bg-white text-[#5E4C41] border border-[#E5DACD] hover:bg-[#FAF7F2]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          <span>صف سفارشات فعال و پیامک ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('inventory')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            adminTab === 'inventory'
              ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20'
              : 'bg-white text-[#5E4C41] border border-[#E5DACD] hover:bg-[#FAF7F2]'
          }`}
        >
          <Package className="w-4 h-4 text-[#D4AF37]" />
          <span>انبارداری و کنترل مواد اولیه</span>
          {lowStockItems.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setAdminTab('finance')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            adminTab === 'finance'
              ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20'
              : 'bg-white text-[#5E4C41] border border-[#E5DACD] hover:bg-[#FAF7F2]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
          <span>آمار فروش و گزارش مالی پیشرفته</span>
        </button>

        <button
          onClick={() => setAdminTab('sheets')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            adminTab === 'sheets'
              ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20'
              : 'bg-white text-[#5E4C41] border border-[#E5DACD] hover:bg-[#FAF7F2]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Google Sheets و یکپارچه‌سازی</span>
        </button>

        <button
          onClick={() => setAdminTab('crm')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            adminTab === 'crm'
              ? 'bg-[#2C1810] text-white shadow-md shadow-[#2C1810]/20'
              : 'bg-white text-[#5E4C41] border border-[#E5DACD] hover:bg-[#FAF7F2]'
          }`}
        >
          <Users className="w-4 h-4 text-[#D4AF37]" />
          <span>مشتریان و سیستم پیامکی</span>
        </button>
      </div>

      {/* SUBTAB 1: Live Orders Queue & Status updates with SMS auto-dispatch */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2ECE3] pb-4">
            <div>
              <h3 className="font-bold text-base text-[#2C1810]">مدیریت سفارشات فعال (Live Orders Queue)</h3>
              <p className="text-xs text-[#7A6354]">
                با تغییر وضعیت هر سفارش، پیامک اطلاع‌رسانی به صورت خودکار به شماره مشتری ارسال می‌گردد.
              </p>
            </div>
            <span className="text-xs bg-[#F5ECE1] text-[#6F4E37] px-3 py-1 rounded-full font-bold">
              {orders.filter(o => o.status !== 'delivered').length} سفارش در جریان
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#7A6354] border-b border-[#ECE2D5]">
                  <th className="py-3 px-4 font-bold">شماره سفارش</th>
                  <th className="py-3 px-4 font-bold">مشتری و تلفن</th>
                  <th className="py-3 px-4 font-bold">نوع تحویل</th>
                  <th className="py-3 px-4 font-bold">اقلام سفارش</th>
                  <th className="py-3 px-4 font-bold">مبلغ کل</th>
                  <th className="py-3 px-4 font-bold">کد پیگیری شاپرک</th>
                  <th className="py-3 px-4 font-bold">وضعیت فعلی</th>
                  <th className="py-3 px-4 font-bold">عملیات باریستا</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE3]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#2C1810]">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#2C1810]">{order.customerName}</div>
                      <div className="text-[11px] text-[#8C7464] font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-[#F5ECE1] text-[#6F4E37] px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {order.orderType === 'takeaway' ? 'بیرون‌بر' : order.orderType === 'dinein' ? `سالن (میز ${order.tableNumber})` : 'پیک اکسپرس'}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="text-[11px] text-[#4A3B32]">
                            {i.quantity}× {i.product.nameFa}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-[#2C1810]">
                      {order.total.toLocaleString('fa-IR')} ت
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-gray-500">
                      {order.paymentRef}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status === 'delivered' ? 'تحویل شد' :
                         order.status === 'ready' ? 'آماده تحویل' :
                         order.status === 'preparing' ? 'در حال تهیه' : 'پرداخت شده'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {order.status === 'paid' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-[#6F4E37] text-white font-bold text-[11px] hover:bg-[#573A27] transition-colors"
                          >
                            شروع دم‌آوری
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition-colors"
                          >
                            آماده شد
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                          >
                            ثبت تحویل نهایی
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            تکمیل
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Warehouse and Inventory Stock Management */}
      {adminTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Quick Restock Form */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs">
            <h3 className="font-bold text-base text-[#2C1810] flex items-center gap-2 mb-4 border-b border-[#F2ECE3] pb-3">
              <Plus className="w-5 h-5 text-[#6F4E37]" />
              <span>ثبت ورود بار و شارژ موجودی انبار</span>
            </h3>

            <form onSubmit={handleRestock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-[#4A3B32]">انتخاب کالا یا ماده اولیه:</label>
                <select
                  value={selectedRestockItem}
                  onChange={(e) => setSelectedRestockItem(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] font-medium focus:outline-hidden focus:border-[#6F4E37]"
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nameFa} (موجودی فعلی: {item.currentStock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3B32]">مقدار ورودی جدید:</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] font-bold focus:outline-hidden focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2C1810] text-[#E8D8C8] hover:bg-[#432616] font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>ثبت در انبار</span>
                </button>
              </div>
            </form>

            {restockSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>موجودی کالا با موفقیت به‌روزرسانی شد و در انبار ثبت گردید.</span>
              </div>
            )}
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
              <h3 className="font-bold text-base text-[#2C1810]">
                موجودی اقلام، دانه‌های قهوه و مواد اولیه کافه
              </h3>
              <span className="text-xs text-[#7A6354]">
                با ثبت هر سفارش قهوه، دانه‌ها و شیر به صورت اتوماتیک از انبار کسر می‌شوند
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#7A6354] border-b border-[#ECE2D5]">
                    <th className="py-3 px-4 font-bold">کد انبار</th>
                    <th className="py-3 px-4 font-bold">نام ماده / کالا</th>
                    <th className="py-3 px-4 font-bold">موجودی لحظه‌ای</th>
                    <th className="py-3 px-4 font-bold">واحد</th>
                    <th className="py-3 px-4 font-bold">حد هشدار کسری</th>
                    <th className="py-3 px-4 font-bold">هزینه تأمین</th>
                    <th className="py-3 px-4 font-bold">وضعیت انبار</th>
                    <th className="py-3 px-4 font-bold">آخرین شارژ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE3]">
                  {inventory.map(item => {
                    const isLow = item.currentStock <= item.minStockAlert;

                    return (
                      <tr key={item.id} className={`hover:bg-[#FAF8F5] transition-colors ${isLow ? 'bg-rose-50/50' : ''}`}>
                        <td className="py-4 px-4 font-mono font-bold text-gray-500">
                          {item.id}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#2C1810]">
                          {item.nameFa}
                        </td>
                        <td className="py-4 px-4 font-black text-sm">
                          <span className={isLow ? 'text-rose-700' : 'text-[#2C1810]'}>
                            {item.currentStock.toLocaleString('fa-IR')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#7A6354]">
                          {item.unit}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#7A6354]">
                          {item.minStockAlert} {item.unit}
                        </td>
                        <td className="py-4 px-4 text-[#7A6354]">
                          {item.costPerUnit.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="py-4 px-4">
                          {isLow ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              کسری موجودی
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              کافی و پایدار
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-500 text-[11px]">
                          {item.lastRestocked}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: Financial Analytics & Peak Sales Hours */}
      {adminTab === 'finance' && (
        <div className="space-y-6">
          
          {/* Advanced Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE3] pb-2">
                سودآوری و هزینه مواد اولیه (COGS)
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#7A6354]">
                  <span>کل فروش امروز:</span>
                  <span className="font-bold text-[#2C1810]">{financialStats.todayRevenue.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-[#7A6354]">
                  <span>بهای تمام‌شده کالای مصرفی (COGS):</span>
                  <span className="font-bold text-rose-700">{financialStats.costOfGoodsSold.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-[#7A6354]">
                  <span>سود ناخالص عملیاتی:</span>
                  <span className="font-bold text-emerald-700">{financialStats.netProfitToday.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="pt-2 border-t border-[#F2ECE3] flex justify-between font-black text-sm text-[#2C1810]">
                  <span>حاشیه سود خالص:</span>
                  <span className="text-emerald-800">{financialStats.profitMarginPercent}٪</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE3] pb-2">
                سهم دسته‌بندی‌ها از درآمد امروز
              </h4>
              <div className="space-y-2.5 text-xs">
                {financialStats.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#4A3B32]">{cat.categoryName}</span>
                      <span className="font-bold text-[#2C1810]">{cat.percentage}٪</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5ECE1] overflow-hidden">
                      <div 
                        className="h-full bg-[#6F4E37] rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-[#2C1810] border-b border-[#F2ECE3] pb-2">
                پرفروش‌ترین محصولات امروز
              </h4>
              <div className="space-y-3 text-xs">
                {financialStats.topProducts.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#F5ECE1] text-[#6F4E37] font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#2C1810]">{p.name}</span>
                    </div>
                    <span className="text-[#7A6354]">{p.quantity} فنجان</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Peak Hours Sales Chart */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#2C1810]">توزیع فروش و ساعات اوج سفارشات کافه لمیز</h3>
                <p className="text-xs text-[#7A6354]">تحلیل ترافیک سفارش برای برنامه‌ریزی شیفت کاری باریستاها</p>
              </div>
              <span className="text-xs text-[#7A6354]">بازه: امروز</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
              {financialStats.peakHours.map((hour, idx) => {
                const maxSales = Math.max(...financialStats.peakHours.map(h => h.sales));
                const heightPercent = Math.round((hour.sales / maxSales) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center justify-end p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D5] space-y-2">
                    <div className="w-full flex items-end justify-center h-28">
                      <div 
                        className="w-12 bg-gradient-to-t from-[#3D2314] to-[#6F4E37] rounded-xl transition-all duration-500 shadow-xs"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-center space-y-0.5">
                      <span className="font-bold text-xs text-[#2C1810] block">{hour.hour}</span>
                      <span className="text-[11px] font-black text-[#6F4E37] block">
                        {(hour.sales / 1000).toLocaleString('fa-IR')} ک
                      </span>
                      <span className="text-[10px] text-gray-500 block">
                        {hour.ordersCount} سفارش
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: Google Sheets Real-time Synchronization */}
      {adminTab === 'sheets' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE2D7] shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2ECE3] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#2C1810]">یکپارچه‌سازی با Google Sheets</h3>
                <p className="text-xs text-[#7A6354]">
                  صادرات و همگام‌سازی سفارشات فروش و موجودی انبار در یک اسپردشیت رسمی گوگل
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncToGoogleSheets}
              disabled={isSyncingSheets}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? 'animate-spin' : ''}`} />
              <span>{isSyncingSheets ? 'در حال ارتباط با گوگل...' : 'همگام‌سازی لحظه‌ای داده‌ها'}</span>
            </button>
          </div>

          {/* Sync Success or Error notifications */}
          {sheetsSyncSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">{sheetsSyncSuccess}</span>
              </div>
              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700"
                >
                  <span>باز کردن گوگل شیت</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {sheetsError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{sheetsError}</span>
            </div>
          )}

          {/* Connected Spreadsheet Box */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCE] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#8C7464] block">اسپردشیت فعال کافه لمیز:</span>
                <span className="font-mono text-xs text-[#2C1810] font-bold">
                  {spreadsheetId || 'هنوز ایجاد نشده (با اولین همگام‌سازی ایجاد خواهد شد)'}
                </span>
              </div>

              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>مشاهده فایل آنلاین در Google Drive</span>
                </a>
              )}
            </div>

            <div className="text-xs text-[#7A6354] leading-relaxed pt-2 border-t border-[#E8DDCE]">
              این قابلیت دو برگه در فایل اکسل آنلاین شما می‌سازد:
              <br />
              ۱. <strong className="text-[#2C1810]">سفارشات_فروش:</strong> ثبت شماره فاکتور، مشتری، تلفن، مبالغ، کد شاپرک و زمان دقیق.
              <br />
              ۲. <strong className="text-[#2C1810]">موجودی_انبار:</strong> ثبت دانه‌های قهوه، لبنیات، بسته‌بندی، وضعیت کسری و آخرین تاریخ شارژ.
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CRM and SMS Notification System */}
      {adminTab === 'crm' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Manual SMS Broadcast Tool */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F2ECE3] pb-3">
              <Send className="w-5 h-5 text-[#6F4E37]" />
              <h3 className="font-bold text-base text-[#2C1810]">سامانه ارسال پیامک به مشتری</h3>
            </div>

            <form onSubmit={handleSendManualSms} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#4A3B32]">شماره تلفن مشتری:</label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs font-mono font-bold text-[#2C1810] text-left dir-ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#4A3B32]">متن پیامک ارسالی (سرشماره ۱۰۰۰LAMIZ):</label>
                <textarea
                  rows={4}
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D5C7B8] text-xs text-[#2C1810] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#2C1810] text-[#E8D8C8] hover:bg-[#402313] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>ارسال پیامک به گوشی مشتری</span>
              </button>
            </form>

            {smsSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>پیامک به گوشی مشتری ارسال شد (در صندوق پیامک‌های بالای سایت قابل مشاهده است).</span>
              </div>
            )}
          </div>

          {/* Customer CRM Profile Overview */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#EAE2D7] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2C1810] border-b border-[#F2ECE3] pb-3">
              پروفایل و آمار خرید مشتری فعال ({customer.name})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D5]">
                <span className="text-[#8C7464] block">کل مبالغ خرید:</span>
                <span className="font-black text-sm text-[#2C1810]">{customer.totalSpent.toLocaleString('fa-IR')} ت</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D5]">
                <span className="text-[#8C7464] block">تعداد سفارش:</span>
                <span className="font-black text-sm text-[#2C1810]">{customer.ordersCount} بار</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D5]">
                <span className="text-[#8C7464] block">امتیاز باشگاه:</span>
                <span className="font-black text-sm text-[#8C6008]">{customer.points} امتیاز</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE2D5]">
                <span className="text-[#8C7464] block">سطح عضویت:</span>
                <span className="font-black text-sm text-amber-700">{customer.tier.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#5E4C41] pt-2">
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8DDCE]">
                نوشیدنی اختصاصی محبوب: <strong className="text-[#2C1810]">{customer.favoriteItem}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E8DDCE]">
                ساعت متداول حضور در کافه: <strong className="text-[#2C1810]">{customer.favoriteOrderHour}</strong>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
