export type ProductCategory = 
  | 'espresso_bar' 
  | 'brew_bar' 
  | 'cold_beverages' 
  | 'tea_herbal' 
  | 'bakery_pastry' 
  | 'sandwiches_breakfast' 
  | 'retail_beans';

export interface ProductCustomizationOptions {
  sizes?: { name: string; extraPrice: number }[];
  milkTypes?: { name: string; extraPrice: number }[];
  sweetLevels?: { name: string; extraPrice: number }[];
  allowExtraShot?: boolean;
  extraShotPrice?: number;
}

export interface IngredientRequirement {
  ingredientId: string;
  amountRequired: number; // in grams, ml, or units
}

export interface Product {
  id: string;
  nameFa: string;
  nameEn: string;
  category: ProductCategory;
  price: number; // in Tomans
  descriptionFa: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  isAvailable: boolean;
  calories?: number;
  prepTimeMinutes: number;
  customization?: ProductCustomizationOptions;
  ingredientsRequired?: IngredientRequirement[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedMilk?: string;
  selectedSweet?: string;
  extraShots: number;
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'takeaway' | 'dinein' | 'delivery';

export type OrderStatus = 'paid' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. LMZ-4082
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentRef: string;
  status: OrderStatus;
  createdAt: string; // ISO
  estimatedMinutes: number;
  pointsEarned: number;
  pointsRedeemed: number;
}

export interface InventoryItem {
  id: string;
  nameFa: string;
  category: 'coffee_beans' | 'dairy_alternatives' | 'syrups' | 'packaging' | 'bakery' | 'fresh_produce';
  currentStock: number;
  unit: 'کیلوگرم' | 'لیتر' | 'عدد' | 'بسته';
  minStockAlert: number;
  costPerUnit: number; // in Tomans
  lastRestocked: string;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'black';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: LoyaltyTier;
  points: number;
  stamps: number; // 0 to 5, at 5 free drink
  totalSpent: number;
  ordersCount: number;
  joinDate: string;
  favoriteItem: string;
  caffeineScore: number; // e.g. 85/100
  favoriteOrderHour: string;
}

export interface LoyaltyReward {
  id: string;
  titleFa: string;
  descriptionFa: string;
  pointsCost: number;
  discountAmount: number;
  icon: string;
  badge: string;
}

export interface SMSMessage {
  id: string;
  orderId?: string;
  phone: string;
  title: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PeakHourStat {
  hour: string;
  sales: number;
  ordersCount: number;
}

export interface TopProductStat {
  name: string;
  quantity: number;
  revenue: number;
}

export interface FinancialStats {
  todayRevenue: number;
  yesterdayRevenue: number;
  totalOrdersToday: number;
  averageOrderValue: number;
  costOfGoodsSold: number;
  netProfitToday: number;
  profitMarginPercent: number;
  peakHours: PeakHourStat[];
  topProducts: TopProductStat[];
  categoryBreakdown: { categoryName: string; amount: number; percentage: number }[];
}
