import React, { useState, useEffect } from 'react';
import { TextArea, Button } from '../ui/Shared';
import { ToolId } from '../../types';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const StringToolsView = ({ tool }: { tool: ToolId }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    if (tool === ToolId.STRING_REVERSER) {
      setOutput(Logic.reverseString(input));
    } else if (tool === ToolId.CASE_CONVERTER) {
      setOutput(Logic.convertCase(input, 'upper'));
    } else if (tool === ToolId.TEXT_ENCRYPTION) {
        setOutput(Logic.simpleEncrypt(input));
    }
  }, [input, tool]);

  const handleCaseChange = (type: 'upper' | 'lower' | 'capital') => {
    setOutput(Logic.convertCase(input, type));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <TextArea value={input} onChange={setInput} placeholder={t('ui.inputText')} className="h-1/2" />
      
      {tool === ToolId.CASE_CONVERTER && (
        <div className="flex gap-2 justify-center">
          <Button onClick={() => handleCaseChange('upper')} variant="secondary">{t('ui.upper')}</Button>
          <Button onClick={() => handleCaseChange('lower')} variant="secondary">{t('ui.lower')}</Button>
          <Button onClick={() => handleCaseChange('capital')} variant="secondary">{t('ui.capital')}</Button>
        </div>
      )}

      {tool === ToolId.TEXT_ENCRYPTION && (
         <div className="flex gap-2 justify-center">
            <Button onClick={() => setOutput(Logic.simpleEncrypt(input))} variant="secondary">{t('ui.encrypt')}</Button>
            <Button onClick={() => setOutput(Logic.simpleDecrypt(input))} variant="secondary">{t('ui.decrypt')}</Button>
         </div>
      )}

      <TextArea value={output} readOnly placeholder={t('common.result')} className="h-1/2" />
    </div>
  );
};