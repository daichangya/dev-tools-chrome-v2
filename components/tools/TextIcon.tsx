import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Shared';
import { useI18n } from '../../i18n';

export const TextIconGenerator = () => {
  const [text, setText] = useState('JS');
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#1e293b');
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
    ctx.font = 'bold 120px sans-serif';
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
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <div className="bg-slate-800 p-4 rounded-lg flex flex-col gap-4 w-64">
        <input className="bg-slate-900 border border-slate-700 p-2 rounded text-white" value={text} onChange={e => setText(e.target.value)} placeholder={t('ui.inputText')} maxLength={3} />
        <div className="flex gap-2 items-center justify-between">
           <span className="text-xs">{t('ui.textColor')}</span>
           <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="flex gap-2 items-center justify-between">
           <span className="text-xs">{t('ui.bgColor')}</span>
           <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
        </div>
        <Button onClick={download}>{t('common.download')}</Button>
      </div>
      <canvas ref={canvasRef} width={256} height={256} className="border border-slate-700 rounded-xl shadow-2xl" />
    </div>
  );
};