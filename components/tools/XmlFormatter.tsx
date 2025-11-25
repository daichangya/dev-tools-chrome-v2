import React, { useState } from 'react';
import { TextArea, Button } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const XmlFormatterView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useI18n();

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      setOutput(Logic.formatXml(input));
    } catch (e) {
      setOutput("Invalid XML");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <TextArea value={input} onChange={setInput} placeholder="<root><child>value</child></root>" className="h-1/2" />
      <div className="flex gap-2">
        <Button onClick={handleFormat}>{t('ui.formatXml')}</Button>
      </div>
      <TextArea value={output} readOnly placeholder={t('common.result')} className="h-1/2" />
    </div>
  );
};