import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Undo2, Redo2, Trash2, Download, Check, Palette, Eraser, Pen, Brush, Sparkles } from 'lucide-react';
import { MonsterConcept } from '../types';

interface SketchCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  concept: MonsterConcept;
  onSaveSketch: (dataUrl: string) => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  isOpen,
  onClose,
  concept,
  onSaveSketch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<'pencil' | 'marker' | 'eraser'>('pencil');
  const [color, setColor] = useState<string>('#ffffff');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Initialize and resize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height || 450);

    // Save existing image if any
    const ctx = canvas.getContext('2d');
    let prevImage: HTMLImageElement | null = null;
    if (concept.sketchDataUrl) {
      prevImage = new Image();
      prevImage.src = concept.sketchDataUrl;
    }

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (prevImage) {
        prevImage.onload = () => {
          ctx.drawImage(prevImage!, 0, 0, width, height);
          const initialData = ctx.getImageData(0, 0, width, height);
          setHistory([initialData]);
          setHistoryStep(0);
        };
      } else {
        const initialData = ctx.getImageData(0, 0, width, height);
        setHistory([initialData]);
        setHistoryStep(0);
      }
    }
  }, [concept.sketchDataUrl]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initCanvas();
      }, 100);
    }
  }, [isOpen, initCanvas]);

  const saveHistoryStep = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = brushSize * 4;
      ctx.globalAlpha = 1.0;
    } else if (tool === 'marker') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 3;
      ctx.globalAlpha = 0.4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1.0;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    saveHistoryStep();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#171717';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryStep();
  };

  const handleSaveAndClose = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSketch(dataUrl);
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `monster-sketch-${concept.codeName}.png`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div
      id="sketch-canvas-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="sketch-canvas-dialog"
        className="relative w-full max-w-4xl h-[90vh] bg-neutral-900 border border-neutral-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Brush className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-100 flex items-center gap-2">
                速写草图板
                <span className="text-xs font-normal text-neutral-400 font-mono-code">
                  ({concept.base.name} + {concept.weapon.name})
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              title="下载草图PNG"
            >
              <Download className="w-4 h-4" />
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

        {/* Toolbar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tool switches */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setTool('pencil')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                tool === 'pencil' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Pen className="w-3.5 h-3.5" />
              <span>铅笔</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('marker')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                tool === 'marker' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Brush className="w-3.5 h-3.5" />
              <span>记号/铺色</span>
            </button>

            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                tool === 'eraser' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>橡皮擦</span>
            </button>
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[11px]">笔触大小:</span>
            <input
              type="range"
              min="1"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
            />
            <span className="font-mono-code text-neutral-300 w-4 text-[11px]">{brushSize}</span>
          </div>

          {/* Color palette */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-neutral-400 text-[11px] mr-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              主题色彩:
            </span>
            {['#ffffff', '#ef4444', ...concept.theme.palette].map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser') setTool('pencil');
                }}
                className={`w-5 h-5 rounded-full border transition-all ${
                  color === c && tool !== 'eraser' ? 'ring-2 ring-amber-400 scale-110 border-white' : 'border-white/20'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Undo / Redo / Clear */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded-lg text-neutral-300 transition-colors"
              title="撤销"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded-lg text-neutral-300 transition-colors"
              title="重做"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 bg-neutral-800 hover:bg-rose-900/60 text-neutral-300 hover:text-rose-300 rounded-lg transition-colors"
              title="清空画布"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 w-full relative bg-neutral-950 overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="touch-none w-full h-full block"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 hidden sm:block">
            💡 提示：按住鼠标左键即可起稿，完成草图后点击右下角保存
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
            >
              取消
            </button>
            <button
              id="btn-save-sketch"
              type="button"
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>保存草图并打卡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
