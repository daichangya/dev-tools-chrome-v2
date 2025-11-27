import React, { useState, useEffect } from 'react';
import { TextArea } from '../ui/Shared';
import { useI18n } from '../../i18n';
// @ts-ignore
import * as Diff from 'diff';

type DiffMode = 'diffJson' | 'diffChars' | 'diffWords' | 'diffLines' | 'diffPatch';

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  chunkHeader?: boolean;
}

export const DiffView = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [mode, setMode] = useState<DiffMode>('diffJson');
  const [diffData, setDiffData] = useState<DiffPart[]>([]);
  const { t } = useI18n();

  // Helper to set example text based on mode
  const setExampleText = (selectedMode: DiffMode) => {
    if (selectedMode === 'diffJson') {
      setLeft(JSON.stringify({
        name: "Product A",
        price: 100,
        features: ["Durable", "Easy to use"],
        metadata: { created: "2023-01-15", rating: 4.5 }
      }, null, 2));
      setRight(JSON.stringify({
        name: "Product A",
        price: 120,
        features: ["Durable", "Easy to use", "Lightweight"],
        metadata: { created: "2023-01-15", rating: 4.7, inStock: true }
      }, null, 2));
    } else if (selectedMode === 'diffPatch' || selectedMode === 'diffLines') {
      setLeft("Line 1\nLine 2\nLine 3\nLine 4");
      setRight("Line 1\nModified Line 2\nLine 3\nNew Line\nLine 4");
    } else if (selectedMode === 'diffWords') {
      setLeft("The quick brown fox jumps over the lazy dog");
      setRight("The fast brown fox leaps over the lazy dog");
    } else {
      setLeft("restaurant");
      setRight("aura");
    }
  };

  // Initialize with examples
  useEffect(() => {
    setExampleText('diffJson');
  }, []);

  const handleModeChange = (newMode: DiffMode) => {
    setMode(newMode);
    setExampleText(newMode);
  };

  // Main Diff Logic
  useEffect(() => {
    if (!left && !right) {
      setDiffData([]);
      return;
    }

    let result: DiffPart[] = [];

    try {
      if (mode === 'diffPatch') {
        // --- Patch Mode Logic (from reference) ---
        const patch = Diff.createTwoFilesPatch('Original', 'Modified', left, right);
        
        // Parse the raw patch string into structured data for coloring
        let pastHunkHeader = false;
        result = patch.split('\n').map((entry: string) => {
            const item: DiffPart = {
                value: entry + '\n',
            };
            if (entry.startsWith('@@')) {
                item.chunkHeader = true;
                pastHunkHeader = true;
            } else if (pastHunkHeader) {
                if (entry.startsWith('-')) {
                    item.removed = true;
                } else if (entry.startsWith('+')) {
                    item.added = true;
                }
            }
            return item;
        });

      } else if (mode === 'diffJson') {
        // --- JSON Mode Logic (from reference) ---
        try {
            const oldObj = JSON.parse(left);
            const newObj = JSON.parse(right);
            // Diff.diffJson expects objects
            result = Diff.diffJson(oldObj, newObj);
        } catch (e) {
            result = [{value: 'Invalid JSON input: ' + (e as Error).message, added: undefined, removed: undefined }];
        }
      } else {
        // --- Standard Modes (Chars, Words, Lines) ---
        // @ts-ignore
        result = Diff[mode](left, right);
      }
    } catch (e) {
      console.error(e);
      result = [{ value: "Error calculating diff.", added: false, removed: false }];
    }

    // --- Visual Optimization (from reference) ---
    // Swap 'Added' and 'Removed' so 'Removed' always comes before 'Added'
    // This makes reading changes easier (Read "What was removed" then "What replaced it")
    const optimized = [...result];
    for (let i = 0; i < optimized.length - 1; i++) {
        if (optimized[i].added && optimized[i + 1].removed) {
            const swap = optimized[i];
            optimized[i] = optimized[i + 1];
            optimized[i + 1] = swap;
        }
    }

    setDiffData(optimized);

  }, [left, right, mode]);

  const modes: DiffMode[] = ['diffJson', 'diffChars', 'diffWords', 'diffLines', 'diffPatch'];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 items-center bg-space-900/50 p-2 rounded-lg border border-slate-800">
         <span className="text-xs font-bold text-slate-500 uppercase px-2">{t('ui.compareMode')}:</span>
         {modes.map(m => (
           <button 
             key={m}
             onClick={() => handleModeChange(m)}
             className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
               mode === m 
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                 : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
             }`}
           >
             {t(`ui.${m.replace('diff', 'diffMode')}`)}
           </button>
         ))}
      </div>

      {/* Input Area */}
      <div className="grid grid-cols-2 gap-4 h-1/3 min-h-[150px]">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.diffOriginal')}</label>
          <TextArea value={left} onChange={setLeft} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase text-slate-500 font-bold">{t('ui.diffModified')}</label>
          <TextArea value={right} onChange={setRight} />
        </div>
      </div>

      {/* Result Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-space-950 rounded-xl border border-slate-700/50 overflow-hidden relative group shadow-inner">
         <div className="absolute top-0 left-0 w-full h-8 bg-slate-900/90 border-b border-slate-800 flex items-center px-4 text-xs font-bold text-slate-500 uppercase tracking-wider z-10 backdrop-blur">
            {t('common.result')}
         </div>
         <div className="flex-1 overflow-auto p-4 pt-12 custom-scrollbar">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
              {diffData.map((part, index) => {
                
                if (part.added) {
                  return (
                    <ins key={index} className="bg-green-500/20 text-green-300 decoration-0 border-b border-green-500/30 px-0.5 rounded-sm">
                      {part.value}
                    </ins>
                  );
                } 
                
                if (part.removed) {
                  return (
                    <del key={index} className="bg-red-500/20 text-red-300 decoration-0 border-b border-red-500/30 px-0.5 rounded-sm opacity-80">
                      {part.value}
                    </del>
                  );
                } 
                
                if (part.chunkHeader) {
                  return (
                    <span key={index} className="text-blue-400 font-bold bg-blue-900/20 block py-1 px-2 rounded my-1 border-l-2 border-blue-500">
                      {part.value}
                    </span>
                  );
                }

                return (
                  <span key={index} className="text-slate-400">
                    {part.value}
                  </span>
                );
              })}
            </pre>
            {diffData.length === 0 && (
               <div className="text-slate-600 italic text-center mt-10">{t('ui.diffNoChanges')}</div>
            )}
         </div>
      </div>
    </div>
  );
};
