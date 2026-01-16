
import React, { useState } from 'react';
import { generateSyntheticImage, generateSyntheticVideo } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';

const RedTeamLab: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResultUrl(null);
    setStatus(mode === 'IMAGE' ? "Synthesizing Pixel Tensors..." : "Initiating Temporal Sequence...");

    try {
      if (mode === 'IMAGE') {
        const url = await generateSyntheticImage(prompt, aspectRatio);
        setResultUrl(url);
      } else {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
        setStatus("Video generation in progress... this may take 1-2 minutes.");
        const url = await generateSyntheticVideo(prompt);
        setResultUrl(url);
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        setStatus("API KEY ERROR: Please select a valid paid project key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setStatus("SYNTHESIS_FAILED: Pipeline interrupted.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button onClick={onBack} className="text-white/30 hover:text-neon mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Terminal Home
          </button>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Red-Team <span className="text-neon">Lab</span></h2>
          <p className="text-white/40 text-sm font-mono mt-1 uppercase tracking-widest">Neural_Synthesis // Red_Team_Testing</p>
        </div>
        <div className="flex bg-surface p-1.5 rounded-2xl border border-border shadow-xl">
          <button 
            onClick={() => { setMode('IMAGE'); setResultUrl(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all tracking-widest ${mode === 'IMAGE' ? 'bg-neon text-black shadow-neon scale-105' : 'text-white/40 hover:text-white'}`}
          >
            IMAGE SYNTHESIS
          </button>
          <button 
            onClick={() => { setMode('VIDEO'); setResultUrl(null); }}
            className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all tracking-widest ${mode === 'VIDEO' ? 'bg-neon text-black shadow-neon scale-105' : 'text-white/40 hover:text-white'}`}
          >
            VIDEO SYNTHESIS
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="p-10 bg-surface border border-border rounded-[2.5rem] space-y-8 shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Synthesis_Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'IMAGE' ? "Describe the synthetic image to generate..." : "Describe the video scene..."}
                className="w-full h-40 bg-black border border-border rounded-2xl p-6 text-white text-sm focus:border-neon outline-none transition-all resize-none font-mono"
              />
            </div>

            {mode === 'IMAGE' && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Aspect_Ratio</label>
                <div className="flex flex-wrap gap-2">
                  {['1:1', '16:9', '9:16', '4:3', '3:4'].map((ratio) => (
                    <button 
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-4 py-2 rounded-lg border text-[10px] font-black transition-all ${aspectRatio === ratio ? 'bg-white text-black border-white' : 'border-border text-white/40 hover:border-white/30'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-neon transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 uppercase tracking-widest text-xs shadow-2xl"
            >
              {isLoading ? "Pipeline Active..." : `Generate ${mode}`}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-grow p-10 bg-surface border border-border rounded-[3rem] flex items-center justify-center relative min-h-[400px] overflow-hidden shadow-2xl">
            {isLoading ? (
              <div className="text-center">
                <NeuralLoader label={status} />
              </div>
            ) : resultUrl ? (
              <div className="w-full h-full flex flex-col items-center gap-6 animate-in zoom-in duration-700">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
                  {mode === 'IMAGE' ? (
                    <img src={resultUrl} className="w-full h-full object-contain" alt="Synthetic Result" />
                  ) : (
                    <video src={resultUrl} controls className="w-full h-full object-contain" />
                  )}
                  <div className="absolute top-4 right-4 bg-black px-3 py-1 rounded-lg border border-border flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-mono text-white/60">SYNTHETIC_SIGNAL</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-20">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Simulation Input</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RedTeamLab;
