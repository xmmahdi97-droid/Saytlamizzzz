import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { ProductCategory, Product } from '../../types';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Clock, 
  Plus, 
  SlidersHorizontal,
  Coffee,
  Check
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';

export const MenuSection: React.FC = () => {
  const { products, selectedProduct, setSelectedProduct, addToCart } = useApp();
  
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'new'>('all');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    // Category match
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    // Filter mode match
    if (filterMode === 'popular' && !p.isPopular) return false;
    if (filterMode === 'new' && !p.isNew) return false;

    // Search query match (in fa or en)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFa = p.nameFa.toLowerCase().includes(q);
      const matchEn = p.nameEn.toLowerCase().includes(q);
      const matchDesc = p.descriptionFa.toLowerCase().includes(q);
      return matchFa || matchEn || matchDesc;
    }
    return true;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    // If product has mandatory size customization, open detail modal instead
    if (product.customization?.sizes && product.customization.sizes.length > 0) {
      setSelectedProduct(product);
      return;
    }

    addToCart(product, 1);
    setQuickAddedId(product.id);
    setTimeout(() => {
      setQuickAddedId(null);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2C1810] via-[#3E2314] to-[#211108] text-white p-6 sm:p-10 shadow-xl border border-[#D4AF37]/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] text-xs font-bold border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>برشته‌کاری تخصصی لمیز | تجربه اصیل قهوه موج سوم</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            عطر و طعم ماندگار، <br className="hidden sm:inline" />
            <span className="text-[#E8D8C8] bg-gradient-to-l from-[#E2B773] to-[#FFFFFF] bg-clip-text text-transparent">
              دم‌آوری تازه با هر سفارش
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#D4C3B3] leading-relaxed max-w-xl">
            سفارش آنلاین نوشیدنی‌های گرم و سرد، انواع شیرینی روز و دانه‌های قهوه بسته‌بندی با امکان سفارش بیرون‌بر، سرو در سالن و ارسال سریع همراه با امتیاز باشگاه لمیز کلاب.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#EAE0D5]">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-[#E2B773]" />
              <span>تحویل سریع ۱۰ تا ۱۵ دقیقه</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-xs">
              <Coffee className="w-3.5 h-3.5 text-[#E2B773]" />
              <span>۱۰۰٪ عربیکای تازه برشته‌شده</span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.15),transparent_50%)]" />
      </section>

      {/* Search and Filters Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#8C7667] absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در نام قهوه، شیرینی، ترکیبات یا انگلیسی (Latte, V60...)"
              className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white border border-[#E5DACD] text-sm text-[#2C1810] placeholder:text-[#A89689] shadow-2xs focus:outline-hidden focus:border-[#6F4E37] focus:ring-1 focus:ring-[#6F4E37] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#8C7667] hover:text-[#2C1810] font-bold"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 bg-[#F7F2EC] p-1.5 rounded-2xl border border-[#E5DACD]">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-[#2C1810] shadow-2xs'
                  : 'text-[#6F5B4E] hover:text-[#2C1810]'
              }`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterMode('popular')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterMode === 'popular'
                  ? 'bg-[#2C1810] text-white shadow-2xs'
                  : 'text-[#6F5B4E] hover:text-[#2C1810]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>پرفروش‌ترین‌ها</span>
            </button>
            <button
              onClick={() => setFilterMode('new')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                filterMode === 'new'
                  ? 'bg-[#2C1810] text-white shadow-2xs'
                  : 'text-[#6F5B4E] hover:text-[#2C1810]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>جدیدترین‌ها</span>
            </button>
          </div>

        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-md shadow-[#2C1810]/15'
                : 'bg-white text-[#5E4C41] border-[#E5DACD] hover:bg-[#FAF6F0]'
            }`}
          >
            همه منو ({products.length})
          </button>

          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-md shadow-[#2C1810]/15'
                    : 'bg-white text-[#5E4C41] border-[#E5DACD] hover:bg-[#FAF6F0]'
                }`}
              >
                <span>{cat.nameFa}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F2ECE3] text-[#7A6354]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE2D7] p-8 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F5ECE1] flex items-center justify-center text-[#8D7463]">
              <Coffee className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#2C1810]">محصولی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-[#826E60]">لطفاً عبارت دیگری را جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setFilterMode('all'); }}
              className="mt-2 px-4 py-2 bg-[#2C1810] text-white text-xs font-bold rounded-xl"
            >
              نمایش همه محصولات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isAdded = quickAddedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#ECE2D5] hover:border-[#CBB49C] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                >
                  {/* Image container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#FAF6F0]">
                    <img
                      src={product.image}
                      alt={product.nameFa}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                      {product.isPopular && (
                        <span className="bg-[#D4AF37] text-[#2C1810] text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          پرفروش
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                          جدید
                        </span>
                      )}
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E2B773]" />
                      <span>{product.prepTimeMinutes} دقیقه</span>
                    </div>

                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          اتمام موجودی امروز
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-snug">
                          {product.nameFa}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#8C7667] font-medium tracking-wide">
                        {product.nameEn}
                      </p>
                      <p className="text-xs text-[#5E4C41] line-clamp-2 leading-relaxed pt-1">
                        {product.descriptionFa}
                      </p>
                    </div>

                    {/* Price and Action Button */}
                    <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#8C7464] block">قیمت</span>
                        <div className="font-black text-base text-[#2C1810]">
                          {product.price.toLocaleString('fa-IR')}{' '}
                          <span className="text-xs font-normal text-[#6E5B4F]">تومان</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        disabled={!product.isAvailable}
                        className={`p-2.5 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#2C1810] text-[#E8D8C8] hover:bg-[#432616] group-hover:scale-105'
                        }`}
                        title="افزودن سریع یا تنظیمات"
                      >
                        {isAdded ? (
                          <Check className="w-5 h-5 text-white animate-bounce" />
                        ) : product.customization?.sizes ? (
                          <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[#D4AF37]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Selected Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
