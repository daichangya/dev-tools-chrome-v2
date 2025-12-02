
import React, { useState, useEffect } from 'react';
import { TextArea, Button } from '../ui/Shared';
import { useI18n } from '../../i18n';
import { generateLocalAscii } from '../../utils/asciiFonts';

export const AsciiArtGenerator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    // Instant local generation
    const res = generateLocalAscii(input);
    setOutput(res);
  }, [input]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="h-1/3 flex flex-col gap-2">
        <label className="text-xs uppercase text-slate-500 font-bold tracking-wider">
          {t('common.input')}
        </label>
        <TextArea 
          value={input} 
          onChange={setInput} 
          placeholder={t('ui.inputText')} 
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Local Generation (No AI)</span>
        <Button onClick={handleCopy} disabled={!output} className="w-32">
          {t('common.copy')}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-0">
         <label className="text-xs uppercase text-slate-500 font-bold tracking-wider">{t('common.output')}</label>
         <TextArea 
           value={output} 
           readOnly 
           className="font-mono text-xs leading-none bg-black text-neon-cyan whitespace-pre overflow-auto" 
         />
      </div>
    </div>
  );
};
