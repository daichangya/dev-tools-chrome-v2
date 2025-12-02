
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
const AppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IdIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><line x1="15" y1="8" x2="17" y2="8"></line><line x1="15" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="17.5" y2="16"></line></svg>;

const TOOLS: ToolDefinition[] = [
  { id: ToolId.JSON_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.XML_FORMATTER, icon: <CodeIcon />, category: Category.FORMAT },
  { id: ToolId.TIME_CONVERTER, icon: <ClockIcon />, category: Category.CONVERT },
  { id: ToolId.TEXT_ENCRYPTION, icon: <LockIcon />, category: Category.UTILS },
  { id: ToolId.BASE64_CONVERTER, icon: <ShuffleIcon />, category: Category.CONVERT },
  { id: ToolId.CASE_CONVERTER, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.TEXT_TO_ASCII, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.TEXT_TO_UNICODE, icon: <TypeIcon />, category: Category.CONVERT },
  { id: ToolId.DIFF_VIEWER, icon: <DiffIcon />, category: Category.COMPARE },
  { id: ToolId.STRING_REVERSER, icon: <TypeIcon />, category: Category.UTILS },
  { id: ToolId.ASCII_ART, icon: <SparkleIcon />, category: Category.GENERATE },
  { id: ToolId.TEXT_ICON, icon: <ImageIcon />, category: Category.GENERATE },
  { id: ToolId.ID_CARD_GENERATOR, icon: <IdIcon />, category: Category.GENERATE },
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
      case ToolId.DIFF_VIEWER: return <Tools.DiffView />;
      case ToolId.STRING_REVERSER: return <Tools.StringToolsView tool={ToolId.STRING_REVERSER} />;
      case ToolId.ASCII_ART: return <Tools.AsciiArtGenerator />;
      case ToolId.TEXT_ICON: return <Tools.TextIconGenerator />;
      case ToolId.BASE64_IMAGE: return <Tools.Base64ImageConverter />;
      case ToolId.JSON_TO_JAVA: return <Tools.JsonToJavaView />;
      case ToolId.ID_CARD_GENERATOR: return <Tools.IdCardGenerator />;
      default: return <Tools.JsonFormatterView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-space-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-slate-800 bg-space-900/50 backdrop-blur-md z-10 shrink-0">
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/50 bg-space-950/20">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <AppIcon />
           </div>
           <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
             {t('title')}
           </h1>
        </div>

        {/* Tool List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
           {categories.map(cat => (
             <div key={cat}>
                <h3 className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-2 tracking-wider">{t(`categories.${cat}`)}</h3>
                <div className="space-y-0.5">
                   {TOOLS.filter(tool => tool.category === cat).map(tool => (
                     <button
                       key={tool.id}
                       onClick={() => setActiveToolId(tool.id)}
                       className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden ${
                         activeToolId === tool.id 
                           ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-cyan-300 shadow-glow-sm border border-blue-500/20' 
                           : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                       }`}
                     >
                       {/* Active Indicator */}
                       {activeToolId === tool.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"></div>}
                       
                       <span className={`${activeToolId === tool.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                         {tool.icon}
                       </span>
                       <span className="truncate">{t(`tools.${tool.id}`)}</span>
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-space-950/30 flex flex-col gap-3">
           <a 
              href="http://blog.jsdiff.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-neon-cyan transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-neon-cyan"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              {t('common.friendLink')}
           </a>

           <button 
             onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
             className="flex items-center justify-between w-full px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
           >
             <span>Language</span>
             <span className="font-bold bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-cyan-400">
               {language === 'en' ? 'EN' : '中文'}
             </span>
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-space-900 via-space-950 to-space-950">
         {/* Main Content */}
         <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full max-w-6xl mx-auto flex flex-col gap-4">
               <header className="flex items-center justify-between pb-4 border-b border-slate-800/50">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {activeTool.icon}
                      {t(`tools.${activeTool.id}`)}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {t(`categories.${activeTool.category}`)} • {isExtension ? 'Extension Mode' : 'Web Mode'}
                    </p>
                  </div>
               </header>
               <div className="flex-1 min-h-0 relative">
                  {renderContent()}
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
