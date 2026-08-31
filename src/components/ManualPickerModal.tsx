import React, { useState } from 'react';
import { X, Search, Check, Sparkles } from 'lucide-react';
import { BaseItem, WeaponItem, ThemeItem, SlotType } from '../types';

interface ManualPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: SlotType;
  items: (BaseItem | WeaponItem | ThemeItem)[];
  selectedId: string;
  onSelect: (item: BaseItem | WeaponItem | ThemeItem) => void;
}

export const ManualPickerModal: React.FC<ManualPickerModalProps> = ({
  isOpen,
  onClose,
  type,
  items,
  selectedId,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const titleMap = {
    base: '选择怪物【基底 / 躯体原型】',
    weapon: '选择怪物【武器化 / 装备搭载】',
    theme: '选择怪物【视觉主题 / 材质光影】',
  };

  // Get distinct categories
  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      id="manual-picker-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="manual-picker-dialog"
        className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base md:text-lg text-neutral-100">{titleMap[type]}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-neutral-800/80 space-y-3 bg-neutral-900">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索名称、特征标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat === 'ALL' ? '全部品类' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              没有找到匹配的项目，请尝试其他关键词
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500/40'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-neutral-100">{item.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                        {item.category}
                      </span>
                    </div>

                    {/* Specific detail preview */}
                    {type === 'base' && (
                      <p className="text-xs text-neutral-400">
                        {(item as BaseItem).silhouetteDesc} · 弱点: {(item as BaseItem).weakPoint}
                      </p>
                    )}
                    {type === 'weapon' && (
                      <p className="text-xs text-neutral-400">
                        {(item as WeaponItem).mountingPosition} · {(item as WeaponItem).attackPattern}
                      </p>
                    )}
                    {type === 'theme' && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {(item as ThemeItem).palette.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-400">{(item as ThemeItem).lighting}</span>
                      </div>
                    )}

                    <div className="flex gap-1.5 pt-1">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-neutral-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-600 hover:border-neutral-500" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
