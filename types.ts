import React from 'react';

export enum ToolId {
  JSON_FORMATTER = 'jsonformatter',
  XML_FORMATTER = 'xmlformatter',
  TEXT_ENCRYPTION = 'textencryption',
  BASE64_CONVERTER = 'base64converter',
  CASE_CONVERTER = 'caseconverter',
  TEXT_TO_ASCII = 'texttoascii',
  TEXT_TO_UNICODE = 'texttounicode',
  JSON_DIFF = 'jsondiff',
  TEXT_DIFF = 'textdiff',
  STRING_REVERSER = 'stringreverser',
  ASCII_ART = 'asciiartgenerator',
  TEXT_ICON = 'texticongenerator',
  BASE64_IMAGE = 'base64imageconverter',
  JSON_TO_JAVA = 'jsontojavabean',
  TIME_CONVERTER = 'timeconverter',
}

export enum Category {
  FORMAT = 'format',
  CONVERT = 'convert',
  GENERATE = 'generate',
  COMPARE = 'compare',
  UTILS = 'utils'
}

export interface ToolDefinition {
  id: ToolId;
  icon: React.ReactNode;
  category: Category;
  // Name and description are now handled by i18n based on ID
}

export interface DiffResult {
  added: boolean;
  removed: boolean;
  value: string;
}