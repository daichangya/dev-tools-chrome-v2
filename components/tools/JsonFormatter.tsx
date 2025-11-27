import React, { useState, useEffect } from 'react';
import { TextArea, CodeViewer, Button } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const JsonFormatterView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [highlighted, setHighlighted] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!input.trim()) { 
      setOutput(''); 
      setHighlighted('');
      return; 
    }
    const formatted = Logic.formatJson(input);
    setOutput(formatted);
    
    if (formatted === "Invalid JSON") {
      setHighlighted(formatted);
    } else {
      setHighlighted(Logic.highlightJson(formatted));
    }
  }, [input]);

  const handleCompress = () => {
    if (!output || output === "Invalid JSON") return;
    const compressed = Logic.compressJson(output);
    setOutput(compressed);
    setHighlighted(Logic.highlightJson(compressed));
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setHighlighted('');
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-center">
           <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.originalJson')}</label>
           <button 
             onClick={handleClear}
             className="text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors bg-red-900/20 px-2 py-0.5 rounded border border-red-900/50"
           >
             {t('common.clear')}
           </button>
        </div>
        <TextArea value={input} onChange={setInput} placeholder='{"key": "value"}' />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
           <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.formattedJson')}</label>
           
           <div className="flex gap-2">
              <button 
                onClick={handleCompress}
                className="text-[10px] uppercase font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-900/50"
                disabled={!output || output === "Invalid JSON"}
              >
                {t('common.compress')}
              </button>
              <button 
                onClick={handleCopy}
                className={`text-[10px] uppercase font-bold transition-colors px-2 py-0.5 rounded border ${copyFeedback ? 'text-green-400 bg-green-900/20 border-green-900/50' : 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'}`}
                disabled={!output}
              >
                {copyFeedback ? t('common.copied') : t('common.copy')}
              </button>
           </div>
        </div>

        {output === "Invalid JSON" || !output ? (
          <TextArea value={output} readOnly placeholder={t('common.result')} />
        ) : (
          <CodeViewer code={highlighted} language="json" />
        )}
      </div>
    </div>
  );
};