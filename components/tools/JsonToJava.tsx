import React, { useState, useEffect } from 'react';
import { TextArea, CodeViewer } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const JsonToJavaView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [highlighted, setHighlighted] = useState('');
  const [className, setClassName] = useState('Root');
  const { t } = useI18n();

  useEffect(() => {
    if (!input.trim()) { 
      setOutput(''); 
      setHighlighted('');
      return; 
    }
    const res = Logic.jsonToJavaBean(input, className);
    setOutput(res);
    
    if (res.startsWith("Parse Error") || res.startsWith("Invalid")) {
      setHighlighted(res);
    } else {
      setHighlighted(Logic.highlightJava(res));
    }
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
        {output && !output.startsWith("Parse Error") && !output.startsWith("Invalid") ? (
           <CodeViewer code={highlighted} language="java" />
        ) : (
           <TextArea value={output} readOnly placeholder="// Java code will appear here" className="font-mono text-xs leading-5" />
        )}
      </div>
    </div>
  );
};
