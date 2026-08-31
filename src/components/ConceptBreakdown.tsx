import React, { useState } from 'react';
import { Copy, Check, Palette, ShieldAlert, Crosshair, Sparkles, PenTool, Bookmark, BookmarkCheck, Share2, Upload } from 'lucide-react';
import { MonsterConcept } from '../types';
import { formatPromptForCopy } from '../utils/monsterHelper';

interface ConceptBreakdownProps {
  concept: MonsterConcept;
  onToggleFavorite: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onOpenSketchpad: () => void;
  onUploadImage: (file: File) => void;
}

export const ConceptBreakdown: React.FC<ConceptBreakdownProps> = ({
  concept,
  onToggleFavorite,
  onToggleCompleted,
  onOpenSketchpad,
  onUploadImage,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyPrompt = async () => {
    const text = formatPromptForCopy(concept);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1500);
    } catch {}
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div
      id="concept-breakdown-panel"
      className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6"
    >
      {/* Header with Title, CodeName, and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono-code font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
              {concept.codeName}
            </span>
            <span className="text-xs text-neutral-400 font-mono-code">
              {concept.dateStr}
            </span>
            {concept.isCompleted && (
              <span className="text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                ✓ 今日草图已完成
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 mt-1.5 flex items-center gap-2">
            {concept.base.name} <span className="text-neutral-500 font-normal">×</span> {concept.weapon.name}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-copy-prompt"
            type="button"
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-all shadow-sm active:scale-95"
            title="复制完整提示词到剪贴板"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedPrompt ? '已复制速写卡' : '复制Prompt'}</span>
          </button>

          <button
            id="btn-toggle-favorite"
            type="button"
            onClick={() => onToggleFavorite(concept.id)}
            className={`p-2 rounded-xl border transition-all ${
              concept.isFavorite
                ? 'bg-rose-950/40 border-rose-600/60 text-rose-400'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-400 hover:text-neutral-200'
            }`}
            title={concept.isFavorite ? '取消收藏' : '收藏此怪物组合'}
          >
            {concept.isFavorite ? <BookmarkCheck className="w-4 h-4 text-rose-400" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            id="btn-toggle-completed"
            type="button"
            onClick={() => onToggleCompleted(concept.id)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              concept.isCompleted
                ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:border-neutral-500'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${concept.isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`} />
            <span>{concept.isCompleted ? '已打卡' : '打卡记录'}</span>
          </button>
        </div>
      </div>

      {/* Palette Bar & Copyable Swatches */}
      <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <Palette className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="font-semibold text-neutral-200">推荐配色板：</span>
          <span className="text-neutral-400 text-[11px]">(点击色块复制Hex代码)</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {concept.theme.palette.map((hex, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleCopyColor(hex)}
              className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition-all text-xs font-mono-code text-neutral-300"
              title={`点击复制 ${hex}`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[11px]">{copiedColor === hex ? 'COPIED!' : hex}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Concept Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 战术定位与弱点 */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>FPS战术定位与弱点判定</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-neutral-200">战斗定位：</strong>
              <span className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded border border-rose-900/40 ml-1">
                {concept.base.role}
              </span>
              <span className="text-neutral-400 ml-2">（属于 {concept.base.category} 品类）</span>
            </p>
            <p>
              <strong className="text-neutral-200">剪影体态：</strong>
              {concept.base.silhouetteDesc}
            </p>
            <p className="text-rose-300/90 bg-rose-950/20 p-2 rounded border border-rose-900/30">
              <strong className="text-rose-400">弱点与爆头区：</strong>
              {concept.base.weakPoint}
            </p>
          </div>
        </div>

        {/* Card 2: 武器搭载与开火粒子 */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
            <Crosshair className="w-4 h-4" />
            <span>武器搭载与弹道特效</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-neutral-200">搭载位置：</strong>
              <span className="bg-amber-950/40 text-amber-300 px-2 py-0.5 rounded border border-amber-950 ml-1">
                {concept.weapon.mountingPosition}
              </span>
            </p>
            <p>
              <strong className="text-neutral-200">攻击与弹道：</strong>
              {concept.weapon.attackPattern}
            </p>
            <p className="text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-900/30">
              <strong className="text-amber-400">开火光效粒子：</strong>
              {concept.weapon.visualVfx}
            </p>
          </div>
        </div>

        {/* Card 3: 视觉主题与材质光影 */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>渲染光影与材质质感</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-neutral-200">主题环境：</strong>
              <span className="text-purple-300 font-medium">{concept.theme.name}</span>
            </p>
            <p>
              <strong className="text-neutral-200">光影氛围：</strong>
              {concept.theme.lighting}
            </p>
            <p>
              <strong className="text-neutral-200">表面材质：</strong>
              {concept.theme.materials}
            </p>
          </div>
        </div>

        {/* Card 4: 画手速写要点与动态建议 */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-cyan-900/40 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
            <PenTool className="w-4 h-4" />
            <span>今日草图速写构图动态建议</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-1.5 leading-relaxed">
            <p>
              <strong className="text-cyan-300">① 剪影先导：</strong>
              先用粗笔触画出「{concept.base.name}」的大块面张力剪影，注意突出「{concept.base.silhouetteDesc.slice(0, 14)}」的动势。
            </p>
            <p>
              <strong className="text-cyan-300">② 机械与肉质嫁接：</strong>
              在{concept.weapon.mountingPosition}突出「{concept.weapon.name}」的硬表面机械线缆与生物基底的结合部。
            </p>
            <p>
              <strong className="text-cyan-300">③ 视觉焦点：</strong>
              将高饱和度主光点（如弱点发光或枪口聚能）定在「{concept.base.weakPoint.slice(0, 10)}」，形成第一视觉落点。
            </p>
          </div>
        </div>
      </div>

      {/* Quick Sketch / Upload Trigger Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-cyan-950/30 via-neutral-900 to-amber-950/30 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-100">立即开始绘制今日草图</h4>
            <p className="text-xs text-neutral-400">
              在内置速写板快速起稿构思，或上传你在iPad/Photoshop画好的成图进行打卡
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-open-sketchpad"
            type="button"
            onClick={onOpenSketchpad}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>打开速写板</span>
          </button>

          <label
            htmlFor="upload-sketch-input"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-all border border-neutral-700 cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>上传草图图档</span>
            <input
              id="upload-sketch-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {/* If current concept already has a sketch attached */}
      {concept.sketchDataUrl && (
        <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">今日草图预览 (Sketch Thumbnail)</span>
            <span className="text-xs text-emerald-400 font-mono-code">SAVED</span>
          </div>
          <div className="w-full max-h-64 bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-800 p-2">
            <img
              src={concept.sketchDataUrl}
              alt="Monster Sketch"
              className="max-h-56 max-w-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
