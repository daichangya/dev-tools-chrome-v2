import React, { useState } from 'react';
import { ToolId, ToolDefinition, Category } from './types';
import * as Tools from './components/tools';
import { useI18n } from './i18n';

// --- Icons (Enhanced strokes) ---
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
    <div className="flex flex-row h-full w-full bg-space-950 text-slate-200 font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-highlight pointer-events-none opacity-50 z-0"></div>

      {/* Sidebar */}
      <div className="w-64 bg-space-900/80 backdrop-blur-xl border-r border-slate-800/60 flex flex-col flex-shrink-0 z-10 shadow-2xl">
        <div className="p-5 border-b border-slate-800/60 flex justify-between items-center relative overflow-hidden group">
           {/* Added pointer-events-none to prevent blocking clicks */}
           <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
           <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent relative z-10 tracking-tight flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            {t('title')}
          </h1>
          {/* Added relative and z-20 to ensure button is clickable above the overlay */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="relative z-20 text-xs bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 border border-slate-700 px-2 py-1 rounded text-slate-400 font-mono transition-all"
          >
            {language.toUpperCase()}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                {t(`categories.${category}`)}
              </h3>
              <div className="space-y-0.5">
                {TOOLS.filter(tool => tool.category === category).map(tool => {
                  const isActive = activeToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveToolId(tool.id)}
                      className={`relative w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                        isActive 
                        ? 'text-white bg-gradient-to-r from-blue-600/20 to-cyan-600/10' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(34,211,238,0.6)]"></div>}
                      
                      <span className={`mr-3 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {tool.icon}
                      </span>
                      {t(`tools.${tool.id}.name`)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        <header className="bg-space-900/50 backdrop-blur-md border-b border-slate-800/50 p-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
              <span className="p-1.5 bg-slate-800 rounded-md text-cyan-400 border border-slate-700 shadow-glow-sm">
                 {activeTool.icon}
              </span>
              {t(`tools.${activeToolId}.name`)}
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-space-950 px-3 py-1 rounded-full border border-slate-800">
             v1.0.0
          </div>
        </header>
        <main className="flex-1 p-6 overflow-hidden relative">
           {/* Content Container with Grid Background */}
          <div className="w-full h-full flex flex-col relative">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}