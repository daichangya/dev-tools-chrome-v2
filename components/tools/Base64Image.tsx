import React, { useState } from 'react';
import { TextArea } from '../ui/Shared';
import { useI18n } from '../../i18n';

export const Base64ImageConverter = () => {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useI18n();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setBase64(res);
        setPreview(res);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-4">
        {/* Styled Dropzone */}
        <div className="group relative bg-space-900/50 border-2 border-dashed border-slate-700 hover:border-cyan-500/70 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
          
          <div className="relative z-10 flex flex-col items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
             </div>
             <span className="text-slate-300 font-medium group-hover:text-cyan-300 transition-colors">{t('ui.clickUpload')}</span>
             <span className="text-xs text-slate-500">Supports PNG, JPG, GIF</span>
          </div>
        </div>
        
        <div className="flex-1 relative">
           <TextArea value={base64} onChange={(v: string) => { setBase64(v); setPreview(v); }} placeholder={t('ui.orPaste')} />
        </div>
      </div>
      
      <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] bg-space-900/30 border border-slate-700/50 rounded-xl flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
        {preview ? (
            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-2xl border border-slate-700" />
        ) : (
          <div className="text-center text-slate-600 flex flex-col items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
             <span>{t('ui.preview')}</span>
          </div>
        )}
      </div>
    </div>
  );
};