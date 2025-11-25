import React from 'react';

export const TextArea = ({ value, onChange, placeholder, readOnly = false, className = '' }: any) => (
  <textarea
    className={`w-full h-full bg-slate-900 border border-slate-700 text-slate-300 p-3 rounded-md font-mono text-sm focus:outline-none focus:border-blue-500 resize-none ${className}`}
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

export const Button = ({ onClick, children, variant = 'primary', disabled = false }: any) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2";
  const styles = variant === 'primary' 
    ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-900/50" 
    : "bg-slate-700 hover:bg-slate-600 text-slate-200";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
};
