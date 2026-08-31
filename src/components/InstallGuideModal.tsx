import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Share2,
  Layers,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                安卓手机安装与下载指南
                <span className="text-[10px] font-mono-code bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  PWA + APK
                </span>
              </h2>
              <p className="text-xs text-neutral-400">在 Android 手机上享受原生全屏应用体验</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-5 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'pwa'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            方法一：桌面独立App（推荐·秒装）
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'apk'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            方法二：打包为 APK 安装包
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-neutral-300">
          {activeTab === 'pwa' ? (
            <>
              {/* Notice for 404 / URL resolution */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
                  💡 解决 "Page not found" 提示：
                </div>
                请直接复制您当前浏览器正在运行的真实地址，或者点击右上角的 <b>「在新标签页中打开 / Open in new tab」</b> 获取可直接在手机打开的链接。
              </div>

              {/* URL Copy Bar */}
              <div>
                <label className="block text-[11px] font-mono-code text-neutral-400 mb-1.5">
                  当前应用访问网址 (在手机浏览器打开)：
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-300 select-all focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> 复制链接
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-neutral-100 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  安卓手机 Chrome 3步安装：
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-200">手机发送与打开</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        将上方复制的链接通过微信/QQ/备忘录发送到手机，用 <b>Chrome 浏览器</b> 打开。
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-200">点击浏览器菜单</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        点击手机 Chrome 右上角的 <b>三点图标 (⋮)</b>。
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-200">点击「添加到主屏幕」或「安装应用」</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        手机桌面将立刻生成「FPS怪兽生成器」图标，点开即为全屏原生 App 体验！
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-purple-400 mb-1">
                  📦 导出源码为 APK 安装包：
                </div>
                适合想要离线分发 `.apk` 安装包或上架应用商店的开发者。
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <div className="font-semibold text-neutral-200 mb-1">步骤 1：下载项目源码</div>
                  <p className="text-neutral-400 text-[11px]">
                    在 AI Studio 网页右上角的 <b>设置菜单 (Settings)</b> 中选择 <b>Export to ZIP</b> 或 <b>Export to GitHub</b> 下载源码。
                  </p>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <div className="font-semibold text-neutral-200 mb-1">步骤 2：在电脑上一键生成安卓工程</div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg font-mono text-[11px] text-amber-300 select-all overflow-x-auto space-y-1">
                    <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                    <div>npx cap init "FPSMonster" "com.monster.fpsgenerator"</div>
                    <div>npm run build</div>
                    <div>npx cap add android</div>
                    <div>npx cap open android</div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <div className="font-semibold text-neutral-200 mb-1">步骤 3：Android Studio 打包 APK</div>
                  <p className="text-neutral-400 text-[11px]">
                    在打开的 Android Studio 中点击 <code>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code> 即可完成生成并传到手机安装！
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono-code">
            PWA Manifest &amp; Offline Cache Ready
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            知道了，关闭
          </button>
        </div>
      </div>
    </div>
  );
};
