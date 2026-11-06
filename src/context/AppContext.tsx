import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  InventoryItem, 
  CustomerProfile, 
  LoyaltyReward, 
  SMSMessage,
  FinancialStats
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_INVENTORY, 
  DEFAULT_CUSTOMER, 
  INITIAL_FINANCIAL_STATS 
} from '../data/mockData';

interface AppContextType {
  // Navigation
  activeTab: 'menu' | 'cart' | 'tracker' | 'loyalty' | 'admin';
  setActiveTab: (tab: 'menu' | 'cart' | 'tracker' | 'loyalty' | 'admin') => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  toggleProductAvailability: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity: number, 
    selectedSize?: string, 
    selectedMilk?: string, 
    selectedSweet?: string, 
    extraShots?: number, 
    notes?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;
  appliedDiscount: number;
  appliedRewardTitle: string | null;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrderId: (id: string | null) => void;
  createOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    orderType: 'takeaway' | 'dinein' | 'delivery';
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
    paymentRef: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Inventory
  inventory: InventoryItem[];
  restockItem: (itemId: string, addAmount: number) => void;
  updateInventoryItem: (updated: InventoryItem) => void;

  // Loyalty & Customer
  customer: CustomerProfile;
  redeemReward: (reward: LoyaltyReward) => boolean;
  clearAppliedDiscount: () => void;

  // SMS Notifications
  smsInbox: SMSMessage[];
  unreadSmsCount: number;
  isSMSModalOpen: boolean;
  setIsSMSModalOpen: (open: boolean) => void;
  markSmsRead: (id: string) => void;
  sendManualSMS: (phone: string, title: string, text: string) => void;

  // Financial Stats
  financialStats: FinancialStats;

