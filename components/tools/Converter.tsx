import React, { useState, useEffect } from 'react';
import { TextArea } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const ConverterView = ({ mode }: { mode: 'base64' | 'ascii' | 'unicode' }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const { t } = useI18n();
  const FILE_PLACEHOLDER = `[${t('ui.fileUploaded')}]`;

  useEffect(() => {
    if (!input) { setOutput(''); return; }
    if (input === FILE_PLACEHOLDER) return;

    if (mode === 'base64') {
      setOutput(direction === 'encode' ? Logic.toBase64(input) : Logic.fromBase64(input));
    } else if (mode === 'ascii') {
       setOutput(Logic.toAsciiBinary(input));
    } else if (mode === 'unicode') {
       setOutput(Logic.toUnicode(input));
    }
  }, [input, direction, mode, FILE_PLACEHOLDER]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64Clean = res.split(',')[1] || res;
        
        if (direction === 'encode') {
           setOutput(base64Clean);
           setInput(FILE_PLACEHOLDER); 
        } else {
           setInput(base64Clean);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        {mode === 'base64' && (
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg w-fit">
            <button onClick={() => setDirection('encode')} className={`px-3 py-1 rounded ${direction === 'encode' ? 'bg-blue-600' : ''}`}>
              {t('ui.encode')}
            </button>
            <button onClick={() => setDirection('decode')} className={`px-3 py-1 rounded ${direction === 'decode' ? 'bg-blue-600' : ''}`}>
              {t('ui.decode')}
            </button>
          </div>
        )}
        
        {mode === 'base64' && direction === 'encode' && (
          <div className="relative overflow-hidden">
             <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                {t('common.upload')}
             </button>
             <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        )}
      </div>

      <TextArea value={input} onChange={setInput} placeholder={t('common.input')} className="flex-1" />
      <div className="text-center text-slate-500">↓</div>
      <TextArea value={output} readOnly placeholder={t('common.result')} className="flex-1" />
    </div>
  );
};