import React, { useState } from 'react';
import { X, Calendar, Flame, CheckCircle2, Bookmark, Image as ImageIcon, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { MonsterConcept } from '../types';

interface DailyRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MonsterConcept[];
  onSelectConcept: (concept: MonsterConcept) => void;
  onDeleteConcept: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompleted: (id: string) => void;
}

export const DailyRecordsModal: React.FC<DailyRecordsModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectConcept,
  onDeleteConcept,
  onToggleFavorite,
  onToggleCompleted,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Calculate streak
  const completedCount = history.filter((h) => h.isCompleted).length;
  const favoriteCount = history.filter((h) => h.isFavorite).length;

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'completed'
        ? item.isCompleted
        : item.isFavorite;

    const matchesSearch =
      item.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.base.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.theme.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      id="daily-records-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="daily-records-dialog"
        className="relative w-full max-w-3xl max-h-[88vh] bg-neutral-900 border border-neutral-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Stats */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-100">
                  每日速写创作记录 & 归档
                </h3>
                <p className="text-xs text-neutral-400">
                  记录你每天抽取的怪兽组合与手绘打卡草图
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono-code">已生成概念</span>
                <span className="font-bold text-sm text-neutral-100">{history.length} 个</span>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono-code">已完成草图</span>
                <span className="font-bold text-sm text-emerald-400">{completedCount} 幅</span>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono-code">特别收藏</span>
                <span className="font-bold text-sm text-rose-400">{favoriteCount} 项</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              全部 ({history.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'completed' ? 'bg-emerald-500 text-black font-bold' : 'text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              已打卡草图 ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('favorites')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'favorites' ? 'bg-rose-500 text-white font-bold' : 'text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              已收藏 ({favoriteCount})
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索历史记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>
        </div>

        {/* Record Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm">暂无匹配的创作历史记录</p>
              <p className="text-xs text-neutral-600">点击主界面大按钮抽取今日灵感，完成一幅怪兽速写吧！</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Thumbnail if sketched */}
                  {item.sketchDataUrl ? (
                    <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-700/80 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.sketchDataUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-neutral-900 border border-neutral-800/80 shrink-0 flex flex-col items-center justify-center text-neutral-600">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-[9px] mt-0.5">待绘制</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-neutral-200">{item.codeName}</span>
                      <span className="text-[10px] font-mono-code text-neutral-500">{item.dateStr}</span>
                      {item.isCompleted && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">
                          已完成
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 truncate">
                      {item.base.name} <span className="text-neutral-500">+</span> {item.weapon.name}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      🎨 主题: {item.theme.name} · 定位: {item.base.role}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleCompleted(item.id)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      item.isCompleted
                        ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                    title={item.isCompleted ? '标为未完成' : '打卡标为已完成'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      item.isFavorite
                        ? 'bg-rose-950/60 border-rose-700/60 text-rose-400'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                    title={item.isFavorite ? '取消收藏' : '收藏'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectConcept(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                  >
                    <span>载入此概念</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteConcept(item.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="删除记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
