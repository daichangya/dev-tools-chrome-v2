import React, { useState, useEffect } from 'react';
import { TextArea } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const DiffView = ({ type }: { type: 'json' | 'text' }) => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diffs, setDiffs] = useState<any[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    if (type === 'text') {
      setDiffs(Logic.compareText(left, right));
    } else {
      const fmtLeft = Logic.formatJson(left);
      const fmtRight = Logic.formatJson(right);
      setDiffs(Logic.compareText(fmtLeft, fmtRight));
    }
  }, [left, right, type]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid grid-cols-2 gap-4 h-1/3">
        <TextArea value={left} onChange={setLeft} placeholder={t('ui.diffOriginal')} />
        <TextArea value={right} onChange={setRight} placeholder={t('ui.diffModified')} />
      </div>
      <div className="flex-1 bg-slate-900 border border-slate-700 rounded-md overflow-auto p-4 font-mono text-sm">
        {diffs.map((d, i) => (
          <div key={i} className={`flex ${d.status === 'diff' ? 'bg-red-900/30' : ''}`}>
             <div className="w-8 text-slate-600 select-none text-right pr-2">{d.line}</div>
             <div className="flex-1 grid grid-cols-2 gap-4">
                <span className={`${d.status === 'diff' ? 'text-red-400' : 'text-slate-400'}`}>{d.t1}</span>
                <span className={`${d.status === 'diff' ? 'text-green-400' : 'text-slate-400'}`}>{d.t2}</span>
             </div>
          </div>
        ))}
        {diffs.length === 0 && <div className="text-slate-500 text-center mt-10">{t('ui.diffNoChanges')}</div>}
      </div>
    </div>
  );
};