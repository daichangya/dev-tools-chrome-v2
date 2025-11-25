import React, { useState, useEffect } from 'react';
import { TextArea } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const JsonFormatterView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(Logic.formatJson(input));
  }, [input]);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.originalJson')}</label>
        <TextArea value={input} onChange={setInput} placeholder='{"key": "value"}' />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.formattedJson')}</label>
        <TextArea value={output} readOnly placeholder={t('common.result')} />
      </div>
    </div>
  );
};