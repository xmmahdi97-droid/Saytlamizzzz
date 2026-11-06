import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Minus, 
  Coffee, 
  Clock, 
  Flame, 
  Check, 
  Sparkles,
  ShoppingBag,
  Info
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.customization?.sizes?.[0]?.name || ''
  );
  const [selectedMilk, setSelectedMilk] = useState<string>(
    product.customization?.milkTypes?.[0]?.name || ''
  );
  const [selectedSweet, setSelectedSweet] = useState<string>(
    product.customization?.sweetLevels?.[0]?.name || ''
  );
  const [extraShots, setExtraShots] = useState(0);
  const [notes, setNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Price Calculation
  let calculatedUnitPrice = product.price;

  if (selectedSize && product.customization?.sizes) {
    const sizeOpt = product.customization.sizes.find((s: { name: string; extraPrice: number }) => s.name === selectedSize);
    if (sizeOpt) calculatedUnitPrice += sizeOpt.extraPrice;
  }

  if (selectedMilk && product.customization?.milkTypes) {
    const milkOpt = product.customization.milkTypes.find((m: { name: string; extraPrice: number }) => m.name === selectedMilk);
    if (milkOpt) calculatedUnitPrice += milkOpt.extraPrice;
  }

  if (selectedSweet && product.customization?.sweetLevels) {
    const sweetOpt = product.customization.sweetLevels.find((s: { name: string; extraPrice: number }) => s.name === selectedSweet);
    if (sweetOpt) calculatedUnitPrice += sweetOpt.extraPrice;
  }

  if (extraShots > 0 && product.customization?.extraShotPrice) {
    calculatedUnitPrice += extraShots * product.customization.extraShotPrice;
  }

  const finalTotalPrice = calculatedUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedSize || undefined,
      selectedMilk || undefined,
      selectedSweet || undefined,
      extraShots,
      notes || undefined
    );

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8DCCF] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#2C1810]">
          <img 
            src={product.image} 
            alt={product.nameFa}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on hero */}
          <div className="absolute bottom-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#D4AF37] text-[#2C1810] font-black px-2.5 py-0.5 rounded-full">
                  کافه لمیز
                </span>
                {product.isPopular && (
                  <span className="text-xs bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    محبوب مشتریان
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{product.nameFa}</h2>
              <p className="text-xs sm:text-sm text-[#E0D3C1] font-medium tracking-wide">{product.nameEn}</p>
            </div>

            <div className="bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white text-left">
              <span className="text-xs block text-[#F3EADF]">قیمت پایه</span>
              <span className="text-xl font-black tracking-tight">{product.price.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span></span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2C1810]">
          
          {/* Description & Quick Stats */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ECE2D5] space-y-3">
            <p className="text-sm leading-relaxed text-[#4A3B32]">
              {product.descriptionFa}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#7A6354] pt-2 border-t border-[#E8DDCE]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8D5B4C]" />
                <span>زمان آماده‌سازی: {product.prepTimeMinutes} دقیقه</span>
              </div>
              {product.calories && (
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>انرژی تقریبی: {product.calories} کالری</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-[#6F4E37]" />
                <span>دانه تازه برشته لمیز</span>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          {product.customization?.sizes && (
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#2C1810] flex items-center gap-2">
                <span>انتخاب اندازه فنجان</span>
                <span className="text-xs font-normal text-[#8D7668]">(اجباری)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.customization.sizes.map((size: { name: string; extraPrice: number }) => (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-3 rounded-2xl text-right text-xs transition-all border ${
                      selectedSize === size.name
                        ? 'border-[#6F4E37] bg-[#F7F2EC] text-[#2C1810] shadow-xs ring-1 ring-[#6F4E37]'
                        : 'border-[#E5DACD] bg-white text-[#5E4C41] hover:border-[#C4B29E]'
                    }`}
                  >
                    <div className="font-bold mb-1 flex items-center justify-between">
                      <span>{size.name}</span>
                      {selectedSize === size.name && <Check className="w-4 h-4 text-[#6F4E37]" />}
                    </div>
                    <span className="text-[11px] text-[#8C7464]">
                      {size.extraPrice === 0 ? 'قیمت پایه' : `${size.extraPrice > 0 ? '+' : ''}${size.extraPrice.toLocaleString('fa-IR')} ت`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Milk Options */}
          {product.customization?.milkTypes && (
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#2C1810] flex items-center gap-2">
                <span>انتخاب نوع شیر</span>
                <span className="text-xs font-normal text-[#8D7668]">(دلخواه)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.customization.milkTypes.map((milk: { name: string; extraPrice: number }) => (
                  <button
                    key={milk.name}
                    type="button"
                    onClick={() => setSelectedMilk(milk.name)}
                    className={`p-3 rounded-2xl text-right text-xs transition-all border ${
                      selectedMilk === milk.name
                        ? 'border-[#6F4E37] bg-[#F7F2EC] text-[#2C1810] ring-1 ring-[#6F4E37]'
                        : 'border-[#E5DACD] bg-white text-[#5E4C41] hover:border-[#C4B29E]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{milk.name}</span>
                      {selectedMilk === milk.name && <Check className="w-4 h-4 text-[#6F4E37]" />}
                    </div>
                    {milk.extraPrice > 0 && (
                      <span className="text-[11px] text-[#8C7464] mt-1 block">
                        +{milk.extraPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness & Syrups */}
          {product.customization?.sweetLevels && (
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-[#2C1810]">
                سیروپ یا درجه شیرینی
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.customization.sweetLevels.map((sweet: { name: string; extraPrice: number }) => (
                  <button
                    key={sweet.name}
                    type="button"
                    onClick={() => setSelectedSweet(sweet.name)}
                    className={`p-2.5 rounded-xl text-right text-xs transition-all border ${
                      selectedSweet === sweet.name
                        ? 'border-[#6F4E37] bg-[#F7F2EC] text-[#2C1810] ring-1 ring-[#6F4E37]'
                        : 'border-[#E5DACD] bg-white text-[#5E4C41] hover:border-[#C4B29E]'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{sweet.name}</span>
                      {selectedSweet === sweet.name && <Check className="w-3.5 h-3.5 text-[#6F4E37]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shot */}
          {product.customization?.allowExtraShot && (
            <div className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE2D5]">
              <div>
                <span className="text-sm font-bold block text-[#2C1810]">شات اسپرسو اضافه (+۳۵,۰۰۰ تومان)</span>
                <span className="text-xs text-[#826D60]">برای ایجاد طعم پررنگ‌تر و کافئین بالاتر</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#DED0C1]">
                <button
                  type="button"
                  onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                  disabled={extraShots === 0}
                  className="w-7 h-7 rounded-lg bg-[#F4ECE2] disabled:opacity-30 text-[#2C1810] flex items-center justify-center font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-sm text-[#2C1810] min-w-4 text-center">{extraShots}</span>
                <button
                  type="button"
                  onClick={() => setExtraShots(Math.min(3, extraShots + 1))}
                  className="w-7 h-7 rounded-lg bg-[#6F4E37] text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Special Barista Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4A3B32] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8D5B4C]" />
              <span>یادداشت سفارش برای باریستا (اختیاری)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلا: خیلی داغ سرو شود، بدون شکر، با نی مقوایی..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DACD] text-xs text-[#2C1810] placeholder:text-[#A89689] focus:outline-hidden focus:border-[#6F4E37] focus:ring-1 focus:ring-[#6F4E37]"
            />
          </div>

        </div>

        {/* Footer Bar: Quantity & Add to Cart */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#ECE2D5] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-[#DED0C1] shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-[#F4ECE2] disabled:opacity-30 text-[#2C1810] flex items-center justify-center font-bold transition-transform active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-base text-[#2C1810] w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-bold transition-transform active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={addedSuccess}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-between shadow-lg transition-all ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#3D2314] to-[#25130A] text-white hover:shadow-xl hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-2">
              {addedSuccess ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />}
              <span>{addedSuccess ? 'به سبد اضافه شد!' : 'افزودن به سبد خرید'}</span>
            </div>
            <div className="text-left font-black tracking-tight text-amber-200">
              {finalTotalPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal text-white">تومان</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
