import { Order, InventoryItem } from '../types';

export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

export const createCafeSpreadsheet = async (
  accessToken: string,
  title = `گزارش جامع کافه لمیز - ${new Date().toLocaleDateString('fa-IR')}`
): Promise<SheetCreationResult> => {
  const requestBody = {
    properties: {
      title,
      locale: 'fa_IR'
    },
    sheets: [
      {
        properties: {
          title: 'سفارشات_فروش',
          gridProperties: { rowCount: 100, columnCount: 10 },
          rightToLeft: true
        }
      },
      {
        properties: {
          title: 'موجودی_انبار',
          gridProperties: { rowCount: 50, columnCount: 9 },
          rightToLeft: true
        }
      }
    ]
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || 'خطا در ایجاد گوگل شیت');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Initialize Headers
  await setupSheetHeaders(accessToken, spreadsheetId);

  return { spreadsheetId, spreadsheetUrl };
};

const setupSheetHeaders = async (accessToken: string, spreadsheetId: string) => {
  const orderHeaders = [
    ['شناسه سفارش', 'نام مشتری', 'شماره تماس', 'نوع سفارش', 'اقلام سفارش', 'مبلغ کل (تومان)', 'امتیاز وفاداری', 'کد رهگیری پرداخت', 'وضعیت', 'زمان ثبت']
  ];

  const inventoryHeaders = [
    ['کد انبار', 'نام کالا / ماده اولیه', 'دسته‌بندی', 'موجودی فعلی', 'واحد سنجش', 'حد هشدار کسری', 'هزینه واحد (تومان)', 'وضعیت انبار', 'تاریخ آخرین شارژ']
  ];

  // Write Orders Header
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/سفارشات_فروش!A1:J1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: orderHeaders })
  });

  // Write Inventory Header
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/موجودی_انبار!A1:I1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: inventoryHeaders })
  });
};

export const syncOrdersToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  orders: Order[]
) => {
  const rows = orders.map(o => [
    o.orderNumber,
    o.customerName,
    o.customerPhone,
    o.orderType === 'takeaway' ? 'بیرون‌بر' : o.orderType === 'dinein' ? `سالن (میز ${o.tableNumber || '-'})` : 'ارسال با پیک',
    o.items.map(i => `${i.product.nameFa} (${i.quantity} عدد)`).join(' + '),
    o.total,
    o.pointsEarned,
    o.paymentRef,
    o.status === 'delivered' ? 'تحویل شده' : o.status === 'ready' ? 'آماده تحویل' : o.status === 'preparing' ? 'در حال تهیه' : 'پرداخت شده',
    new Date(o.createdAt).toLocaleString('fa-IR')
  ]);

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/سفارشات_فروش!A2:J?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: rows })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || 'خطا در ثبت سفارشات در گوگل شیت');
  }

  return await response.json();
};

export const syncInventoryToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  inventory: InventoryItem[]
) => {
  const rows = inventory.map(item => [
    item.id,
    item.nameFa,
    item.category === 'coffee_beans' ? 'دانه قهوه' :
    item.category === 'dairy_alternatives' ? 'لبنیات و شیر گیاهی' :
    item.category === 'syrups' ? 'سیروپ و طعم‌دهنده' :
    item.category === 'bakery' ? 'کیک و قنادی' : 'بسته‌بندی',
    item.currentStock,
    item.unit,
    item.minStockAlert,
    item.costPerUnit,
    item.currentStock <= item.minStockAlert ? '⚠️ کسری موجودی' : '✅ مناسب',
    item.lastRestocked
  ]);

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/موجودی_انبار!A2:I?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: rows })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || 'خطا در ثبت انبارداری در گوگل شیت');
  }

  return await response.json();
};
