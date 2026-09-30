import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Home,
  Info,
  Crown,
  Sparkles,
  Wrench,
  ShieldCheck,
  Phone,
  SlidersHorizontal,
  LayoutTemplate,
  Building2,
  Handshake
} from 'lucide-react';
import {
  MenuItemId,
  MenuItemDefinition,
  DEFAULT_MENU_ITEMS,
  DEFAULT_MENU_ITEMS_ORDER,
  SiteContent
} from './siteContentStorage';

interface MenuSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContent;
  onSaveMenuOrder: (orderedItems: MenuItemId[], hiddenItems: MenuItemId[]) => Promise<void>;
  onResetMenuOrder?: () => Promise<void>;
}

const MENU_ICONS: Record<MenuItemId, React.ComponentType<{ className?: string }>> = {
  home: Home,
  about: Info,
  founder: Crown,
  products: Sparkles,
  projects: Building2,
  'clients-partners': Handshake,
  custom: Wrench,
  'why-us': ShieldCheck,
  contact: Phone,
};

export const MenuSortModal: React.FC<MenuSortModalProps> = ({
  isOpen,
  onClose,
  siteContent,
  onSaveMenuOrder,
  onResetMenuOrder,
}) => {
  const [itemsOrder, setItemsOrder] = useState<MenuItemId[]>(() => {
    const raw = siteContent.menuItemsOrder;
    if (Array.isArray(raw) && raw.length > 0) {
      const valid = new Set<string>(DEFAULT_MENU_ITEMS_ORDER);
      const existing = raw.filter((id) => valid.has(id)) as MenuItemId[];
      const missing = DEFAULT_MENU_ITEMS_ORDER.filter((id) => !existing.includes(id));
      return [...existing, ...missing];
    }
    return [...DEFAULT_MENU_ITEMS_ORDER];
  });

  const [hiddenItems, setHiddenItems] = useState<MenuItemId[]>(() => {
    return Array.isArray(siteContent.hiddenMenuItems) ? siteContent.hiddenMenuItems : [];
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const raw = siteContent.menuItemsOrder;
      if (Array.isArray(raw) && raw.length > 0) {
        const valid = new Set<string>(DEFAULT_MENU_ITEMS_ORDER);
        const existing = raw.filter((id) => valid.has(id)) as MenuItemId[];
        const missing = DEFAULT_MENU_ITEMS_ORDER.filter((id) => !existing.includes(id));
        setItemsOrder([...existing, ...missing]);
      } else {
        setItemsOrder([...DEFAULT_MENU_ITEMS_ORDER]);
      }
      setHiddenItems(Array.isArray(siteContent.hiddenMenuItems) ? siteContent.hiddenMenuItems : []);
      setStatusMessage(null);
    }
  }, [isOpen, siteContent]);

  if (!isOpen) return null;

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...itemsOrder];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setItemsOrder(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= itemsOrder.length - 1) return;
    const next = [...itemsOrder];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setItemsOrder(next);
  };

  const toggleVisibility = (id: MenuItemId) => {
    setHiddenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        // Prevent hiding everything
        if (itemsOrder.length - prev.length <= 1) {
          alert('You must keep at least one navigation menu item visible.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Preset sorting algorithms
  const applyPreset = (preset: 'default' | 'alphabetical-asc' | 'alphabetical-desc' | 'products-first') => {
    let sorted: MenuItemId[] = [];
    if (preset === 'default') {
      sorted = [...DEFAULT_MENU_ITEMS_ORDER];
    } else if (preset === 'alphabetical-asc') {
      const defs = [...DEFAULT_MENU_ITEMS].sort((a, b) => a.labelEn.localeCompare(b.labelEn));
      sorted = defs.map((d) => d.id);
    } else if (preset === 'alphabetical-desc') {
      const defs = [...DEFAULT_MENU_ITEMS].sort((a, b) => b.labelEn.localeCompare(a.labelEn));
      sorted = defs.map((d) => d.id);
    } else if (preset === 'products-first') {
      const rest = DEFAULT_MENU_ITEMS_ORDER.filter((id) => id !== 'products');
      sorted = ['products', ...rest];
    }
    setItemsOrder(sorted);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage('جاري تطبيق وترتيب القائمة سحابياً...');
    try {
      await onSaveMenuOrder(itemsOrder, hiddenItems);
      setStatusMessage('تم حفظ وتطبيق ترتيب القائمة بنجاح!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatusMessage('حدث خطأ أثناء حفظ ترتيب القائمة.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('هل تريد استعادة الترتيب الافتراضي الأصلي للقائمة الرئيسية؟')) return;
    setItemsOrder([...DEFAULT_MENU_ITEMS_ORDER]);
    setHiddenItems([]);
    if (onResetMenuOrder) {
      setIsSaving(true);
      try {
        await onResetMenuOrder();
        setStatusMessage('تمت استعادة الترتيب الافتراضي.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getItemDef = (id: MenuItemId): MenuItemDefinition => {
    return DEFAULT_MENU_ITEMS.find((item) => item.id === id) || {
      id,
      labelEn: id,
      labelAr: id,
      defaultIndex: 0,
    };
  };

  const visibleCount = itemsOrder.length - hiddenItems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0f0e0a] border border-[#d4c59d] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4c59d]/30 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c1912] border border-[#d4c59d]/50 flex items-center justify-center text-[#d4c59d] shadow-inner">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-[#f5f0e6] flex items-center gap-2">
                <span>ترتيب عناصر القائمة الرئيسية</span>
                <span className="text-xs text-[#d4c59d] font-sans font-normal opacity-80">
                  (Sort Menu Items)
                </span>
              </h2>
              <p className="text-xs text-[#9e9174]">
                قم بتحريك العناصر لأعلى أو لأسفل لتغيير ترتيب ظهورها في الشريط العلوي وقائمة الهاتف
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#1a1820] rounded-lg transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quick Preset Bar */}
          <div className="bg-[#14130d] p-3 rounded-xl border border-[#d4c59d]/20 space-y-2">
            <div className="text-[11px] font-bold text-[#d4c59d] uppercase tracking-wider flex items-center justify-between">
              <span>ترتيبات جاهزة وسريعة (Quick Presets)</span>
              <span className="text-[10px] text-[#9e9174]">{visibleCount} عناصر مفعّلة</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('default')}
                className="px-2.5 py-1 text-xs rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 font-bold transition-all cursor-pointer"
              >
                الترتيب الافتراضي
              </button>
              <button
                type="button"
                onClick={() => applyPreset('alphabetical-asc')}
                className="px-2.5 py-1 text-xs rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 font-bold transition-all cursor-pointer"
              >
                أبجدي (A → Z)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('alphabetical-desc')}
                className="px-2.5 py-1 text-xs rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 font-bold transition-all cursor-pointer"
              >
                أبجدي (Z → A)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('products-first')}
                className="px-2.5 py-1 text-xs rounded bg-[#1c1912] hover:bg-[#d4c59d] text-[#d4c59d] hover:text-[#000000] border border-[#d4c59d]/40 font-bold transition-all cursor-pointer"
              >
                المنتجات والأقسام أولاً
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-2">
            {itemsOrder.map((id, index) => {
              const def = getItemDef(id);
              const IconComp = MENU_ICONS[id] || Sparkles;
              const isHidden = hiddenItems.includes(id);

              return (
                <div
                  key={id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isHidden
                      ? 'bg-black/30 border-white/5 opacity-60'
                      : 'bg-[#181610] border-[#d4c59d]/40 hover:border-[#d4c59d]'
                  }`}
                >
                  {/* Left: Position & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#000000] border border-[#d4c59d]/40 text-[#d4c59d] text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-[#242017] border border-[#d4c59d]/30 flex items-center justify-center text-[#d4c59d] flex-shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-[#f5f0e6] flex items-center gap-2 truncate">
                        <span>{def.labelEn}</span>
                        {id === 'products' && (
                          <span className="text-[10px] bg-[#d4c59d]/20 text-[#d4c59d] px-1.5 py-0.2 rounded border border-[#d4c59d]/30 font-mono">
                            Mega Dropdown
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#d4c59d] font-arabic truncate">
                        {def.labelAr}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className={`p-2 rounded-lg border transition-colors ${
                        index === 0
                          ? 'border-white/5 text-[#555] cursor-not-allowed bg-black/20'
                          : 'border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] bg-[#1c1912] cursor-pointer'
                      }`}
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === itemsOrder.length - 1}
                      className={`p-2 rounded-lg border transition-colors ${
                        index === itemsOrder.length - 1
                          ? 'border-white/5 text-[#555] cursor-not-allowed bg-black/20'
                          : 'border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] bg-[#1c1912] cursor-pointer'
                      }`}
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleVisibility(id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isHidden
                          ? 'border-rose-500/40 text-rose-400 bg-rose-950/40 hover:bg-rose-900/50'
                          : 'border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] bg-[#1c1912]'
                      }`}
                      title={isHidden ? 'إظهار في القائمة' : 'إخفاء من القائمة'}
                    >
                      {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preview of Header Navigation */}
          <div className="p-3.5 rounded-xl bg-[#000000] border border-[#d4c59d]/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#d4c59d] font-bold">
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>معاينة شريط التنقل (Live Navbar Preview):</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {itemsOrder
                .filter((id) => !hiddenItems.includes(id))
                .map((id) => {
                  const def = getItemDef(id);
                  return (
                    <span
                      key={id}
                      className="px-2.5 py-1 text-xs rounded bg-[#1c1912] border border-[#d4c59d]/40 text-[#d4c59d] font-bold whitespace-nowrap uppercase tracking-wider text-[11px]"
                    >
                      {def.labelEn}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-[#d4c59d]/30 bg-black/60 flex items-center justify-between flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-white/20 text-[#9e9174] hover:text-[#f5f0e6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-lg text-[#9e9174] hover:text-[#f5f0e6] transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ وتطبيق الترتيب'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
