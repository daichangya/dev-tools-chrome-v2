import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToolId, Category } from './types';

type Language = 'en' | 'zh';

const translations = {
  en: {
    title: 'DevUtils Pro',
    common: {
      clear: 'Clear',
      compress: 'Compress',
      copy: 'Copy',
      copied: 'Copied!',
      result: 'Result',
      upload: 'Upload File',
      input: 'Input',
      processing: 'Processing...',
      generate: 'Generate',
      output: 'Output',
      download: 'Download',
      friendLink: 'Friend Link: JSDiff Blog',
    },
    ui: {
      originalJson: 'Original JSON',
      formattedJson: 'Formatted JSON',
      formatXml: 'Format XML',
      fileUploaded: 'File Uploaded',
      encode: 'Encode',
      decode: 'Decode',
      inputText: 'Input Text',
      upper: 'UPPER',
      lower: 'lower',
      capital: 'Capitalize',
      encrypt: 'Encrypt',
      decrypt: 'Decrypt',
      compareMode: 'Mode',
      diffModeJson: 'JSON',
      diffModeChars: 'Chars',
      diffModeWords: 'Words',
      diffModeLines: 'Lines',
      diffModePatch: 'Patch',
      diffOriginal: 'Original',
      diffModified: 'Modified',
      diffNoChanges: 'No changes found.',
      className: 'Class Name',
      javaCode: 'Java Code',
      textColor: 'Text Color',
      bgColor: 'Background',
      clickUpload: 'Click to Upload',
      orPaste: 'Or paste Base64 string here...',
      preview: 'Preview',
      timeCurrent: 'Current Time',
      timestamp: 'Timestamp',
      setNow: 'Set Now',
      dateIso: 'Date (ISO)',
      searchTools: 'Search tools...'
    },
    categories: {
      [Category.FORMAT]: 'Format',
      [Category.CONVERT]: 'Convert',
      [Category.GENERATE]: 'Generate',
      [Category.COMPARE]: 'Compare',
      [Category.UTILS]: 'Utilities'
    },
    tools: {
      [ToolId.JSON_FORMATTER]: 'JSON Formatter',
      [ToolId.XML_FORMATTER]: 'XML Formatter',
      [ToolId.TIME_CONVERTER]: 'Time Converter',
      [ToolId.TEXT_ENCRYPTION]: 'Text Encryption',
      [ToolId.BASE64_CONVERTER]: 'Base64 Converter',
      [ToolId.CASE_CONVERTER]: 'Case Converter',
      [ToolId.TEXT_TO_ASCII]: 'Text to ASCII',
      [ToolId.TEXT_TO_UNICODE]: 'Text to Unicode',
      [ToolId.DIFF_VIEWER]: 'Diff Viewer',
      [ToolId.STRING_REVERSER]: 'String Reverser',
      [ToolId.ASCII_ART]: 'ASCII Art Gen',
      [ToolId.TEXT_ICON]: 'Text Icon Gen',
      [ToolId.BASE64_IMAGE]: 'Base64 Image',
      [ToolId.JSON_TO_JAVA]: 'JSON to Java',
    }
  },
  zh: {
    title: 'DevUtils Pro',
    common: {
      clear: '清空',
      compress: '压缩',
      copy: '复制',
      copied: '已复制',
      result: '结果',
      upload: '上传文件',
      input: '输入',
      processing: '处理中...',
      generate: '生成',
      output: '输出',
      download: '下载',
      friendLink: '友情链接: JSDiff 博客',
    },
    ui: {
      originalJson: '原始 JSON',
      formattedJson: '格式化 JSON',
      formatXml: '格式化 XML',
      fileUploaded: '文件已上传',
      encode: '编码',
      decode: '解码',
      inputText: '输入文本',
      upper: '大写',
      lower: '小写',
      capital: '首字母大写',
      encrypt: '加密',
      decrypt: '解密',
      compareMode: '模式',
      diffModeJson: 'JSON',
      diffModeChars: '字符',
      diffModeWords: '单词',
      diffModeLines: '行',
      diffModePatch: '补丁',
      diffOriginal: '原始文本',
      diffModified: '修改文本',
      diffNoChanges: '未发现差异',
      className: '类名',
      javaCode: 'Java 代码',
      textColor: '文字颜色',
      bgColor: '背景颜色',
      clickUpload: '点击上传图片',
      orPaste: '或在此粘贴 Base64 字符串...',
      preview: '预览',
      timeCurrent: '当前时间',
      timestamp: '时间戳',
      setNow: '设为当前',
      dateIso: '日期 (ISO)',
      searchTools: '搜索工具...'
    },
    categories: {
      [Category.FORMAT]: '格式化',
      [Category.CONVERT]: '转换',
      [Category.GENERATE]: '生成',
      [Category.COMPARE]: '比较',
      [Category.UTILS]: '工具'
    },
    tools: {
      [ToolId.JSON_FORMATTER]: 'JSON 格式化',
      [ToolId.XML_FORMATTER]: 'XML 格式化',
      [ToolId.TIME_CONVERTER]: '时间戳转换',
      [ToolId.TEXT_ENCRYPTION]: '文本加密',
      [ToolId.BASE64_CONVERTER]: 'Base64 转换',
      [ToolId.CASE_CONVERTER]: '大小写转换',
      [ToolId.TEXT_TO_ASCII]: 'ASCII 编码',
      [ToolId.TEXT_TO_UNICODE]: 'Unicode 转换',
      [ToolId.DIFF_VIEWER]: '文本比对',
      [ToolId.STRING_REVERSER]: '字符串翻转',
      [ToolId.ASCII_ART]: 'ASCII 艺术字',
      [ToolId.TEXT_ICON]: '文字图标生成',
      [ToolId.BASE64_IMAGE]: '图片 Base64',
      [ToolId.JSON_TO_JAVA]: 'JSON 转 Java',
    }
  }
};

const I18nContext = createContext<any>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  // Auto-detect language
  const [language, setLanguage] = useState<Language>(() => {
     const saved = localStorage.getItem('devutils-lang');
     if (saved === 'en' || saved === 'zh') return saved;
     return navigator.language.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('devutils-lang', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const k of keys) {
      if (current[k] === undefined) return path;
      current = current[k];
    }
    return current;
  };

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
