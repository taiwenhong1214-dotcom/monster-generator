import React, { useState } from 'react';
import { X, Database, Plus, Trash2, RotateCcw, Download, Upload, Search, Check, AlertCircle } from 'lucide-react';
import { BaseItem, WeaponItem, ThemeItem, SlotType } from '../types';
import { DEFAULT_BASES, DEFAULT_WEAPONS, DEFAULT_THEMES } from '../data/defaultPools';

interface PoolManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bases: BaseItem[];
  weapons: WeaponItem[];
  themes: ThemeItem[];
  onUpdateBases: (bases: BaseItem[]) => void;
  onUpdateWeapons: (weapons: WeaponItem[]) => void;
  onUpdateThemes: (themes: ThemeItem[]) => void;
  onResetDefaults: () => void;
}

export const PoolManagerModal: React.FC<PoolManagerModalProps> = ({
  isOpen,
  onClose,
  bases,
  weapons,
  themes,
  onUpdateBases,
  onUpdateWeapons,
  onUpdateThemes,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<SlotType>('base');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New item form state
  const [newBaseName, setNewBaseName] = useState('');
  const [newBaseCategory, setNewBaseCategory] = useState<BaseItem['category']>('生物变异');
  const [newBaseRole, setNewBaseRole] = useState<BaseItem['role']>('突击先锋');
  const [newBaseSilhouette, setNewBaseSilhouette] = useState('');
  const [newBaseWeakPoint, setNewBaseWeakPoint] = useState('');
  const [newBaseTags, setNewBaseTags] = useState('');

  const [newWeaponName, setNewWeaponName] = useState('');
  const [newWeaponCategory, setNewWeaponCategory] = useState<WeaponItem['category']>('实弹枪械');
  const [newWeaponMount, setNewWeaponMount] = useState<WeaponItem['mountingPosition']>('肩部双挂架');
  const [newWeaponPattern, setNewWeaponPattern] = useState('');
  const [newWeaponVfx, setNewWeaponVfx] = useState('');
  const [newWeaponTags, setNewWeaponTags] = useState('');

  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeCategory, setNewThemeCategory] = useState<ThemeItem['category']>('废土辐射');
  const [newThemeLighting, setNewThemeLighting] = useState('');
  const [newThemeMaterials, setNewThemeMaterials] = useState('');
  const [newThemePalette, setNewThemePalette] = useState('#1C1917, #78350F, #D97706, #84CC16, #FEF3C7');
  const [newThemeTags, setNewThemeTags] = useState('');

  if (!isOpen) return null;

  const handleAddBase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBaseName.trim()) return;
    const newItem: BaseItem = {
      id: `custom-base-${Date.now()}`,
      name: newBaseName.trim(),
      category: newBaseCategory,
      role: newBaseRole,
      silhouetteDesc: newBaseSilhouette.trim() || '独特变异体态特征',
      weakPoint: newBaseWeakPoint.trim() || '发光弱点核心',
      tags: newBaseTags.split(/[,，\s]+/).filter(Boolean),
    };
    onUpdateBases([newItem, ...bases]);
    setNewBaseName('');
    setNewBaseSilhouette('');
    setNewBaseWeakPoint('');
    setNewBaseTags('');
    setIsAdding(false);
  };

  const handleAddWeapon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeaponName.trim()) return;
    const newItem: WeaponItem = {
      id: `custom-weapon-${Date.now()}`,
      name: newWeaponName.trim(),
      category: newWeaponCategory,
      mountingPosition: newWeaponMount,
      attackPattern: newWeaponPattern.trim() || '连续高频弹道打击',
      visualVfx: newWeaponVfx.trim() || '亮色粒子光斑',
      tags: newWeaponTags.split(/[,，\s]+/).filter(Boolean),
    };
    onUpdateWeapons([newItem, ...weapons]);
    setNewWeaponName('');
    setNewWeaponPattern('');
    setNewWeaponVfx('');
    setNewWeaponTags('');
    setIsAdding(false);
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;
    const palette = newThemePalette
      .split(/[,，\s]+/)
      .map((c) => c.trim())
      .filter((c) => c.startsWith('#'));
    const newItem: ThemeItem = {
      id: `custom-theme-${Date.now()}`,
      name: newThemeName.trim(),
      category: newThemeCategory,
      lighting: newThemeLighting.trim() || '独特氛围光影渲染',
      materials: newThemeMaterials.trim() || '表面战损与材质对比',
      palette: palette.length >= 3 ? palette : ['#1a1a1a', '#06b6d4', '#ec4899', '#ffffff'],
      tags: newThemeTags.split(/[,，\s]+/).filter(Boolean),
    };
    onUpdateThemes([newItem, ...themes]);
    setNewThemeName('');
    setNewThemeLighting('');
    setNewThemeMaterials('');
    setNewThemeTags('');
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    if (activeTab === 'base') {
      onUpdateBases(bases.filter((b) => b.id !== id));
    } else if (activeTab === 'weapon') {
      onUpdateWeapons(weapons.filter((w) => w.id !== id));
    } else {
      onUpdateThemes(themes.filter((t) => t.id !== id));
    }
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ bases, weapons, themes }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fps-monster-dictionary-${Date.now()}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.bases && parsed.weapons && parsed.themes) {
            onUpdateBases(parsed.bases);
            onUpdateWeapons(parsed.weapons);
            onUpdateThemes(parsed.themes);
            alert('词库导入成功！');
          }
        } catch {
          alert('导入失败：JSON格式不正确');
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div
      id="pool-manager-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="pool-manager-dialog"
        className="relative w-full max-w-4xl max-h-[88vh] bg-neutral-900 border border-neutral-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-neutral-100">
                自定义词库与素材库管理
              </h3>
              <p className="text-xs text-neutral-400">
                增删基底、武器化与视觉主题词条，打造专属于你的FPS怪兽灵感池
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              title="导出词库JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              htmlFor="import-pool-json"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="导入词库JSON"
            >
              <Upload className="w-4 h-4" />
              <input
                id="import-pool-json"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (confirm('确认恢复默认官方词库吗？')) {
                  onResetDefaults();
                }
              }}
              className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
              title="重置为默认官方词库"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('base');
                setIsAdding(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'base' ? 'bg-cyan-600 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              👾 躯体基底 ({bases.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('weapon');
                setIsAdding(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'weapon' ? 'bg-amber-600 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              ⚔️ 武器化搭载 ({weapons.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('theme');
                setIsAdding(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'theme' ? 'bg-purple-600 text-white font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              🎨 视觉主题 ({themes.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索词条..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? '收起添加' : '新增词条'}</span>
            </button>
          </div>
        </div>

        {/* Add Form Accordion */}
        {isAdding && (
          <div className="p-4 border-b border-neutral-800 bg-neutral-950/90 animate-fadeIn">
            {activeTab === 'base' && (
              <form onSubmit={handleAddBase} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">基底名称 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：深渊六足装甲巨蝎"
                      value={newBaseName}
                      onChange={(e) => setNewBaseName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">生物品类</label>
                    <select
                      value={newBaseCategory}
                      onChange={(e) => setNewBaseCategory(e.target.value as BaseItem['category'])}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    >
                      <option value="生物变异">生物变异</option>
                      <option value="机械仿生">机械仿生</option>
                      <option value="昆虫几丁质">昆虫几丁质</option>
                      <option value="深海异形">深海异形</option>
                      <option value="重型异构">重型异构</option>
                      <option value="灵能异界">灵能异界</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">FPS战术定位</label>
                    <select
                      value={newBaseRole}
                      onChange={(e) => setNewBaseRole(e.target.value as BaseItem['role'])}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    >
                      <option value="突击先锋">突击先锋</option>
                      <option value="重装肉盾">重装肉盾</option>
                      <option value="远程压制">远程压制</option>
                      <option value="敏捷刺客">敏捷刺客</option>
                      <option value="浮空骚扰">浮空骚扰</option>
                      <option value="自爆特攻">自爆特攻</option>
                      <option value="控制支援">控制支援</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">剪影与体态特征</label>
                    <input
                      type="text"
                      placeholder="例：低重心多足贴地爬行，背部带有弧形外骨骼"
                      value={newBaseSilhouette}
                      onChange={(e) => setNewBaseSilhouette(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">FPS弱点/爆头判定区</label>
                    <input
                      type="text"
                      placeholder="例：尾钩关节缝隙处发光毒囊"
                      value={newBaseWeakPoint}
                      onChange={(e) => setNewBaseWeakPoint(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="标签，以逗号隔开（例：高防御, 蝎形, 重型）"
                    value={newBaseTags}
                    onChange={(e) => setNewBaseTags(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors"
                  >
                    确认添加基底
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'weapon' && (
              <form onSubmit={handleAddWeapon} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">武器名称 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：重型电磁等离子轨道炮"
                      value={newWeaponName}
                      onChange={(e) => setNewWeaponName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">武器类型</label>
                    <select
                      value={newWeaponCategory}
                      onChange={(e) => setNewWeaponCategory(e.target.value as WeaponItem['category'])}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    >
                      <option value="实弹枪械">实弹枪械</option>
                      <option value="能量光束">能量光束</option>
                      <option value="重型火炮">重型火炮</option>
                      <option value="生化强酸">生化强酸</option>
                      <option value="近战动力">近战动力</option>
                      <option value="高科技战术">高科技战术</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">搭载部位</label>
                    <select
                      value={newWeaponMount}
                      onChange={(e) => setNewWeaponMount(e.target.value as WeaponItem['mountingPosition'])}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    >
                      <option value="肩部双挂架">肩部双挂架</option>
                      <option value="前臂一体化">前臂一体化</option>
                      <option value="背负式发射井">背负式发射井</option>
                      <option value="胸腔内置">胸腔内置</option>
                      <option value="尾部自律炮塔">尾部自律炮塔</option>
                      <option value="双持/下肢装载">双持/下肢装载</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">攻击与弹道模式</label>
                    <input
                      type="text"
                      placeholder="例：充能后发射穿透光束，沿途留下持续燃烧光斑"
                      value={newWeaponPattern}
                      onChange={(e) => setNewWeaponPattern(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">开火光效粒子</label>
                    <input
                      type="text"
                      placeholder="例：湛蓝电弧缠绕与过热白烟"
                      value={newWeaponVfx}
                      onChange={(e) => setNewWeaponVfx(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="标签（例：轨道炮, 穿透, 高伤）"
                    value={newWeaponTags}
                    onChange={(e) => setNewWeaponTags(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
                  >
                    确认添加武器
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'theme' && (
              <form onSubmit={handleAddTheme} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">主题名称 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：赛博废土霓虹"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">风格大类</label>
                    <select
                      value={newThemeCategory}
                      onChange={(e) => setNewThemeCategory(e.target.value as ThemeItem['category'])}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    >
                      <option value="废土辐射">废土辐射</option>
                      <option value="赛博霓虹">赛博霓虹</option>
                      <option value="极端生态">极端生态</option>
                      <option value="军工重装">军工重装</option>
                      <option value="异星灵能">异星灵能</option>
                      <option value="生化灾变">生化灾变</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-neutral-400 block mb-1">光影与渲染氛围</label>
                    <input
                      type="text"
                      placeholder="例：高对比暗部逆光，伴随细微漂浮粉尘"
                      value={newThemeLighting}
                      onChange={(e) => setNewThemeLighting(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">材质质感特征</label>
                    <input
                      type="text"
                      placeholder="例：外壳斑驳锈迹、黑色哑光涂层"
                      value={newThemeMaterials}
                      onChange={(e) => setNewThemeMaterials(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="5个Hex色号以逗号隔开（例：#1C1917, #78350F, #D97706, #84CC16, #FEF3C7）"
                    value={newThemePalette}
                    onChange={(e) => setNewThemePalette(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-neutral-100 font-mono-code"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-lg transition-colors"
                  >
                    确认添加主题
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Item List Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'base' &&
            bases
              .filter(
                (b) =>
                  b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  b.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{b.name}</span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {b.category}
                      </span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                        {b.role}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {b.silhouetteDesc} · 弱点: {b.weakPoint}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(b.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

          {activeTab === 'weapon' &&
            weapons
              .filter(
                (w) =>
                  w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  w.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((w) => (
                <div
                  key={w.id}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{w.name}</span>
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">
                        {w.category}
                      </span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                        {w.mountingPosition}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {w.attackPattern} · 光效: {w.visualVfx}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(w.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

          {activeTab === 'theme' &&
            themes
              .filter(
                (t) =>
                  t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  t.tags.some((tg) => tg.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-100">{t.name}</span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/40">
                        {t.category}
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        {t.palette.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {t.lighting} · 材质: {t.materials}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(t.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
