import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToolId, Category } from './types';

type Language = 'en' | 'zh';

const translations = {
  en: {
    title: 'DevUtils Pro',
    categories: {
      [Category.FORMAT]: 'Formatters',
      [Category.CONVERT]: 'Converters',
      [Category.GENERATE]: 'Generators',
      [Category.COMPARE]: 'Comparators',
      [Category.UTILS]: 'Utilities',
    },
    tools: {
      [ToolId.JSON_FORMATTER]: { name: 'JSON Formatter', desc: 'Prettify and validate JSON' },
      [ToolId.XML_FORMATTER]: { name: 'XML Formatter', desc: 'Prettify XML strings' },
      [ToolId.TEXT_ENCRYPTION]: { name: 'Text Encryption', desc: 'Simple text encryption/decryption' },
      [ToolId.BASE64_CONVERTER]: { name: 'Base64 Converter', desc: 'Encode and decode Base64' },
      [ToolId.CASE_CONVERTER]: { name: 'Case Converter', desc: 'Upper, lower, and capital case' },
      [ToolId.TEXT_TO_ASCII]: { name: 'Text to ASCII', desc: 'Text to Binary/ASCII values' },
      [ToolId.TEXT_TO_UNICODE]: { name: 'Text to Unicode', desc: 'Text to Unicode escape sequences' },
      [ToolId.DIFF_VIEWER]: { name: 'Diff Viewer', desc: 'Compare Text or JSON' },
      [ToolId.STRING_REVERSER]: { name: 'String Reverser', desc: 'Reverse text characters' },
      [ToolId.ASCII_ART]: { name: 'ASCII Art Gen', desc: 'AI Powered ASCII Art' },
      [ToolId.TEXT_ICON]: { name: 'Text Icon Gen', desc: 'Create simple text icons' },
      [ToolId.BASE64_IMAGE]: { name: 'Base64 Image', desc: 'Image to Base64 and back' },
      [ToolId.JSON_TO_JAVA]: { name: 'JSON to Java', desc: 'JSON to Java Bean POJO' },
      [ToolId.TIME_CONVERTER]: { name: 'Time Converter', desc: 'Timestamp & Date conversion' },
    },
    common: {
      input: 'Input',
      output: 'Output',
      result: 'Result',
      generate: 'Generate',
      processing: 'Processing...',
      error: 'Error',
      copy: 'Copy',
      download: 'Download',
      upload: 'Upload File',
      paste: 'Paste',
      compress: 'Compress',
      clear: 'Clear',
      copied: 'Copied!',
    },
    ui: {
      formatJson: 'Format JSON',
      formatXml: 'Format XML',
      originalJson: 'Original JSON',
      formattedJson: 'Formatted JSON',
      encode: 'Encode',
      decode: 'Decode',
      fileUploaded: 'File Uploaded',
      upper: 'UPPERCASE',
      lower: 'lowercase',
      capital: 'Capitalize',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt',
      diffOriginal: 'Original',
      diffModified: 'Modified',
      diffNoChanges: 'No differences found.',
      inputText: 'Input Text',
      className: 'Class Name',
      javaCode: 'Java Bean (POJO)',
      textColor: 'Text Color',
      bgColor: 'Background Color',
      clickUpload: 'Click to Upload Image',
      orPaste: 'or paste Base64 string here...',
      preview: 'Preview',
      timeCurrent: 'Current Time',
      timestamp: 'Unix Timestamp (ms)',
      dateIso: 'Date (ISO 8601)',
      setNow: 'Set to Now',
      toLocal: 'To Local Date',
      toTimestamp: 'To Timestamp',
      compareMode: 'Compare Mode',
      diffModeJson: 'JSON',
      diffModeChars: 'Chars',
      diffModeWords: 'Words',
      diffModeLines: 'Lines',
      diffModePatch: 'Patch',
    }
  },
  zh: {
    title: 'DevUtils Pro',
    categories: {
      [Category.FORMAT]: '格式化',
      [Category.CONVERT]: '转换器',
      [Category.GENERATE]: '生成器',
      [Category.COMPARE]: '比较',
      [Category.UTILS]: '工具',
    },
    tools: {
      [ToolId.JSON_FORMATTER]: { name: 'JSON 格式化', desc: '美化并验证 JSON' },
      [ToolId.XML_FORMATTER]: { name: 'XML 格式化', desc: '美化 XML 字符串' },
      [ToolId.TEXT_ENCRYPTION]: { name: '文本加密', desc: '简单的文本加密/解密' },
      [ToolId.BASE64_CONVERTER]: { name: 'Base64 转换', desc: 'Base64 编码与解码' },
      [ToolId.CASE_CONVERTER]: { name: '大小写转换', desc: '大写、小写、首字母大写' },
      [ToolId.TEXT_TO_ASCII]: { name: '文本转 ASCII', desc: '文本转二进制/ASCII' },
      [ToolId.TEXT_TO_UNICODE]: { name: '文本转 Unicode', desc: '文本转 Unicode 编码' },
      [ToolId.DIFF_VIEWER]: { name: '差异比较', desc: '比较文本或 JSON 差异' },
      [ToolId.STRING_REVERSER]: { name: '字符串翻转', desc: '反转文本字符' },
      [ToolId.ASCII_ART]: { name: 'ASCII 艺术生成', desc: 'AI 生成 ASCII 艺术' },
      [ToolId.TEXT_ICON]: { name: '文字图标生成', desc: '生成简单文字图标' },
      [ToolId.BASE64_IMAGE]: { name: 'Base64 图片', desc: '图片与 Base64 互转' },
      [ToolId.JSON_TO_JAVA]: { name: 'JSON 转 Java', desc: 'JSON 转 Java 实体类' },
      [ToolId.TIME_CONVERTER]: { name: '时间转换', desc: '时间戳与日期互转' },
    },
    common: {
      input: '输入',
      output: '输出',
      result: '结果',
      generate: '生成',
      processing: '处理中...',
      error: '错误',
      copy: '复制',
      download: '下载',
      upload: '上传文件',
      paste: '粘贴',
      compress: '压缩',
      clear: '清空',
      copied: '已复制',
    },
    ui: {
      formatJson: '格式化 JSON',
      formatXml: '格式化 XML',
      originalJson: '原始 JSON',
      formattedJson: '格式化结果',
      encode: '编码',
      decode: '解码',
      fileUploaded: '文件已上传',
      upper: '大写',
      lower: '小写',
      capital: '首字母大写',
      encrypt: '加密',
      decrypt: '解密',
      diffOriginal: '原始文本',
      diffModified: '修改后文本',
      diffNoChanges: '未发现差异。',
      inputText: '输入文本',
      className: '类名',
      javaCode: 'Java Bean 代码',
      textColor: '文字颜色',
      bgColor: '背景颜色',
      clickUpload: '点击上传图片',
      orPaste: '或在此粘贴 Base64...',
      preview: '预览',
      timeCurrent: '当前时间',
      timestamp: 'Unix 时间戳 (毫秒)',
      dateIso: '日期字符串 (ISO 8601)',
      setNow: '设为现在',
      toLocal: '转日期',
      toTimestamp: '转时间戳',
      compareMode: '比较模式',
      diffModeJson: 'JSON 对象',
      diffModeChars: '逐字符',
      diffModeWords: '逐单词',
      diffModeLines: '逐行',
      diffModePatch: 'Patch 补丁',
    }
  }
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'zh') ? saved : 'zh'; // Default to Chinese as per request
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Missing translation for key: ${path} in language: ${language}`);
        return path;
      }
      current = current[key];
    }
    return current as string;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};