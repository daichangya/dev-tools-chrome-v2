import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Shared';
import { useI18n } from '../../i18n';

export const TimeConverterView = () => {
  const { t } = useI18n();
  const [now, setNow] = useState(new Date());
  const [timestampInput, setTimestampInput] = useState(String(Date.now()));
  const [dateInput, setDateInput] = useState(new Date().toISOString());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSetNow = () => {
    const n = new Date();
    setTimestampInput(String(n.getTime()));
    setDateInput(n.toISOString());
  };

  const handleTimestampChange = (val: string) => {
    setTimestampInput(val);
    const ts = parseInt(val, 10);
    if (!isNaN(ts)) {
      // Heuristic: if ts is small (seconds), multiply by 1000
      // But standard is usually ms in JS. Let's assume ms if > 10^11, else s.
      // 10^11 is roughly year 5138 if seconds, or 1973 if ms.
      // Actually simpler: if length <= 10, it's seconds.
      const normalizedTs = val.length <= 10 ? ts * 1000 : ts;
      setDateInput(new Date(normalizedTs).toISOString());
    }
  };

  const handleDateChange = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setTimestampInput(String(d.getTime()));
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full p-2">
      
      {/* Real-time Clock Section */}
      <div className="bg-space-900/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 opacity-50 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
        <div className="text-xs text-cyan-400 font-bold tracking-[0.2em] uppercase z-10">{t('ui.timeCurrent')}</div>
        <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-100 z-10 drop-shadow-lg">
          {now.toLocaleTimeString()}
        </div>
        <div className="text-sm font-mono text-slate-400 z-10">
          {now.toISOString()}
        </div>
      </div>

      {/* Converter Section */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Timestamp Row */}
        <div className="space-y-2">
           <div className="flex justify-between items-end">
              <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.timestamp')}</label>
              <Button onClick={handleSetNow} variant="secondary" className="text-xs py-1 px-2 h-7">{t('ui.setNow')}</Button>
           </div>
           <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg opacity-50 group-hover:opacity-100 transition duration-200 blur-[1px] pointer-events-none"></div>
              <input 
                type="text" 
                value={timestampInput}
                onChange={(e) => handleTimestampChange(e.target.value)}
                className="relative w-full bg-space-900 border border-slate-700 text-slate-200 p-3 rounded-lg font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
           </div>
        </div>

        {/* Date Row */}
        <div className="space-y-2">
           <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.dateIso')}</label>
           <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg opacity-50 group-hover:opacity-100 transition duration-200 blur-[1px] pointer-events-none"></div>
              <input 
                type="text" 
                value={dateInput}
                onChange={(e) => handleDateChange(e.target.value)}
                className="relative w-full bg-space-900 border border-slate-700 text-slate-200 p-3 rounded-lg font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
           </div>
        </div>

      </div>

      {/* Helper Info */}
      <div className="mt-auto bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 text-xs text-slate-400 leading-relaxed">
        <p>• Timestamps ≤ 10 digits are treated as seconds.</p>
        <p>• Timestamps {'>'} 10 digits are treated as milliseconds.</p>
        <p>• Supports ISO 8601 format (e.g., 2023-10-25T12:00:00Z).</p>
      </div>
    </div>
  );
};