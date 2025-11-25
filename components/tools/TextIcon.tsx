import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Shared';
import { useI18n } from '../../i18n';

export const TextIconGenerator = () => {
  const [text, setText] = useState('JS');
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#0f172a');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = color;
    ctx.font = 'bold 120px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.substring(0, 3), 128, 128);
  }, [text, color, bgColor]);

  const download = () => {
    const link = document.createElement('a');
    link.download = 'icon.png';
    link.href = canvasRef.current?.toDataURL() || '';
    link.click();
  };

  return (
    <div className="flex flex-row items-center justify-center gap-12 h-full">
      
      {/* Controls */}
      <div className="bg-space-900/80 backdrop-blur border border-slate-700/50 p-6 rounded-2xl flex flex-col gap-6 w-72 shadow-2xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Settings</h3>
        
        <div className="space-y-2">
           <label className="text-xs text-slate-500 font-medium">{t('ui.inputText')}</label>
           <input 
              className="w-full bg-space-950 border border-slate-700 p-3 rounded-lg text-white text-center font-bold text-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" 
              value={text} 
              onChange={e => setText(e.target.value)} 
              placeholder="AB" 
              maxLength={3} 
           />
        </div>

        <div className="space-y-4">
           <div className="flex gap-4 items-center justify-between p-2 bg-space-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">{t('ui.textColor')}</span>
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-600 ring-2 ring-transparent hover:ring-cyan-500/50 transition-all cursor-pointer">
                 <input type="color" value={color} onChange={e => setColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer" />
              </div>
           </div>
           
           <div className="flex gap-4 items-center justify-between p-2 bg-space-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">{t('ui.bgColor')}</span>
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-600 ring-2 ring-transparent hover:ring-cyan-500/50 transition-all cursor-pointer">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer" />
              </div>
           </div>
        </div>
        
        <Button onClick={download} className="w-full py-3 mt-2">{t('common.download')}</Button>
      </div>

      {/* Canvas */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
        <canvas ref={canvasRef} width={256} height={256} className="relative border border-slate-700 rounded-xl shadow-2xl bg-space-950" />
      </div>
    </div>
  );
};