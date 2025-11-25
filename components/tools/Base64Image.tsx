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
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
          <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          <span className="text-slate-400">{t('ui.clickUpload')}</span>
        </div>
        <TextArea value={base64} onChange={(v: string) => { setBase64(v); setPreview(v); }} placeholder={t('ui.orPaste')} />
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
        {preview ? (
            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
        ) : <span className="text-slate-600">{t('ui.preview')}</span>}
      </div>
    </div>
  );
};