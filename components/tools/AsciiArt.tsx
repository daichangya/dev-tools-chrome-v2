import React, { useState } from 'react';
import { TextArea, Button } from '../ui/Shared';
import { ToolId } from '../../types';
import * as GeminiService from '../../services/geminiService';
import { useI18n } from '../../i18n';

export const GeminiToolView = ({ tool }: { tool: ToolId }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleGenerate = async () => {
    setLoading(true);
    if (tool === ToolId.ASCII_ART) {
      const res = await GeminiService.generateAsciiArt(input);
      setOutput(res);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="h-1/3 flex flex-col gap-2">
        <label className="text-xs uppercase text-slate-500 font-bold">
          {t('common.input')}
        </label>
        <TextArea value={input} onChange={setInput} placeholder={t('ui.inputText')} />
      </div>
      <div>
        <Button onClick={handleGenerate} disabled={loading || !input}>
          {loading ? t('common.processing') : t('common.generate')}
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-2">
         <label className="text-xs uppercase text-slate-500 font-bold">{t('common.output')}</label>
         <TextArea value={output} readOnly className="font-mono text-xs leading-none" />
      </div>
    </div>
  );
};