import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
  Calendar,
  Database,
  Smartphone,
  Monitor,
  PenTool,
  Bookmark,
  Zap,
  Target,
  Crosshair,
  Palette,
  CheckCircle2,
  Flame,
  HelpCircle,
} from 'lucide-react';

import { BaseItem, WeaponItem, ThemeItem, MonsterConcept, SlotType } from './types';
import { DEFAULT_BASES, DEFAULT_WEAPONS, DEFAULT_THEMES } from './data/defaultPools';
import { soundFx } from './utils/audio';
import { generateCodeName, getTodayDateString } from './utils/monsterHelper';

import { SlotCard } from './components/SlotCard';
import { ManualPickerModal } from './components/ManualPickerModal';
import { ConceptBreakdown } from './components/ConceptBreakdown';
import { SketchCanvas } from './components/SketchCanvas';
import { DailyRecordsModal } from './components/DailyRecordsModal';
import { PoolManagerModal } from './components/PoolManagerModal';
import { InstallGuideModal } from './components/InstallGuideModal';

const STORAGE_KEYS = {
  BASES: 'fps_monster_bases_v2',
  WEAPONS: 'fps_monster_weapons_v2',
  THEMES: 'fps_monster_themes_v2',
  HISTORY: 'fps_monster_history_v1',
  AUDIO_MUTED: 'fps_monster_audio_muted_v1',
};

function loadInitialPool<T extends { id: string }>(key: string, oldKey: string, defaults: T[]): T[] {
  try {
    // Check new version first, then fallback to old version if exists
    const saved = localStorage.getItem(key) || localStorage.getItem(oldKey);
    if (!saved) return defaults;
    const parsed: T[] = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaults;

    // Merge: retain all new rich default entries, and append any custom items created by the user
    const defaultIds = new Set(defaults.map((d) => d.id));
    const customOrNonDefault = parsed.filter((item) => !defaultIds.has(item.id));
    return [...defaults, ...customOrNonDefault];
  } catch {
    return defaults;
  }
}

