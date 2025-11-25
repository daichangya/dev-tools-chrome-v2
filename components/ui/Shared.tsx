import React from 'react';

export const TextArea = ({ value, onChange, placeholder, readOnly = false, className = '' }: any) => (
  <div className={`relative group flex-1 h-full ${className}`}>
    {/* Added pointer-events-none */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg opacity-50 group-hover:opacity-100 transition duration-200 blur-[1px] pointer-events-none"></div>
    <textarea
      className={`relative w-full h-full bg-space-900/90 border border-slate-700/50 text-slate-300 p-4 rounded-lg font-mono text-sm leading-relaxed
        focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 input-focus-glow
        resize-none transition-all duration-200 placeholder-slate-600
        ${readOnly ? 'bg-space-950/50 text-slate-400 cursor-text' : ''}`}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      spellCheck={false}
    />
  </div>
);

export const Button = ({ onClick, children, variant = 'primary', disabled = false, className = '' }: any) => {
  const base = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group active:scale-95";
  
  // Primary: Gradient Blue/Cyan
  const primary = "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent";
  
  // Secondary: Darker, subtle border
  const secondary = "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 hover:border-slate-500 hover:text-white hover:shadow-glow-sm";

  const styles = variant === 'primary' ? primary : secondary;

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {/* Shine effect - added pointer-events-none */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></span>
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
};