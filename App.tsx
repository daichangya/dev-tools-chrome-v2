import React, { useState } from 'react';
import { ToolId, ToolDefinition, Category } from './types';
import * as Tools from './components/tools';
import { useI18n } from './i18n';

// --- Icons (Inline SVG for portability) ---
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const ShuffleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const TypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>;
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>;
const DiffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 13h6"></path><path d="M12 10v6"></path><path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path></svg>;

const TOOLS: ToolDefinition[] = [
  { id: ToolId.JSON_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.XML_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.TEXT_ENCRYPTION, icon: <LockIcon />, category: Category.UTILS },
  { id: ToolId.BASE64_CONVERTER, icon: <ShuffleIcon />, category: Category.CONVERT },
  { id: ToolId.CASE_CONVERTER, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.TEXT_TO_ASCII, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.TEXT_TO_UNICODE, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.JSON_DIFF, icon: <DiffIcon />, category: Category.COMPARE },
  { id: ToolId.TEXT_DIFF, icon: <DiffIcon />, category: Category.COMPARE },
  { id: ToolId.STRING_REVERSER, icon: <TypeIcon />, category: Category.UTILS },
  { id: ToolId.ASCII_ART, icon: <SparkleIcon />, category: Category.GENERATE },
  { id: ToolId.TEXT_ICON, icon: <ImageIcon />, category: Category.GENERATE },
  { id: ToolId.BASE64_IMAGE, icon: <ImageIcon />, category: Category.GENERATE },
  { id: ToolId.JSON_TO_JAVA, icon: <CodeIcon />, category: Category.GENERATE },
];

export default function App() {
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.JSON_FORMATTER);
  const { t, language, setLanguage } = useI18n();
  
  const activeTool = TOOLS.find(t => t.id === activeToolId) || TOOLS[0];
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  const renderContent = () => {
    switch (activeToolId) {
      case ToolId.JSON_FORMATTER: return <Tools.JsonFormatterView />;
      case ToolId.XML_FORMATTER: return <Tools.XmlFormatterView />;
      case ToolId.TEXT_ENCRYPTION: return <Tools.StringToolsView tool={ToolId.TEXT_ENCRYPTION} />;
      case ToolId.BASE64_CONVERTER: return <Tools.ConverterView mode="base64" />;
      case ToolId.CASE_CONVERTER: return <Tools.StringToolsView tool={ToolId.CASE_CONVERTER} />;
      case ToolId.TEXT_TO_ASCII: return <Tools.ConverterView mode="ascii" />;
      case ToolId.TEXT_TO_UNICODE: return <Tools.ConverterView mode="unicode" />;
      case ToolId.JSON_DIFF: return <Tools.DiffView type="json" />;
      case ToolId.TEXT_DIFF: return <Tools.DiffView type="text" />;
      case ToolId.STRING_REVERSER: return <Tools.StringToolsView tool={ToolId.STRING_REVERSER} />;
      case ToolId.ASCII_ART: return <Tools.GeminiToolView tool={ToolId.ASCII_ART} />;
      case ToolId.TEXT_ICON: return <Tools.TextIconGenerator />;
      case ToolId.BASE64_IMAGE: return <Tools.Base64ImageConverter />;
      case ToolId.JSON_TO_JAVA: return <Tools.JsonToJavaView />;
      default: return <div className="p-10 text-center text-slate-500">Tool not implemented</div>;
    }
  };

  return (
    <div className="flex flex-row h-full w-full bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400 font-mono transition-colors"
          >
            {language.toUpperCase()}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {categories.map(category => (
            <div key={category} className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t(`categories.${category}`)}
              </h3>
              <div className="space-y-1">
                {TOOLS.filter(tool => tool.category === category).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeToolId === tool.id 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="mr-3 text-slate-500">{tool.icon}</span>
                    {t(`tools.${tool.id}.name`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              {activeTool.icon}
              {t(`tools.${activeToolId}.name`)}
            </h2>
            <p className="text-xs text-slate-500">{t(`tools.${activeToolId}.desc`)}</p>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-hidden relative">
          <div className="bg-slate-800/50 rounded-xl border border-slate-800/50 p-6 h-full shadow-inner">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}