import React, { useState } from 'react';
import { TextArea, Button, CodeViewer } from '../ui/Shared';
import * as Logic from '../../utils/toolLogic';
import { useI18n } from '../../i18n';

export const XmlFormatterView = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [highlighted, setHighlighted] = useState('');
  const { t } = useI18n();

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const res = Logic.formatXml(input);
      setOutput(res);
      setHighlighted(Logic.highlightXml(res));
    } catch (e) {
      setOutput("Invalid XML");
      setHighlighted("Invalid XML");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <TextArea value={input} onChange={setInput} placeholder="<root><child>value</child></root>" className="h-1/2" />
      <div className="flex gap-2">
        <Button onClick={handleFormat}>{t('ui.formatXml')}</Button>
      </div>
      <div className="flex-1 h-1/2">
        {output && output !== "Invalid XML" ? (
           <CodeViewer code={highlighted} language="xml" />
        ) : (
           <TextArea value={output} readOnly placeholder={t('common.result')} />
        )}
      </div>
    </div>
  );
};
