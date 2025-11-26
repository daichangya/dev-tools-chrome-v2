import React, { useState, useEffect } from 'react';
import { ToolId, ToolDefinition, Category } from './types';
import * as Tools from './components/tools';
import { useI18n } from './i18n';
import { Button } from './components/ui/Shared';

// Fix for TS error: chrome is not defined
declare const chrome: any;

// --- Icons (Enhanced strokes) ---
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const ShuffleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const TypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>;
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>;
const DiffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 13h6"></path><path d="M12 10v6"></path><path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

const TOOLS: ToolDefinition[] = [
  { id: ToolId.JSON_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.XML_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.TIME_CONVERTER, icon: <ClockIcon />, category: Category.CONVERT },
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
  const [isExtension, setIsExtension] = useState(false);
  
  const activeTool = TOOLS.find(t => t.id === activeToolId) || TOOLS[0];
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  useEffect(() => {
    // Detect if running in Chrome Extension environment
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      setIsExtension(true);
    }
  }, []);

  const renderContent = () => {
    switch (activeToolId) {
      case ToolId.JSON_FORMATTER: return <Tools.JsonFormatterView />;
      case ToolId.XML_FORMATTER: return <Tools.XmlFormatterView />;
      case ToolId.TIME_CONVERTER: return <Tools.TimeConverterView />;
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
    // Conditional Layout: 
    // If extension: Fixed dimensions (w-[780px] h-[580px])
    // If Web/Vercel: Full screen (w-screen h-screen)
    <div className={`flex flex-row bg-space-950 text-slate-200 font-sans relative ${isExtension ? 'w-[780px] h-[580px]' : 'w-screen h-screen'}`}>
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-highlight pointer-events-none opacity-50 z-0"></div>

      {/* Sidebar */}
      <div className="w-64 bg-space-900/80 backdrop-blur-xl border-r border-slate-800/60 flex flex-col flex-shrink-0 z-10 shadow-2xl">
        <div className="p-5 border-b border-slate-800/60 flex justify-between items-center relative overflow-hidden group">
           {/* Decorative Overlay - pointer-events-none essential */}
           <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
           
           <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent relative z-10 tracking-tight flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>DevUtils</span>
           </h1>

           <button 
             onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
             className="relative z-20 px-2 py-1 text-[10px] font-bold bg-slate-800 border border-slate-700 rounded text-slate-400 hover:text-white hover:border-cyan-500 transition-all uppercase tracking-wider"
           >
             {language === 'en' ? 'ZH' : 'EN'}
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 pl-2 flex items-center gap-2">
                {t(`categories.${cat}`)}
                <div className="h-[1px] bg-slate-800 flex-1"></div>
              </h3>
              <div className="space-y-1">
                {TOOLS.filter(tool => tool.category === cat).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative group ${
                      activeToolId === tool.id 
                        ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 text-cyan-400 shadow-glow-sm border border-cyan-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    {activeToolId === tool.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-cyan-400 rounded-r shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                    )}
                    <span className="relative z-10 opacity-90 group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
                    <span className="relative z-10 font-medium truncate">{t(`tools.${tool.id}.name`)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-gradient-to-br from-transparent to-space-950/50">
        <div className="h-16 border-b border-slate-800/60 flex items-center px-8 justify-between bg-space-900/30 backdrop-blur-md">
           <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                {t(`tools.${activeTool.id}.name`)}
                <span className="text-slate-600 text-sm font-normal hidden sm:inline-block">/</span>
                <span className="text-slate-500 text-xs font-normal uppercase tracking-wider border border-slate-700/50 px-1.5 py-0.5 rounded hidden sm:inline-block">{t(`categories.${activeTool.category}`)}</span>
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[400px]">{t(`tools.${activeTool.id}.desc`)}</p>
           </div>
        </div>
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full w-full max-w-5xl mx-auto animate-[fadeIn_0.3s_ease-out]">
             {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}