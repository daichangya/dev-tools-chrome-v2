import React, { useState, useEffect } from 'react';
import { TextArea } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const JsonToJavaView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [className, setClassName] = useState('Root');
  const { t } = useI18n();

  useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(Logic.jsonToJavaBean(input, className));
  }, [input, className]);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
             <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.originalJson')}</label>
             <input 
                type="text" 
                value={className} 
                onChange={(e) => setClassName(e.target.value)} 
                className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-slate-300 w-24 text-center focus:outline-none focus:border-blue-500"
                placeholder={t('ui.className')}
             />
        </div>
        <TextArea value={input} onChange={setInput} placeholder='{"id": 1, "name": "Test"}' />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.javaCode')}</label>
        <TextArea value={output} readOnly placeholder="// Java code will appear here" className="font-mono text-xs leading-5" />
      </div>
    </div>
  );
};