import React from 'react';
import { Lock, Unlock, Shuffle, ListFilter } from 'lucide-react';
import { BaseItem, WeaponItem, ThemeItem, SlotType } from '../types';

interface SlotCardProps {
  type: SlotType;
  title: string;
  item: BaseItem | WeaponItem | ThemeItem | null;
  isLocked: boolean;
  isRolling: boolean;
  onToggleLock: () => void;
  onRollSingle: () => void;
  onOpenPicker: () => void;
  icon: React.ReactNode;
  accentColor: 'blue' | 'amber' | 'purple';
}

export const SlotCard: React.FC<SlotCardProps> = ({
  type,
  title,
  item,
  isLocked,
  isRolling,
  onToggleLock,
  onRollSingle,
  onOpenPicker,
  icon,
  accentColor,
}) => {
  const colorMap = {
    blue: {
      border: isLocked ? 'border-cyan-500/80 ring-2 ring-cyan-500/30' : 'border-neutral-800 hover:border-cyan-500/50',
      badge: 'bg-cyan-950/80 text-cyan-400 border border-cyan-700/50',
      glow: 'from-cyan-950/20 to-transparent',
      text: 'text-cyan-400',
      btn: 'hover:bg-cyan-500/20 text-cyan-400',
      lockActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    amber: {
      border: isLocked ? 'border-amber-500/80 ring-2 ring-amber-500/30' : 'border-neutral-800 hover:border-amber-500/50',
      badge: 'bg-amber-950/80 text-amber-400 border border-amber-700/50',
      glow: 'from-amber-950/20 to-transparent',
      text: 'text-amber-400',
      btn: 'hover:bg-amber-500/20 text-amber-400',
      lockActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    purple: {
      border: isLocked ? 'border-purple-500/80 ring-2 ring-purple-500/30' : 'border-neutral-800 hover:border-purple-500/50',
      badge: 'bg-purple-950/80 text-purple-400 border border-purple-700/50',
      glow: 'from-purple-950/20 to-transparent',
      text: 'text-purple-400',
      btn: 'hover:bg-purple-500/20 text-purple-400',
      lockActive: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
  };

  const currentTheme = colorMap[accentColor];

  // Specific content renders depending on slot type
  const renderDetail = () => {
    if (!item) return <div className="text-neutral-500 text-sm">点击生成抽取</div>;

    if (type === 'base') {
      const base = item as BaseItem;
      return (
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">FPS战术定位</span>
            <span className="font-semibold text-neutral-200 bg-neutral-800 px-2 py-0.5 rounded">
              {base.role}
            </span>
          </div>
          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
            <span className="text-neutral-400 font-medium">剪影：</span>
            {base.silhouetteDesc}
          </p>
          <div className="text-xs text-rose-400/90 flex items-start gap-1">
            <span className="shrink-0 text-rose-500 font-semibold">弱点:</span>
            <span className="line-clamp-1">{base.weakPoint}</span>
          </div>
        </div>
      );
    }

    if (type === 'weapon') {
      const weapon = item as WeaponItem;
      return (
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">搭载部位</span>
            <span className="font-semibold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
              {weapon.mountingPosition}
            </span>
          </div>
          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
            <span className="text-neutral-400 font-medium">弹道：</span>
            {weapon.attackPattern}
          </p>
          <div className="text-xs text-amber-400/90 flex items-start gap-1">
            <span className="shrink-0 text-amber-500 font-semibold">光效:</span>
            <span className="line-clamp-1">{weapon.visualVfx}</span>
          </div>
        </div>
      );
    }

    if (type === 'theme') {
      const theme = item as ThemeItem;
      return (
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-1.5 py-1">
            <span className="text-xs text-neutral-400 mr-1">色板:</span>
            {theme.palette.map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0 inline-block"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
            <span className="text-neutral-400 font-medium">光影：</span>
            {theme.lighting}
          </p>
          <div className="text-xs text-purple-400/90 flex items-start gap-1">
            <span className="shrink-0 text-purple-400 font-semibold">材质:</span>
            <span className="line-clamp-1">{theme.materials}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id={`slot-card-${type}`}
      className={`relative flex flex-col justify-between rounded-xl bg-neutral-900/90 border ${currentTheme.border} p-4.5 transition-all duration-200 overflow-hidden shadow-lg backdrop-blur-sm group`}
    >
      {/* Background radial highlight */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${currentTheme.glow} rounded-bl-full pointer-events-none opacity-60`} />

      {/* Header with Title & Action Controls */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-neutral-800/80 ${currentTheme.text}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-tactical font-bold text-sm tracking-wider uppercase text-neutral-100">
                {title}
              </span>
              {isLocked && (
                <span className="text-[10px] font-mono-code font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded uppercase">
                  LOCKED
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 block font-mono-code">
              SLOT-{type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Lock, Single Roll, Manual Pick Buttons */}
        <div className="flex items-center gap-1">
          <button
            id={`btn-manual-pick-${type}`}
            type="button"
            onClick={onOpenPicker}
            title="在词库中手动选择"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ListFilter className="w-4 h-4" />
          </button>
          
          <button
            id={`btn-single-roll-${type}`}
            type="button"
            onClick={onRollSingle}
            disabled={isLocked || isRolling}
            title={isLocked ? "已锁定无法单项重抽" : "单项重新随机"}
            className={`p-1.5 rounded-lg transition-colors ${
              isLocked ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'
            }`}
          >
            <Shuffle className={`w-4 h-4 ${isRolling && !isLocked ? 'animate-spin' : ''}`} />
          </button>

          <button
            id={`btn-lock-${type}`}
            type="button"
            onClick={onToggleLock}
            title={isLocked ? "点击解锁（随大按钮刷新）" : "点击锁定（固定此项）"}
            className={`p-1.5 rounded-lg border transition-all ${
              isLocked
                ? currentTheme.lockActive
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-800/40 border-neutral-700/60'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Item Display Body with Rolling Animation Effect */}
      <div className="py-3 flex-1 min-h-[140px] flex flex-col justify-center">
        {isRolling && !isLocked ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 animate-pulse">
            <div className="h-6 w-3/4 bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-neutral-800/60 rounded animate-pulse" />
            <div className="text-xs font-mono-code text-neutral-500 mt-2">ROLLING SLOTS...</div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-base md:text-lg text-neutral-100 leading-snug tracking-tight">
                {item ? item.name : '未选择'}
              </h3>
              {item && (
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${currentTheme.badge}`}>
                  {item.category}
                </span>
              )}
            </div>

            {renderDetail()}
          </div>
        )}
      </div>

      {/* Card Footer with Tags */}
      <div className="pt-2.5 border-t border-neutral-800/60 flex flex-wrap gap-1 items-center justify-between min-h-[28px]">
        <div className="flex flex-wrap gap-1">
          {item &&
            item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono-code text-neutral-400 bg-neutral-800/60 px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
        </div>
        <button
          type="button"
          onClick={onToggleLock}
          className="text-[11px] font-tactical text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          {isLocked ? '已锁定' : '可刷新'}
        </button>
      </div>
    </div>
  );
};
