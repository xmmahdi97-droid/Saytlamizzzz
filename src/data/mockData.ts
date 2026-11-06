import { Product, ProductCategory, InventoryItem, LoyaltyReward, CustomerProfile, FinancialStats } from '../types';

export interface CategoryInfo {
  id: ProductCategory;
  nameFa: string;
  nameEn: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'espresso_bar',
    nameFa: 'اسپرسوبار و قهوه‌های گرم',
    nameEn: 'Espresso Bar',
    iconName: 'Coffee',
    description: 'عصاره‌گیری تخصصی با دانه‌های تازه برشته‌شده لمیز'
  },
  {
    id: 'brew_bar',
    nameFa: 'قهوه‌های دمی تخصصی',
    nameEn: 'Brew Bar & Manual',
    iconName: 'Flame',
    description: 'دم‌آوری فیلتری موج سوم (V60، کمکس و آیروپرس)'
  },
  {
    id: 'cold_beverages',
    nameFa: 'نوشیدنی‌های سرد و آیس',
    nameEn: 'Cold & Iced Drinks',
    iconName: 'GlassWater',
    description: 'آیس لاته، کلد برو ۲۴ ساعته و ماکتل‌های دست‌ساز'
  },
  {
    id: 'tea_herbal',
    nameFa: 'چای، دمنوش و لاته غیرقهوه‌ای',
    nameEn: 'Tea & Infusions',
    iconName: 'Leaf',
    description: 'ماچا ژاپنی، چای ماسالا هندی و دمنوش‌های ارگانیک'
  },
  {
    id: 'bakery_pastry',
    nameFa: 'نان، کیک و شیرینی روز',
    nameEn: 'Bakery & Pastry',
    iconName: 'CakeSlice',
    description: 'پخت روزانه در کارگاه قنادی لمیز با کره طبیعی'
  },
  {
    id: 'sandwiches_breakfast',
    nameFa: 'صبحانه و ساندویچ‌های گرم',
    nameEn: 'Breakfast & Sandwiches',
    iconName: 'Utensils',
    description: 'نان‌های آرتیزان تازه و رسپی‌های مقوی صبح تا عصر'
  },
  {
    id: 'retail_beans',
    nameFa: 'دانه‌های قهوه و لوازم دم‌آوری',
    nameEn: 'Beans & Retail',
    iconName: 'Package',
    description: 'بسته‌های ۲۵۰ گرمی دان تازه رُست و ابزارهای خانگی'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Espresso Bar
  {
    id: 'prod-esp-1',
    nameFa: 'اسپرسو دابل لمیز',
    nameEn: 'Double Espresso Lamiz',
    category: 'espresso_bar',
    price: 85000,
    descriptionFa: 'عصاره‌گیری دابل شات از ترکیب ۱۰۰٪ عربیکا با نت‌های شکلات تلخ، کارامل و اسیدیته ملایم مرکباتی.',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 5,
    prepTimeMinutes: 4,
    customization: {
      sizes: [
        { name: 'سینگل شات (۳۰ میلی‌لیتر)', extraPrice: -15000 },
        { name: 'دابل شات استاندار لمیز (۶۰ میلی‌لیتر)', extraPrice: 0 },
        { name: 'تریپل شات قوی', extraPrice: 35000 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 } // 18g
    ]
  },
  {
    id: 'prod-esp-2',
    nameFa: 'کافه لاته ویژه لمیز',
    nameEn: 'Signature Caffe Latte',
    category: 'espresso_bar',
    price: 135000,
    descriptionFa: 'اسپرسو دوبل ترکیب شده با شیر استیم‌شده مخملی و یک لایه نازک میکروفوم، همراه با آرت باریستا.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 180,
    prepTimeMinutes: 6,
    customization: {
      sizes: [
        { name: 'کوچک (۲۴۰ میلی‌لیتر)', extraPrice: -10000 },
        { name: 'متوسط استاندار (۳۶۰ میلی‌لیتر)', extraPrice: 0 },
        { name: 'بزرگ ماگ (۴۸۰ میلی‌لیتر)', extraPrice: 20000 }
      ],
      milkTypes: [
        { name: 'شیر کامل پرچرب لمیز', extraPrice: 0 },
        { name: 'شیر کم‌چرب ۱.۵٪', extraPrice: 0 },
        { name: 'شیر جو دوسر گیاهی (Oat Milk)', extraPrice: 28000 },
        { name: 'شیر بادام ارگانیک', extraPrice: 28000 },
        { name: 'شیر بدون لاکتوز', extraPrice: 12000 }
      ],
      sweetLevels: [
        { name: 'بدون شکر و افزودنی', extraPrice: 0 },
        { name: 'سیروپ وانیل ماداگاسکار', extraPrice: 18000 },
        { name: 'سیروپ کارامل نمکی خانگی', extraPrice: 20000 },
        { name: 'سیروپ فندق تست‌شده', extraPrice: 18000 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-milk-full', amountRequired: 220 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-esp-3',
    nameFa: 'کاپوچینو کلاسیک ایتالیایی',
    nameEn: 'Classic Italian Cappuccino',
    category: 'espresso_bar',
    price: 130000,
    descriptionFa: 'تعادل دقیق یک‌سوم اسپرسو، یک‌سوم شیر داغ و یک‌سوم فوم کرمی متراکم با پودر دارچین یا کاکائوی هلندی.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
    calories: 140,
    prepTimeMinutes: 5,
    customization: {
      sizes: [
        { name: 'استاندارد (۲۲۰ میلی‌لیتر)', extraPrice: 0 },
        { name: 'دوبل کاپوچینو (۳۴۰ میلی‌لیتر)', extraPrice: 20000 }
      ],
      milkTypes: [
        { name: 'شیر کامل پرچرب', extraPrice: 0 },
        { name: 'شیر جو دوسر (Oat)', extraPrice: 28000 },
        { name: 'شیر بادام', extraPrice: 28000 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-milk-full', amountRequired: 160 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-esp-4',
    nameFa: 'فلت وایت (Flat White)',
    nameEn: 'Flat White',
    category: 'espresso_bar',
    price: 140000,
    descriptionFa: 'دابل ریسترتو پرکشش با شیر استیم‌شده با حباب‌های بسیار ریز (Microfoam) و طعم قوی‌تر قهوه نسبت به لاته.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 120,
    prepTimeMinutes: 5,
    customization: {
      milkTypes: [
        { name: 'شیر کامل پرچرب لمیز', extraPrice: 0 },
        { name: 'شیر جو دوسر گیاهی', extraPrice: 28000 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 20 },
      { ingredientId: 'inv-milk-full', amountRequired: 150 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-esp-5',
    nameFa: 'اسپانیش لاته عسلی',
    nameEn: 'Spanish Honey Latte',
    category: 'espresso_bar',
    price: 155000,
    descriptionFa: 'ترکیب اعجاب‌انگیز شیر غلیظ کاراملیزه، شیر تازه بخار داده شده و شات‌های پرکشش اسپرسوی لمیز.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    isPopular: true,
    isAvailable: true,
    calories: 240,
    prepTimeMinutes: 6,
    customization: {
      sizes: [
        { name: 'متوسط (۳۵۰ میلی‌لیتر)', extraPrice: 0 },
        { name: 'بزرگ (۴۵۰ میلی‌لیتر)', extraPrice: 25000 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-milk-full', amountRequired: 180 },
      { ingredientId: 'inv-syrup-condensed', amountRequired: 30 }
    ]
  },
  {
    id: 'prod-esp-6',
    nameFa: 'کورتادو (Cortado)',
    nameEn: 'Cortado Glass',
    category: 'espresso_bar',
    price: 110000,
    descriptionFa: 'نسبت برابر ۵۰٪ دابل اسپرسو و ۵۰٪ شیر ابریشمی گرم در لیوان شیشه‌ای اصیل گیبرالتار.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    calories: 70,
    prepTimeMinutes: 4,
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-milk-full', amountRequired: 60 }
    ]
  },

  // Brew Bar
  {
    id: 'prod-brew-1',
    nameFa: 'قهوه دمی V60 کلمبیا سوپریمو',
    nameEn: 'V60 Colombia Supremo',
    category: 'brew_bar',
    price: 145000,
    descriptionFa: 'دم‌آوری قطره‌ای دستی با فیلتر ژاپنی هاریو. نت‌های شفاف سیب سرخ، فندق بو داده و پایانی کاراملی.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 4,
    prepTimeMinutes: 7,
    customization: {
      sizes: [
        { name: 'یک نفره (۲۵۰ میلی‌لیتر)', extraPrice: 0 },
        { name: 'دونفره در سرور شیشه‌ای (۴۵۰ میلی‌لیتر)', extraPrice: 65000 }
      ]
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-colombia', amountRequired: 18 },
      { ingredientId: 'inv-v60-filter', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-brew-2',
    nameFa: 'قهوه دمی کمکس اتیوپی یرگاچف',
    nameEn: 'Chemex Ethiopia Yirgacheffe',
    category: 'brew_bar',
    price: 160000,
    descriptionFa: 'عصاره‌گیری با فیلتر ضخیم کمکس برای بادی سبک و تمیز، سرشار از عطر گل یاس، لیمو عمانی و ترنج.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isAvailable: true,
    calories: 4,
    prepTimeMinutes: 8,
    ingredientsRequired: [
      { ingredientId: 'inv-beans-ethiopia', amountRequired: 22 }
    ]
  },
  {
    id: 'prod-brew-3',
    nameFa: 'کلد برو نیتروژن ۲۴ ساعته',
    nameEn: 'Nitro Cold Brew 24h',
    category: 'brew_bar',
    price: 145000,
    descriptionFa: 'عصاره‌گیری سرد آهسته در طول ۲۴ ساعت در آب یخ با بافت خنک، اسیدیته بسیار پایین و کف کرمی شبیه گینس.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 10,
    prepTimeMinutes: 2,
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 25 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },

  // Cold Drinks
  {
    id: 'prod-cold-1',
    nameFa: 'آیس لاته کاراملی لمیز',
    nameEn: 'Iced Caramel Latte',
    category: 'cold_beverages',
    price: 145000,
    descriptionFa: 'اسپرسو دابل تازه ریخته‌شده روی شیر سرد، یخ قالبی شفاف و لایه‌بندی سس کارامل دست‌ساز با نمک دریا.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 210,
    prepTimeMinutes: 5,
    customization: {
      milkTypes: [
        { name: 'شیر کامل پرچرب', extraPrice: 0 },
        { name: 'شیر جو دوسر گیاهی', extraPrice: 28000 },
        { name: 'شیر بادام', extraPrice: 28000 }
      ],
      sweetLevels: [
        { name: 'شیرینی استاندارد لمیز', extraPrice: 0 },
        { name: 'کم‌شیرین (نصف سیروپ)', extraPrice: 0 },
        { name: 'بدون سیروپ شیرین‌کننده', extraPrice: 0 }
      ],
      allowExtraShot: true,
      extraShotPrice: 35000
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-milk-full', amountRequired: 220 },
      { ingredientId: 'inv-syrup-caramel', amountRequired: 20 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-cold-2',
    nameFa: 'آفاگاتو با جلاتو وانیل',
    nameEn: 'Affogato al Caffe',
    category: 'cold_beverages',
    price: 125000,
    descriptionFa: 'یک اسکوپ سخاوتمندانه جلاتو وانیلی دست‌ساز ایتالیایی که با یک شات اسپرسوی داغ غلیظ حمام می‌شود.',
    image: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    calories: 190,
    prepTimeMinutes: 3,
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 18 },
      { ingredientId: 'inv-gelato-vanilla', amountRequired: 80 }
    ]
  },
  {
    id: 'prod-cold-3',
    nameFa: 'آیس فراپه شکلات فندق',
    nameEn: 'Chocolate Hazelnut Frappe',
    category: 'cold_beverages',
    price: 165000,
    descriptionFa: 'ترکیب یخ‌زده پودر فندق طبیعی، سس گاناش شکلاتی تلخ، شیر و خامه قنادی پفکی به همراه خرد پسته.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    isAvailable: true,
    calories: 340,
    prepTimeMinutes: 7,
    ingredientsRequired: [
      { ingredientId: 'inv-milk-full', amountRequired: 180 },
      { ingredientId: 'inv-chocolate-sauce', amountRequired: 30 }
    ]
  },

  // Tea & Infusions
  {
    id: 'prod-tea-1',
    nameFa: 'ماچا لاته سلطنتی ژاپن',
    nameEn: 'Ceremonial Matcha Latte',
    category: 'tea_herbal',
    price: 155000,
    descriptionFa: 'پودر ماچا درجه تشریفاتی کیوتو همراه با شیر نارگیل یا شیر جو دوسر و طعم دهنده ملایم عسل طبیعی.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 120,
    prepTimeMinutes: 6,
    customization: {
      milkTypes: [
        { name: 'شیر جو دوسر گیاهی (پیشنهادی باریستا)', extraPrice: 0 },
        { name: 'شیر کامل تازه', extraPrice: 0 },
        { name: 'شیر بادام', extraPrice: 15000 }
      ]
    },
    ingredientsRequired: [
      { ingredientId: 'inv-matcha-powder', amountRequired: 5 },
      { ingredientId: 'inv-milk-full', amountRequired: 200 }
    ]
  },
  {
    id: 'prod-tea-2',
    nameFa: 'چای ماسالا اصل بمبئی با ادویه‌های گرم',
    nameEn: 'Authentic Bombay Chai Masala',
    category: 'tea_herbal',
    price: 120000,
    descriptionFa: 'دم‌کشیده با هل سبز درسته، چوب دارچین سیلان، زنجبیل تازه، میخک، فلفل سیاه و شیر جوشیده با عسل.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    calories: 150,
    prepTimeMinutes: 6,
    ingredientsRequired: [
      { ingredientId: 'inv-milk-full', amountRequired: 200 },
      { ingredientId: 'inv-cup-med', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-tea-3',
    nameFa: 'دمنوش آرامش لمیز (گل‌گاوزبان و سنبل‌الطیب)',
    nameEn: 'Calming Herbal Infusion',
    category: 'tea_herbal',
    price: 98000,
    descriptionFa: 'ترکیب اصیل گل گاوزبان کوهی قزوین، به‌لیمو، سنبل‌الطیب، پرک گل سرخ کاشان و نبات زعفرانی.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    calories: 2,
    prepTimeMinutes: 8,
    ingredientsRequired: [
      { ingredientId: 'inv-herbal-mix', amountRequired: 15 }
    ]
  },

  // Bakery & Pastry
  {
    id: 'prod-bake-1',
    nameFa: 'چیزکیک سن سباستین لمیز',
    nameEn: 'San Sebastian Burnt Cheesecake',
    category: 'bakery_pastry',
    price: 185000,
    descriptionFa: 'چیزکیک کاراملیزه سبک باسکی با بافت بسیار نرم و کرمی ذوب‌شونده، به همراه سس شکلات بلژیکی داغ.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 420,
    prepTimeMinutes: 2,
    ingredientsRequired: [
      { ingredientId: 'inv-cheesecake-slice', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-bake-2',
    nameFa: 'کرواسان کره‌ای فرانسوی شکلات تلخ',
    nameEn: 'Pain au Chocolat Croissant',
    category: 'bakery_pastry',
    price: 115000,
    descriptionFa: 'پخت هر روز ساعت ۸ صبح با کره طبیعی نیوزلندی، لایه‌لایه با ورقه شکلات ۶۰٪ دارک بلژیکی.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 310,
    prepTimeMinutes: 2,
    ingredientsRequired: [
      { ingredientId: 'inv-croissant-pastry', amountRequired: 1 }
    ]
  },
  {
    id: 'prod-bake-3',
    nameFa: 'کیک هویج گردو با کرم‌چیز دارچینی',
    nameEn: 'Spiced Carrot Walnut Cake',
    category: 'bakery_pastry',
    price: 145000,
    descriptionFa: 'بافت نم‌دار معطر با هویج محلی رنده‌شده، گردوی تازه تویسرکان، ادویه جوز هندی و فراستینگ پنیر خامه‌ای.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    calories: 380,
    prepTimeMinutes: 2,
    ingredientsRequired: [
      { ingredientId: 'inv-carrotcake-slice', amountRequired: 1 }
    ]
  },

  // Sandwiches & Breakfast
  {
    id: 'prod-sand-1',
    nameFa: 'کرواسان ساندویچ بوقلمون و پنیر گودا',
    nameEn: 'Smoked Turkey Croissant Sandwich',
    category: 'sandwiches_breakfast',
    price: 210000,
    descriptionFa: 'سینه بوقلمون دودی طبیعی، پنیر گودای ذوب‌شده، خیارشور نازک خانگی، سس دیژون دست‌ساز و ریحان تازه.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 460,
    prepTimeMinutes: 8,
    ingredientsRequired: [
      { ingredientId: 'inv-croissant-pastry', amountRequired: 1 },
      { ingredientId: 'inv-turkey-slices', amountRequired: 80 }
    ]
  },
  {
    id: 'prod-sand-2',
    nameFa: 'پانینی مرغ پستو با موتزارلا تازه',
    nameEn: 'Chicken Pesto Panini',
    category: 'sandwiches_breakfast',
    price: 235000,
    descriptionFa: 'فیله مرغ مرینیت‌شده، سس پستوی خانگی با ریحان ایتالیایی و گردو، پنیر موتزارلا کش‌دار روی نان چاباتا گریل‌شده.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    calories: 520,
    prepTimeMinutes: 10,
    ingredientsRequired: [
      { ingredientId: 'inv-ciabatta-bread', amountRequired: 1 },
      { ingredientId: 'inv-chicken-breast', amountRequired: 120 }
    ]
  },

  // Retail & Coffee Beans
  {
    id: 'prod-bean-1',
    nameFa: 'بسته دان قهوه ترکیب ۱۰۰٪ عربیکا لمیز (۲۵۰ گرم)',
    nameEn: 'Lamiz 100% Arabica Signature Blend 250g',
    category: 'retail_beans',
    price: 360000,
    descriptionFa: 'ترکیب انحصاری برشته‌کاری لمیز از مزارع آمریکای جنوبی و آفریقا. رُست مدیوم، بادی متوسط با اسیدیته زنده میوه‌ای.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 1,
    customization: {
      sizes: [
        { name: 'دانه کامل (آسیاب‌نشده)', extraPrice: 0 },
        { name: 'آسیاب مناسب اسپرسوساز خانگی', extraPrice: 0 },
        { name: 'آسیاب مناسب موکاپات و فرنچ پرس', extraPrice: 0 },
        { name: 'آسیاب درشت مناسب فیلتری و V60', extraPrice: 0 }
      ]
    },
    ingredientsRequired: [
      { ingredientId: 'inv-beans-house', amountRequired: 250 }
    ]
  },
  {
    id: 'prod-bean-2',
    nameFa: 'بسته دان تک‌خاستگاه کلمبیا سوپریمو (۲۵۰ گرم)',
    nameEn: 'Single Origin Colombia Supremo 250g',
    category: 'retail_beans',
    price: 410000,
    descriptionFa: 'محصول ارتفاعات ۱۸۰۰ متری مدلین. فرآوری شسته، یادآور طعم تافی، فندق بوداده، کاکائو و پایان شیرین ماندگار.',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    prepTimeMinutes: 1,
    ingredientsRequired: [
      { ingredientId: 'inv-beans-colombia', amountRequired: 250 }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-beans-house',
    nameFa: 'دان قهوه هاوس بلند لمیز (عربیکا)',
    category: 'coffee_beans',
    currentStock: 42.5,
    unit: 'کیلوگرم',
    minStockAlert: 15.0,
    costPerUnit: 780000,
    lastRestocked: '۱۴۰۳/۰۸/۱۴'
  },
  {
    id: 'inv-beans-colombia',
    nameFa: 'دان تک‌خاستگاه کلمبیا سوپریمو',
    category: 'coffee_beans',
    currentStock: 18.0,
    unit: 'کیلوگرم',
    minStockAlert: 8.0,
    costPerUnit: 920000,
    lastRestocked: '۱۴۰۳/۰۸/۱۲'
  },
  {
    id: 'inv-beans-ethiopia',
    nameFa: 'دان تک‌خاستگاه اتیوپی یرگاچف',
    category: 'coffee_beans',
    currentStock: 6.2,
    unit: 'کیلوگرم',
    minStockAlert: 8.0, // Low stock warning triggered
    costPerUnit: 1050000,
    lastRestocked: '۱۴۰۳/۰۸/۰۵'
  },
  {
    id: 'inv-milk-full',
    nameFa: 'شیر کامل پرچرب تازه پاستوریزه',
    category: 'dairy_alternatives',
    currentStock: 84.0,
    unit: 'لیتر',
    minStockAlert: 30.0,
    costPerUnit: 38000,
    lastRestocked: '۱۴۰۳/۰۸/۱۶'
  },
  {
    id: 'inv-cup-med',
    nameFa: 'لیوان دو جداره کاغذی بیرون‌بر ۳۶۰ میل',
    category: 'packaging',
    currentStock: 650,
    unit: 'عدد',
    minStockAlert: 200,
    costPerUnit: 3500,
    lastRestocked: '۱۴۰۳/۰۸/۱۰'
  },
  {
    id: 'inv-cheesecake-slice',
    nameFa: 'اسلایس کیک سن سباستین روز',
    category: 'bakery',
    currentStock: 14,
    unit: 'عدد',
    minStockAlert: 10,
    costPerUnit: 85000,
    lastRestocked: '۱۴۰۳/۰۸/۱۶'
  },
  {
    id: 'inv-croissant-pastry',
    nameFa: 'کرواسان تازه کره‌ای آماده سرو',
    category: 'bakery',
    currentStock: 8,
    unit: 'عدد',
    minStockAlert: 12, // Low stock warning triggered
    costPerUnit: 48000,
    lastRestocked: '۱۴۰۳/۰۸/۱۶'
  },
  {
    id: 'inv-syrup-caramel',
    nameFa: 'سیروپ کارامل نمکی ۱ لیتری',
    category: 'syrups',
    currentStock: 5.5,
    unit: 'لیتر',
    minStockAlert: 2.0,
    costPerUnit: 240000,
    lastRestocked: '۱۴۰۳/۰۸/۰۱'
  }
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-1',
    titleFa: 'یک فنجان قهوه دمی یا لاته رایگان',
    descriptionFa: 'قابل استفاده برای هر نوع نوشیدنی گرم یا سرد در اندازه متوسط',
    pointsCost: 150,
    discountAmount: 140000,
    icon: 'Coffee',
    badge: 'محبوب‌ترین جایزه'
  },
  {
    id: 'rew-2',
    titleFa: 'کوپن تخفیف ۵۰ هزار تومانی سبد خرید',
    descriptionFa: 'اعمال بر روی هر سفارش بالای ۲۰۰ هزار تومان',
    pointsCost: 80,
    discountAmount: 50000,
    icon: 'Ticket',
    badge: 'صرفه‌جویی سریع'
  },
  {
    id: 'rew-3',
    titleFa: 'یک اسلایس کیک سن سباستین رایگان',
    descriptionFa: 'همراه با سس شکلات بلژیکی هدیه تولد یا ایونت لمیز',
    pointsCost: 220,
    discountAmount: 185000,
    icon: 'CakeSlice',
    badge: 'طعم ویژه'
  },
  {
    id: 'rew-4',
    titleFa: 'تخفیف ۲۵٪ خرید بسته دانه قهوه ۲۵۰ گرمی',
    descriptionFa: 'ویژه اعضای باشگاه برای خرید قهوه تازه مصرف خانگی',
    pointsCost: 120,
    discountAmount: 90000,
    icon: 'Package',
    badge: 'دوستداران قهوه'
  }
];

export const DEFAULT_CUSTOMER: CustomerProfile = {
  id: 'cust-9821',
  name: 'مهدی زارعی',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  email: 'mmmmjjjjzzzzeeee@gmail.com',
  tier: 'gold',
  points: 185,
  stamps: 3, // 3 of 5 filled
  totalSpent: 2840000,
  ordersCount: 14,
  joinDate: '۱۴۰۳/۰۱/۱۵',
  favoriteItem: 'کافه لاته ویژه لمیز',
  caffeineScore: 92,
  favoriteOrderHour: '۰۸:۳۰ صبح (پیش از کار)'
};

export const INITIAL_FINANCIAL_STATS: FinancialStats = {
  todayRevenue: 4890000,
  yesterdayRevenue: 4320000,
  totalOrdersToday: 38,
  averageOrderValue: 128680,
  costOfGoodsSold: 1680000,
  netProfitToday: 3210000,
  profitMarginPercent: 65.6,
  peakHours: [
    { hour: '۰۸:۰۰ - ۱۰:۰۰', sales: 1250000, ordersCount: 11 },
    { hour: '۱۰:۰۰ - ۱۲:۰۰', sales: 840000, ordersCount: 7 },
    { hour: '۱۲:۰۰ - ۱۴:۰۰', sales: 910000, ordersCount: 6 },
    { hour: '۱۴:۰۰ - ۱۷:۰۰', sales: 520000, ordersCount: 4 },
    { hour: '۱۷:۰۰ - ۲۱:۰۰', sales: 1370000, ordersCount: 10 }
  ],
  topProducts: [
    { name: 'کافه لاته ویژه لمیز', quantity: 24, revenue: 3240000 },
    { name: 'اسپرسو دابل لمیز', quantity: 19, revenue: 1615000 },
    { name: 'چیزکیک سن سباستین', quantity: 12, revenue: 2220000 },
    { name: 'آیس لاته کاراملی', quantity: 10, revenue: 1450000 },
    { name: 'ساندویچ کرواسان بوقلمون', quantity: 7, revenue: 1470000 }
  ],
  categoryBreakdown: [
    { categoryName: 'اسپرسوبار و قهوه گرم', amount: 2450000, percentage: 50 },
    { categoryName: 'کیک و قنادی', amount: 1250000, percentage: 26 },
    { categoryName: 'نوشیدنی‌های سرد', amount: 650000, percentage: 13 },
    { categoryName: 'صبحانه و ساندویچ', amount: 540000, percentage: 11 }
  ]
};
