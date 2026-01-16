
import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';

interface TextInterrogatorProps {
  onBack: () => void;
}

const TextInterrogator: React.FC<TextInterrogatorProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'AI_DETECT' | 'FACT_CHECK'>('AI_DETECT');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleInterrogate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await analyzeText(text, mode);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictStyles = (label: any = "") => {
    const l = (label || "").toString().toLowerCase();
    if (l.includes('human') || l.includes('real') || l.includes('supported')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20 shadow-emerald-500/10';
    if (l.includes('ai') || l.includes('fake') || l.includes('disputed')) return 'text-red-500 border-red-500/30 bg-red-950/20 shadow-red-500/10';
    return 'text-yellow-500 border-yellow-500/30 bg-yellow-950/20 shadow-yellow-500/10';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button onClick={onBack} className="text-white/30 hover:text-neon mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Terminal Home
          </button>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Text <span className="text-neon">Lab</span></h2>
          <p className="text-white/40 text-sm font-sans mt-1 uppercase tracking-widest">Text Analysis and Fact Check</p>
        </div>
        <div className="flex bg-[#080808] p-1.5 rounded-2xl border border-border shadow-xl">
          <button 
            onClick={() => { setMode('AI_DETECT'); setResult(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all tracking-widest ${mode === 'AI_DETECT' ? 'bg-neon text-black shadow-neon scale-105' : 'text-white/40 hover:text-white'}`}
          >
            AI DETECTION
          </button>
          <button 
            onClick={() => { setMode('FACT_CHECK'); setResult(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all tracking-widest ${mode === 'FACT_CHECK' ? 'bg-neon text-black shadow-neon scale-105' : 'text-white/40 hover:text-white'}`}
          >
            TRUTH CHECK
          </button>
        </div>
      </header>

      <section className="space-y-6">
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-neon/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700 pointer-events-none"></div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder={mode === 'AI_DETECT' ? "Paste writing to analyze for artificial signals..." : "Paste a claim or article to verify against known facts..."}
            className="relative w-full h-80 bg-[#0a0a0a] border border-border rounded-[2.5rem] p-10 text-white placeholder:text-white/10 focus:border-neon focus:ring-1 focus:ring-neon/30 outline-none transition-all font-sans text-lg leading-relaxed resize-none shadow-2xl disabled:opacity-50"
          />
        </div>

        {!isLoading ? (
          <button 
            onClick={handleInterrogate}
            disabled={!text.trim()}
            className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-neon transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-20 uppercase tracking-[0.2em] text-sm shadow-2xl flex items-center justify-center gap-4 group"
          >
            {mode === 'AI_DETECT' ? 'Scan Text Patterns' : 'Verify Fact Sources'}
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        ) : (
          <div className="flex flex-col items-center py-10 animate-in fade-in zoom-in-95 duration-500">
             <NeuralLoader label={mode === 'AI_DETECT' ? 'Analyzing patterns' : 'Searching sources'} />
          </div>
        )}
      </section>

      {result && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-10 duration-700">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-10 bg-surface border border-border rounded-[2.5rem] space-y-8 shadow-2xl">
              <div className="text-center">
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-4">Verification Score</p>
                <div className="relative inline-flex items-center justify-center mb-6">
                   <span className={`text-8xl font-black tracking-tighter italic ${getVerdictStyles(result.verdictLabel || 'UNCERTAIN').split(' ')[0]}`}>
                     {result.aiProbability ?? result.confidence ?? '??'}%
                   </span>
                </div>
                <div className={`py-4 rounded-2xl border-2 font-black text-xs tracking-[0.3em] uppercase shadow-lg ${getVerdictStyles(result.verdictLabel || 'UNCERTAIN')}`}>
                  {result.verdictLabel || 'NEURAL PROBABILITY'}
                </div>
              </div>
              
              {mode === 'AI_DETECT' && (
                <div className="space-y-6 border-t border-white/5 pt-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Synthetic Markers</p>
                    <div className="flex flex-wrap gap-2">
                      {(result.aiSignals || []).map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-red-950/40 border border-red-500/20 rounded-xl text-[10px] text-red-400 font-bold uppercase tracking-tighter">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="p-12 bg-surface border border-border rounded-[3rem] space-y-10 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-neon rounded-full animate-pulse shadow-neon"></div>
                   <h3 className="text-xl font-black tracking-tight uppercase italic">Summary</h3>
                </div>
                <p className="text-white/80 leading-relaxed font-light text-xl italic">"{result.summary}"</p>
              </div>

              {result.claims && Array.isArray(result.claims) && result.claims.length > 0 && (
                <div className="space-y-6 pt-10 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Text Claim Analysis</h4>
                  <div className="grid gap-4">
                    {result.claims.map((c: any, i: number) => (
                      <div key={i} className="p-6 bg-charcoal border border-border rounded-2xl flex flex-col md:flex-row gap-6 justify-between group hover:border-neon/20 transition-all">
                        <div className="space-y-3">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-md border uppercase ${getVerdictStyles(c.status)}`}>
                            {(c.status || 'unknown').replace('_', ' ')}
                          </span>
                          <p className="text-base font-bold text-white/90">{c.claim}</p>
                          {c.sourceUrl && (
                            <a href={c.sourceUrl} target="_blank" className="text-[10px] text-neon hover:underline inline-flex items-center gap-2 font-black uppercase tracking-widest">
                              Evidence Source
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.sources && Array.isArray(result.sources) && result.sources.length > 0 && (
                <div className="space-y-6 pt-10 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Verified Citations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.sources.map((s: any, i: number) => (
                      <a key={i} href={s.url} target="_blank" className="p-4 bg-charcoal border border-border rounded-xl hover:bg-surface transition-colors flex items-center justify-between group">
                        <div className="truncate">
                          <p className="text-xs font-bold text-white/80 truncate group-hover:text-neon">{s.title}</p>
                          <p className="text-[9px] text-white/30 truncate font-mono">{s.url}</p>
                        </div>
                        <svg className="w-4 h-4 text-white/20 group-hover:text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInterrogator;