  // Modals
  isPaymentGatewayOpen: boolean;
  setIsPaymentGatewayOpen: (open: boolean) => void;
  pendingOrderDetails: any;
  setPendingOrderDetails: (details: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'tracker' | 'loyalty' | 'admin'>('menu');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lamiz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lamiz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedRewardTitle, setAppliedRewardTitle] = useState<string | null>(null);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('lamiz_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('lamiz_customer');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER;
  });

  // Seed with 2 past orders for realistic presentation
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lamiz_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord-101',
        orderNumber: 'LMZ-8412',
        customerName: 'مهدی زارعی',
        customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
        items: [
          {
            cartItemId: 'item-1',
            product: INITIAL_PRODUCTS[1], // Cafe Latte
            quantity: 2,
            selectedSize: 'متوسط استاندار (۳۶۰ میلی‌لیتر)',
            selectedMilk: 'شیر کامل پرچرب لمیز',
            extraShots: 0,
            unitPrice: 135000,
            totalPrice: 270000
          },
          {
            cartItemId: 'item-2',
            product: INITIAL_PRODUCTS[10], // San Sebastian
            quantity: 1,
            extraShots: 0,
            unitPrice: 185000,
            totalPrice: 185000
          }
        ],
        orderType: 'takeaway',
        subtotal: 455000,
        discount: 0,
        tax: 40950,
        deliveryFee: 0,
        total: 495950,
        paymentRef: 'SHP-98320471',
        status: 'delivered',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        estimatedMinutes: 0,
        pointsEarned: 35,
        pointsRedeemed: 0
      }
    ];
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('lamiz_active_order') || 'ord-101';
  });

  const [smsInbox, setSmsInbox] = useState<SMSMessage[]>(() => {
    const saved = localStorage.getItem('lamiz_sms');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sms-init-1',
        orderId: 'ord-101',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        title: 'کافه لمیز - ثبت سفارش',
        text: 'مشتری گرامی، سفارش شما با شماره LMZ-8412 در شعبه تجریش کافه لمیز ثبت شد. با تشکر از انتخاب شما.',
        timestamp: '۱۱:۲۰ امروز',
        read: true
      },
      {
        id: 'sms-init-2',
        orderId: 'ord-101',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        title: 'کافه لمیز - تحویل سفارش',
        text: 'سفارش LMZ-8412 آماده تحویل شد. +۳۵ امتیاز به کارت وفاداری لمیز شما افزوده گردید.',
        timestamp: '۱۱:۳۵ امروز',
        read: true
      }
    ];
  });

  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [financialStats, setFinancialStats] = useState<FinancialStats>(INITIAL_FINANCIAL_STATS);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<any>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('lamiz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lamiz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lamiz_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('lamiz_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('lamiz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lamiz_sms', JSON.stringify(smsInbox));
  }, [smsInbox]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('lamiz_active_order', activeOrderId);
    }
  }, [activeOrderId]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartDiscount = Math.min(appliedDiscount, cartSubtotal);
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.09); // 9% Iranian VAT
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax);

  const addToCart = (
    product: Product, 
    quantity: number, 
    selectedSize?: string, 
    selectedMilk?: string, 
    selectedSweet?: string, 
    extraShots = 0, 
    notes?: string
  ) => {
    let unitPrice = product.price;

    if (selectedSize && product.customization?.sizes) {
      const sizeOpt = product.customization.sizes.find(s => s.name === selectedSize);
      if (sizeOpt) unitPrice += sizeOpt.extraPrice;
    }

    if (selectedMilk && product.customization?.milkTypes) {
      const milkOpt = product.customization.milkTypes.find(m => m.name === selectedMilk);
      if (milkOpt) unitPrice += milkOpt.extraPrice;
    }

    if (selectedSweet && product.customization?.sweetLevels) {
      const sweetOpt = product.customization.sweetLevels.find(s => s.name === selectedSweet);
      if (sweetOpt) unitPrice += sweetOpt.extraPrice;
    }

    if (extraShots > 0 && product.customization?.extraShotPrice) {
      unitPrice += extraShots * product.customization.extraShotPrice;
    }

    const cartItemId = `${product.id}-${selectedSize || 'def'}-${selectedMilk || 'def'}-${selectedSweet || 'def'}-${extraShots}-${Date.now()}`;

    const newItem: CartItem = {
      cartItemId,
      product,
      quantity,
      selectedSize,
      selectedMilk,
      selectedSweet,
      extraShots,
      notes,
      unitPrice,
      totalPrice: unitPrice * quantity
    };

    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity: qty,
          totalPrice: item.unitPrice * qty
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setAppliedRewardTitle(null);
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p));
  };

  // Helper to trigger SMS notification
  const sendSMS = (phone: string, title: string, text: string, orderId?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: SMSMessage = {
      id: `sms-${Date.now()}`,
      orderId,
      phone,
      title,
      text,
      timestamp: timeStr,
      read: false
    };

    setSmsInbox(prev => [newMsg, ...prev]);
  };

  const sendManualSMS = (phone: string, title: string, text: string) => {
    sendSMS(phone, title, text);
  };

  const markSmsRead = (id: string) => {
    setSmsInbox(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  // Warehouse deduction based on recipes
  const deductWarehouseStock = (orderItems: CartItem[]) => {
    setInventory(prevInv => {
      const updated = [...prevInv];
      orderItems.forEach(cartItem => {
        const ingredients = cartItem.product.ingredientsRequired || [];
        ingredients.forEach(req => {
          const invIndex = updated.findIndex(item => item.id === req.ingredientId);
          if (invIndex !== -1) {
            const current = updated[invIndex];
            const neededTotal = (req.amountRequired * cartItem.quantity);
            // Deduct carefully depending on units (grams to kg or ml to liter)
            let deduction = neededTotal;
            if (current.unit === 'کیلوگرم' || current.unit === 'لیتر') {
              deduction = neededTotal / 1000;
            }
            const newStock = Math.max(0, Math.round((current.currentStock - deduction) * 100) / 100);
            updated[invIndex] = {
              ...current,
              currentStock: newStock
            };
          }
        });
      });
      return updated;
    });
  };

  // Create Order Workflow
  const createOrder = (orderInfo: {
    customerName: string;
    customerPhone: string;
    orderType: 'takeaway' | 'dinein' | 'delivery';
    tableNumber?: string;
    deliveryAddress?: string;
    notes?: string;
    paymentRef: string;
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LMZ-${randomNum}`;
    const orderId = `ord-${Date.now()}`;

    // Loyalty points calculation: 1 point per 10,000 Tomans spent + tier bonus
    let pointsRate = 0.05; // 5% for bronze
    if (customer.tier === 'silver') pointsRate = 0.08;
    if (customer.tier === 'gold') pointsRate = 0.10;
    if (customer.tier === 'black') pointsRate = 0.15;

    const pointsEarned = Math.floor((cartTotal / 10000) * (pointsRate * 10));

    const deliveryFee = orderInfo.orderType === 'delivery' ? 35000 : 0;
    const finalTotal = cartTotal + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: orderInfo.customerName,
      customerPhone: orderInfo.customerPhone,
      items: [...cart],
      orderType: orderInfo.orderType,
      tableNumber: orderInfo.tableNumber,
      deliveryAddress: orderInfo.deliveryAddress,
      notes: orderInfo.notes,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      deliveryFee,
      total: finalTotal,
      paymentRef: orderInfo.paymentRef,
      status: 'paid',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 15,
      pointsEarned,
      pointsRedeemed: appliedDiscount > 0 ? 50 : 0
    };

    // Update Orders
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(orderId);

    // Deduct stock in warehouse
    deductWarehouseStock(cart);

    // Update Customer Profile & Smart Loyalty
    setCustomer(prev => {
      const newOrdersCount = prev.ordersCount + 1;
      const newSpent = prev.totalSpent + finalTotal;
      const newStamps = (prev.stamps + 1) % 6; // Stamp card 1 to 5
      const newPoints = prev.points + pointsEarned;

      // Smart tier evaluation
      let newTier = prev.tier;
      if (newSpent > 10000000) newTier = 'black';
      else if (newSpent > 4000000) newTier = 'gold';
      else if (newSpent > 1500000) newTier = 'silver';

      return {
        ...prev,
        ordersCount: newOrdersCount,
        totalSpent: newSpent,
        stamps: newStamps,
        points: newPoints,
        tier: newTier
      };
    });

    // Send SMS 1: Order Paid & Created
    sendSMS(
      orderInfo.customerPhone,
      'کافه لمیز - تأیید پرداخت و ثبت سفارش',
      `سفارش شما با کد ${orderNumber} به مبلغ ${finalTotal.toLocaleString('fa-IR')} تومان در کافه لمیز ثبت گردید. زمان تقریبی آماده‌سازی: ۱۵ دقیقه. پیگیری زنده در سایت فعال است.`,
      orderId
    );

    // Update Daily Financial Stats
    setFinancialStats(prev => ({
      ...prev,
      todayRevenue: prev.todayRevenue + finalTotal,
      totalOrdersToday: prev.totalOrdersToday + 1,
      averageOrderValue: Math.round((prev.todayRevenue + finalTotal) / (prev.totalOrdersToday + 1)),
      netProfitToday: Math.round((prev.netProfitToday + (finalTotal * 0.65)))
    }));

    clearCart();
    return newOrder;
  };

  // Update Status by Barista or Admin
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    }));

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (status === 'preparing') {
      sendSMS(
        order.customerPhone,
        'کافه لمیز - باریستا در حال آماده‌سازی',
        `باریستای لمیز در حال دم‌آوری و تهیه سفارش ${order.orderNumber} شماست. فنجان قهوه شما به زودی آماده سرو خواهد بود! ☕`,
        orderId
      );
    } else if (status === 'ready') {
      const readyMsg = order.orderType === 'dinein' 
        ? `سفارش ${order.orderNumber} آماده سرو شد و به میز ${order.tableNumber || ''} آورده می‌شود.`
        : order.orderType === 'delivery'
        ? `سفارش ${order.orderNumber} آماده و تحویل پیک اختصاصی لمیز شد.`
        : `سفارش ${order.orderNumber} حاضر است! لطفا جهت تحویل گرفتن به پیشخوان شعبه مراجعه فرمایید.`;

      sendSMS(
        order.customerPhone,
        'کافه لمیز - سفارش شما آماده است!',
        readyMsg,
        orderId
      );
    } else if (status === 'delivered') {
      sendSMS(
        order.customerPhone,
        'کافه لمیز - تحویل سفارش و امتیاز وفاداری',
        `سفارش ${order.orderNumber} با موفقیت تحویل شد. +${order.pointsEarned} امتیاز به کیف لمیز کلاب شما افزوده شد. نوش جان!`,
        orderId
      );
    }
  };

  // Inventory actions
  const restockItem = (itemId: string, addAmount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          currentStock: Math.round((item.currentStock + addAmount) * 100) / 100,
          lastRestocked: new Date().toLocaleDateString('fa-IR')
        };
      }
      return item;
    }));
  };

  const updateInventoryItem = (updated: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  // Redeem Reward
  const redeemReward = (reward: LoyaltyReward): boolean => {
    if (customer.points < reward.pointsCost) {
      return false;
    }

    setCustomer(prev => ({
      ...prev,
      points: prev.points - reward.pointsCost
    }));

    setAppliedDiscount(reward.discountAmount);
    setAppliedRewardTitle(reward.titleFa);

    sendSMS(
      customer.phone,
      'لمیز کلاب - پاداش وفاداری فعال شد',
      `جایزه "${reward.titleFa}" به ارزش ${reward.discountAmount.toLocaleString('fa-IR')} تومان فعال شد و روی فاکتور بعدی شما اعمال می‌گردد.`
    );

    return true;
  };

  const clearAppliedDiscount = () => {
    setAppliedDiscount(0);
    setAppliedRewardTitle(null);
  };

  const unreadSmsCount = smsInbox.filter(m => !m.read).length;
  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        selectedProduct,
        setSelectedProduct,
        toggleProductAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartTotal,
        appliedDiscount,
        appliedRewardTitle,
        orders,
        activeOrder,
        setActiveOrderId,
        createOrder,
        updateOrderStatus,
        inventory,
        restockItem,
        updateInventoryItem,
        customer,
        redeemReward,
        clearAppliedDiscount,
        smsInbox,
        unreadSmsCount,
        isSMSModalOpen,
        setIsSMSModalOpen,
        markSmsRead,
        sendManualSMS,
        financialStats,
        isPaymentGatewayOpen,
        setIsPaymentGatewayOpen,
        pendingOrderDetails,
        setPendingOrderDetails
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
