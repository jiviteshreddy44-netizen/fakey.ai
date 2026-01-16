
import React, { useState, useCallback, useEffect } from 'react';
import { View, AnalysisResult } from './types';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import UploadZone from './components/UploadZone';
import HowItWorks from './components/HowItWorks';
import ForensicDeepDive from './components/ForensicDeepDive';
import ResultsPreview from './components/ResultsPreview';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsScreen from './components/ResultsScreen';
import LiveScanner from './components/LiveScanner';
import SignalLibrary from './components/SignalLibrary';
import BackgroundGraphics from './components/BackgroundGraphics';
import HistoryPanel from './components/HistoryPanel';
import TextInterrogator from './components/TextInterrogator';
import ReverseGrounding from './components/ReverseGrounding';
import JudicialReport from './components/JudicialReport';
import BatchTriage from './components/BatchTriage';
import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import FloatingAssistant from './components/FloatingAssistant';
import { analyzeMedia } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fakey_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    const newHistory = [result, ...history].slice(0, 15);
    setHistory(newHistory);
    localStorage.setItem('fakey_history', JSON.stringify(newHistory));
  };

  const handleUpload = useCallback(async (file: File) => {
    setCurrentView(View.PROCESSING);
    setError(null);
    const metadata = { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB', type: file.type, preview: URL.createObjectURL(file) };
    try {
      const result = await analyzeMedia(file, metadata);
      setAnalysisResult(result);
      saveToHistory(result);
      setCurrentView(View.RESULTS);
    } catch (err) {
      setError("Analysis Pipeline Failed.");
      setCurrentView(View.HOME);
    }
  }, [history]);

  const reset = () => {
    setCurrentView(View.HOME);
    setAnalysisResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col selection:bg-neon selection:text-black font-sans relative">
      <BackgroundGraphics />
      
      <header className="fixed top-0 inset-x-0 h-24 z-[50] pointer-events-none flex items-center px-10 print:hidden">
        <button 
          onClick={() => setSidebarExpanded(true)} 
          className="pointer-events-auto flex items-center justify-center group bg-surface w-14 h-14 rounded-xl border border-border hover:border-neon transition-all shadow-xl"
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-6 h-[2.5px] bg-white group-hover:bg-neon transition-colors"></div>
            <div className="w-6 h-[2.5px] bg-white group-hover:bg-neon transition-colors"></div>
            <div className="w-4 h-[2.5px] bg-white group-hover:bg-neon transition-colors self-start"></div>
          </div>
        </button>
      </header>

      <Sidebar 
        currentView={currentView} 
        onNavigate={(v) => setCurrentView(v)} 
        onReset={reset} 
        expanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        privacyMode={privacyMode} 
        setPrivacyMode={setPrivacyMode} 
      />

      <div className="flex-grow flex flex-col relative z-10 overflow-y-auto no-scrollbar pt-0">
        {currentView === View.HOME && (
          <div className="absolute top-8 right-12 z-20 hidden md:block">
            <Logo size="md" onClick={reset} />
          </div>
        )}

        <main className="flex-grow container mx-auto px-6 md:px-12 pt-6 pb-24 max-w-6xl">
          {currentView === View.HOME && (
            <div className="space-y-32">
              <section id="hero-flow">
                <Hero />
                <TrustStrip />
              </section>
              
              <div className="max-w-4xl mx-auto space-y-48">
                <UploadZone onUpload={handleUpload} />

                {error && (
                  <div className="p-10 bg-red-950 border border-red-500 rounded-2xl flex items-center gap-8 text-red-500 animate-in shake duration-500 shadow-2xl">
                    <svg className="w-12 h-12 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm mb-1">Critical Pipeline Failure</h4>
                      <p className="text-sm opacity-60 font-mono">{error}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <QuickToolCard 
                    title="Batch Processing" 
                    description="Verify multiple suspected files simultaneously." 
                    icon="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25" 
                    color="text-neon" 
                    onClick={() => setCurrentView(View.BATCH_TRIAGE)} 
                  />
                   <QuickToolCard 
                    title="Source Finder" 
                    description="Identify content origins and check for unauthorized changes." 
                    icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    color="text-neon" 
                    onClick={() => setCurrentView(View.REVERSE_GROUNDING)} 
                  />
                </div>

                <HowItWorks />
                <ForensicDeepDive />
                <ResultsPreview />
              </div>
            </div>
          )}

          {currentView === View.PROCESSING && <ProcessingScreen />}
          {currentView === View.RESULTS && analysisResult && <ResultsScreen result={analysisResult} onReupload={reset} onOpenReport={() => setCurrentView(View.JUDICIAL_REPORT)} onOpenTimeline={() => setCurrentView(View.FORENSIC_TIMELINE)} />}
          {currentView === View.JUDICIAL_REPORT && analysisResult && <JudicialReport result={analysisResult} onBack={() => setCurrentView(View.RESULTS)} />}
          {currentView === View.BATCH_TRIAGE && <BatchTriage onBack={reset} onResultSelect={(res) => { setAnalysisResult(res); setCurrentView(View.RESULTS); }} />}
          {currentView === View.REVERSE_GROUNDING && <ReverseGrounding onBack={reset} />}
          {currentView === View.TEXT_LAB && <TextInterrogator onBack={reset} />}
          {currentView === View.LIVE && <LiveScanner onBack={reset} onResult={(res) => { setAnalysisResult(res); saveToHistory(res); setCurrentView(View.RESULTS); }} />}
          {currentView === View.HISTORY && <HistoryPanel history={history} onSelect={(res) => { setAnalysisResult(res); setCurrentView(View.RESULTS); }} />}
          {currentView === View.SIGNAL_LIBRARY && <SignalLibrary />}
        </main>
      </div>

      <FloatingAssistant currentView={currentView} analysisResult={analysisResult} />
    </div>
  );
};

const QuickToolCard: React.FC<{title: string, description: string, icon: string, color: string, onClick: () => void}> = ({ title, description, icon, color, onClick }) => (
  <button 
    onClick={onClick} 
    className="bento-card group p-12 text-left overflow-hidden relative border-border bg-surface"
  >
    <div className={`w-16 h-16 rounded-2xl bg-surfaceLight flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ${color} group-hover:shadow-[0_0_20px_rgba(0,255,136,0.2)]`}>
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
    <h3 className="font-black text-3xl mb-4 tracking-tighter italic uppercase text-white">
      {title.split(' ')[0]} <span className="text-white/20 group-hover:text-neon transition-colors">{title.split(' ')[1] || ''}</span>
    </h3>
    <p className="text-white/40 text-base leading-relaxed font-light group-hover:text-white transition-colors duration-300">{description}</p>
    
    <div className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-neon transition-colors duration-300">
      Launch Terminal
      <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
    </div>
    
    <div className="absolute inset-0 bg-neon/10 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
  </button>
);

export default App;