export default function App() {
  // Database pools
  const [bases, setBases] = useState<BaseItem[]>(() => {
    return loadInitialPool(STORAGE_KEYS.BASES, 'fps_monster_bases_v1', DEFAULT_BASES);
  });

  const [weapons, setWeapons] = useState<WeaponItem[]>(() => {
    return loadInitialPool(STORAGE_KEYS.WEAPONS, 'fps_monster_weapons_v1', DEFAULT_WEAPONS);
  });

  const [themes, setThemes] = useState<ThemeItem[]>(() => {
    return loadInitialPool(STORAGE_KEYS.THEMES, 'fps_monster_themes_v1', DEFAULT_THEMES);
  });

  // History & saved monsters
  const [history, setHistory] = useState<MonsterConcept[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current active selections
  const [currentBase, setCurrentBase] = useState<BaseItem>(bases[0] || DEFAULT_BASES[0]);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponItem>(weapons[0] || DEFAULT_WEAPONS[0]);
  const [currentTheme, setCurrentTheme] = useState<ThemeItem>(themes[0] || DEFAULT_THEMES[0]);

  // Locks for the 3 slots
  const [lockBase, setLockBase] = useState<boolean>(false);
  const [lockWeapon, setLockWeapon] = useState<boolean>(false);
  const [lockTheme, setLockTheme] = useState<boolean>(false);

  // Animation & Rolling state
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  // Active Concept State
  const [currentConcept, setCurrentConcept] = useState<MonsterConcept>(() => ({
    id: `concept-init-${Date.now()}`,
    codeName: generateCodeName(bases[0] || DEFAULT_BASES[0], weapons[0] || DEFAULT_WEAPONS[0]),
    createdAt: new Date().toISOString(),
    dateStr: getTodayDateString(),
    base: bases[0] || DEFAULT_BASES[0],
    weapon: weapons[0] || DEFAULT_WEAPONS[0],
    theme: themes[0] || DEFAULT_THEMES[0],
    isCompleted: false,
    isFavorite: false,
  }));

  // Modals state
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [pickerType, setPickerType] = useState<SlotType>('base');
  const [isSketchpadOpen, setIsSketchpadOpen] = useState<boolean>(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState<boolean>(false);
  const [isPoolManagerOpen, setIsPoolManagerOpen] = useState<boolean>(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BASES, JSON.stringify(bases));
    } catch {}
  }, [bases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEAPONS, JSON.stringify(weapons));
    } catch {}
  }, [weapons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(themes));
    } catch {}
  }, [themes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  // Master Random Generation Function
  const rollMonster = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);

    let nextBase = currentBase;
    let nextWeapon = currentWeapon;
    let nextTheme = currentTheme;

    // Fast cycling animation ticks
    let ticks = 0;
    const maxTicks = 10;
    const interval = setInterval(() => {
      ticks++;
      soundFx.playTick(1 + ticks * 0.05);

      if (!lockBase && bases.length > 0) {
        const randBase = bases[Math.floor(Math.random() * bases.length)];
        setCurrentBase(randBase);
        nextBase = randBase;
      }
      if (!lockWeapon && weapons.length > 0) {
        const randWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        setCurrentWeapon(randWeapon);
        nextWeapon = randWeapon;
      }
      if (!lockTheme && themes.length > 0) {
        const randTheme = themes[Math.floor(Math.random() * themes.length)];
        setCurrentTheme(randTheme);
        nextTheme = randTheme;
      }

      if (ticks >= maxTicks) {
        clearInterval(interval);
        setIsRolling(false);
        soundFx.playComplete();

        // Build new MonsterConcept
        const newConcept: MonsterConcept = {
          id: `concept-${Date.now()}`,
          codeName: generateCodeName(nextBase, nextWeapon),
          createdAt: new Date().toISOString(),
          dateStr: getTodayDateString(),
          base: nextBase,
          weapon: nextWeapon,
          theme: nextTheme,
          isCompleted: false,
          isFavorite: false,
        };

        setCurrentConcept(newConcept);
        setHistory((prev) => [newConcept, ...prev.slice(0, 49)]); // Keep last 50
      }
    }, 60);
  }, [bases, weapons, themes, lockBase, lockWeapon, lockTheme, currentBase, currentWeapon, currentTheme, isRolling]);

  // Single Slot Roll functions
  const rollSingleSlot = (type: SlotType) => {
    if (isRolling) return;
    soundFx.playTick(1.2);

    if (type === 'base' && !lockBase && bases.length > 0) {
      const candidates = bases.filter((b) => b.id !== currentBase.id);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : bases[0];
      setCurrentBase(chosen);
      updateCurrentConcept({ base: chosen });
    } else if (type === 'weapon' && !lockWeapon && weapons.length > 0) {
      const candidates = weapons.filter((w) => w.id !== currentWeapon.id);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : weapons[0];
      setCurrentWeapon(chosen);
      updateCurrentConcept({ weapon: chosen });
    } else if (type === 'theme' && !lockTheme && themes.length > 0) {
      const candidates = themes.filter((t) => t.id !== currentTheme.id);
      const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : themes[0];
      setCurrentTheme(chosen);
      updateCurrentConcept({ theme: chosen });
    }
  };

  const updateCurrentConcept = (partial: Partial<MonsterConcept>) => {
    setCurrentConcept((prev) => {
      const updated = { ...prev, ...partial };
      // Update history record as well
      setHistory((hList) => hList.map((h) => (h.id === prev.id ? updated : h)));
      return updated;
    });
  };

  // Keyboard shortcut: Spacebar or 'R' to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isPickerOpen ||
        isSketchpadOpen ||
        isRecordsOpen ||
        isPoolManagerOpen
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        rollMonster();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollMonster, isPickerOpen, isSketchpadOpen, isRecordsOpen, isPoolManagerOpen]);

  // Audio Toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  // Lock toggles
  const handleToggleLock = (type: SlotType) => {
    if (type === 'base') {
      soundFx.playLock(!lockBase);
      setLockBase(!lockBase);
    } else if (type === 'weapon') {
      soundFx.playLock(!lockWeapon);
      setLockWeapon(!lockWeapon);
    } else if (type === 'theme') {
      soundFx.playLock(!lockTheme);
      setLockTheme(!lockTheme);
    }
  };

  // Manual picker handler
  const handleOpenPicker = (type: SlotType) => {
    setPickerType(type);
    setIsPickerOpen(true);
  };

  const handleSelectItemFromPicker = (item: BaseItem | WeaponItem | ThemeItem) => {
    if (pickerType === 'base') {
      const b = item as BaseItem;
      setCurrentBase(b);
      updateCurrentConcept({ base: b });
    } else if (pickerType === 'weapon') {
      const w = item as WeaponItem;
      setCurrentWeapon(w);
      updateCurrentConcept({ weapon: w });
    } else if (pickerType === 'theme') {
      const t = item as ThemeItem;
      setCurrentTheme(t);
      updateCurrentConcept({ theme: t });
    }
  };

  // Toggle favorite & completed
  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentConcept.id === id) {
      setCurrentConcept((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleToggleCompleted = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.isCompleted;
          if (nextVal) {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.7 },
            });
          }
          return { ...item, isCompleted: nextVal };
        }
        return item;
      })
    );

    if (currentConcept.id === id) {
      const nextCompleted = !currentConcept.isCompleted;
      if (nextCompleted) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
      setCurrentConcept((prev) => ({ ...prev, isCompleted: nextCompleted }));
    }
  };

  // Save sketch from Canvas
  const handleSaveSketch = (dataUrl: string) => {
    const updated = {
      ...currentConcept,
      sketchDataUrl: dataUrl,
      isCompleted: true,
    };
    setCurrentConcept(updated);
    setHistory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  // Handle image upload from external Procreate/Photoshop file
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleSaveSketch(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset default database pools
  const handleResetDefaults = () => {
    setBases(DEFAULT_BASES);
    setWeapons(DEFAULT_WEAPONS);
    setThemes(DEFAULT_THEMES);
    setCurrentBase(DEFAULT_BASES[0]);
    setCurrentWeapon(DEFAULT_WEAPONS[0]);
    setCurrentTheme(DEFAULT_THEMES[0]);
  };

  // Completed count for header badge
  const completedTodayCount = history.filter(
    (h) => h.isCompleted && h.dateStr === getTodayDateString()
  ).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 bg-grid-pattern selection:bg-amber-500 selection:text-black">
      {/* Container wrapper (Supports full desktop or mobile phone simulator frame) */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isMobileMode
            ? 'max-w-md my-4 sm:my-8 bg-neutral-950 border-4 border-neutral-800 rounded-[36px] shadow-2xl overflow-hidden min-h-[844px] ring-1 ring-neutral-700/60'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
        }`}
      >
        {/* Mobile Phone Simulated Status Bar in Mobile Mode */}
        {isMobileMode && (
          <div className="bg-neutral-950 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-neutral-400 font-mono-code border-b border-neutral-900">
            <span className="font-bold text-neutral-300">09:41</span>
            <div className="w-16 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Navigation Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/90 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-tactical text-xl md:text-2xl font-bold tracking-wider uppercase text-neutral-100">
                  FPS怪物概念生成器
                </h1>
                <span className="text-[10px] font-mono-code bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.2 rounded font-bold">
                  PRO v1.2
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <span>手游枪击游戏怪兽概念三合一抽取</span>
                <span className="text-neutral-600">·</span>
                <span className="text-amber-400/90 font-medium">每日速写灵感生成</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Daily Streak / Done Badge */}
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-xs">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-neutral-400 font-mono-code text-[11px]">今日打卡:</span>
              <span className="font-bold text-amber-400 font-mono-code">{completedTodayCount} 幅</span>
            </div>

            {/* History Records Button */}
            <button
              id="btn-open-records"
              type="button"
              onClick={() => setIsRecordsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-all"
              title="查看历史记录与每日打卡日历"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">打卡记录</span>
            </button>

            {/* Dictionary / Pool Manager Button */}
            <button
              id="btn-open-pool-manager"
              type="button"
              onClick={() => setIsPoolManagerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-all"
              title="管理自定义词库"
            >
              <Database className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">词库管理</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-neutral-900 border-neutral-800 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-600'
              }`}
              title={soundEnabled ? '音效开启' : '音效静音'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Phone Installation / Download Guide Button */}
            <button
              id="btn-open-install-guide"
              type="button"
              onClick={() => setIsInstallGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all shadow-sm shadow-amber-500/5"
              title="查看安卓手机安装/打包指南与链接"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>手机安装</span>
            </button>

            {/* Mobile / Desktop Simulator Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMode(!isMobileMode)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                isMobileMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title={isMobileMode ? '切换为宽屏桌面视图' : '切换为安卓手机预览模式'}
            >
              {isMobileMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Quick Instructions & Shortcut Hint */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              💡 核心设计规则：点击下方大按钮随机组合
              <strong className="text-cyan-300 font-semibold">【基底】</strong>、
              <strong className="text-amber-300 font-semibold">【武器化】</strong>、
              <strong className="text-purple-300 font-semibold">【视觉主题】</strong>
              三个维度，支持分别锁定与手动精选！
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono-code text-[11px] text-neutral-400 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800">
            <span>快捷键:</span>
            <kbd className="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-neutral-700">
              SPACE
            </kbd>
            <span>或</span>
            <kbd className="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-neutral-700">
              R
            </kbd>
          </div>
        </div>

        {/* 3-Slot Grid Section */}
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slot 1: Base */}
            <SlotCard
              type="base"
              title="1. 躯体基底 (Base)"
              item={currentBase}
              isLocked={lockBase}
              isRolling={isRolling}
              onToggleLock={() => handleToggleLock('base')}
              onRollSingle={() => rollSingleSlot('base')}
              onOpenPicker={() => handleOpenPicker('base')}
              icon={<Zap className="w-4 h-4" />}
              accentColor="blue"
            />

            {/* Slot 2: Weaponization */}
            <SlotCard
              type="weapon"
              title="2. 武器化搭载 (Weapon)"
              item={currentWeapon}
              isLocked={lockWeapon}
              isRolling={isRolling}
              onToggleLock={() => handleToggleLock('weapon')}
              onRollSingle={() => rollSingleSlot('weapon')}
              onOpenPicker={() => handleOpenPicker('weapon')}
              icon={<Crosshair className="w-4 h-4" />}
              accentColor="amber"
            />

            {/* Slot 3: Visual Theme */}
            <SlotCard
              type="theme"
              title="3. 视觉主题 (Theme)"
              item={currentTheme}
              isLocked={lockTheme}
              isRolling={isRolling}
              onToggleLock={() => handleToggleLock('theme')}
              onRollSingle={() => rollSingleSlot('theme')}
              onOpenPicker={() => handleOpenPicker('theme')}
              icon={<Palette className="w-4 h-4" />}
              accentColor="purple"
            />
          </div>

          {/* Master Generator Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 py-2">
            <button
              id="btn-master-roll"
              type="button"
              onClick={rollMonster}
              disabled={isRolling}
              className={`w-full sm:w-auto min-w-[280px] sm:min-w-[360px] py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-black font-tactical font-extrabold text-lg sm:text-xl tracking-wider uppercase shadow-xl shadow-amber-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer ${
                isRolling ? 'opacity-80 cursor-wait animate-pulse' : 'hover:scale-[1.02]'
              }`}
            >
              <Shuffle className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? '正在合成怪物概念...' : '⚡ 抽取今日怪兽灵感组合'}</span>
            </button>

            {/* Lock Status Helper */}
            {(lockBase || lockWeapon || lockTheme) && (
              <button
                type="button"
                onClick={() => {
                  setLockBase(false);
                  setLockWeapon(false);
                  setLockTheme(false);
                  soundFx.playLock(false);
                }}
                className="text-xs text-neutral-400 hover:text-amber-400 underline transition-colors"
              >
                一键解除全部锁定
              </button>
            )}
          </div>

          {/* Concept Breakdown & Artist Prompts */}
          <ConceptBreakdown
            concept={currentConcept}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompleted={handleToggleCompleted}
            onOpenSketchpad={() => setIsSketchpadOpen(true)}
            onUploadImage={handleUploadImage}
          />
        </main>

        {/* Footer info for artist */}
        <footer className="mt-10 pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-500 space-y-1.5 pb-6">
          <p>FPS怪兽概念草图生成器 · 专为手游概念艺术家与每日速写打卡定制</p>
          <p className="text-[11px] text-neutral-600">
            支持离线使用与本地自动保存 · 数据保存在浏览器缓存中
          </p>
        </footer>
      </div>

      {/* Modals */}
      <ManualPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        type={pickerType}
        items={pickerType === 'base' ? bases : pickerType === 'weapon' ? weapons : themes}
        selectedId={
          pickerType === 'base'
            ? currentBase.id
            : pickerType === 'weapon'
            ? currentWeapon.id
            : currentTheme.id
        }
        onSelect={handleSelectItemFromPicker}
      />

      <SketchCanvas
        isOpen={isSketchpadOpen}
        onClose={() => setIsSketchpadOpen(false)}
        concept={currentConcept}
        onSaveSketch={handleSaveSketch}
      />

      <DailyRecordsModal
        isOpen={isRecordsOpen}
        onClose={() => setIsRecordsOpen(false)}
        history={history}
        onSelectConcept={(item) => {
          setCurrentConcept(item);
          setCurrentBase(item.base);
          setCurrentWeapon(item.weapon);
          setCurrentTheme(item.theme);
        }}
        onDeleteConcept={(id) => {
          setHistory((prev) => prev.filter((item) => item.id !== id));
        }}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompleted={handleToggleCompleted}
      />

      <PoolManagerModal
        isOpen={isPoolManagerOpen}
        onClose={() => setIsPoolManagerOpen(false)}
        bases={bases}
        weapons={weapons}
        themes={themes}
        onUpdateBases={setBases}
        onUpdateWeapons={setWeapons}
        onUpdateThemes={setThemes}
        onResetDefaults={handleResetDefaults}
      />

      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />
    </div>
  );
}
