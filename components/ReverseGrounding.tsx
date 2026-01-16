
import React, { useState, useRef } from 'react';
import { reverseSignalGrounding } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';
import { 
  ArrowLeft, 
  Search, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Fingerprint, 
  Maximize2,
  Share2,
  RefreshCcw,
  Layers,
  FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReverseGrounding: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleRunSearch = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const data = await reverseSignalGrounding(file);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTrace = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {!result && !isLoading ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-grow flex flex-col max-w-4xl mx-auto w-full justify-center py-12"
          >
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">Source <span className="text-neon">Finder</span></h2>
              <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">Identify original content origins</p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative p-1 bg-surface border-2 border-dashed border-border rounded-[3rem] transition-all hover:border-neon shadow-2xl overflow-hidden cursor-pointer"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              
              <div className="p-16 flex flex-col items-center gap-10">
                {preview ? (
                  <div className="relative w-72 aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
                    <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-surfaceLight border border-border flex items-center justify-center text-white/10 group-hover:text-neon group-hover:shadow-neon-low transition-all">
                    <Search size={40} />
                  </div>
                )}

                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">Locate Original Source</h3>
                  <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed italic">
                    Search global archives to find where this media first appeared and check for changes.
                  </p>
                </div>

                {file && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRunSearch(); }}
                    className="px-14 py-5 bg-white text-black font-black rounded-2xl hover:bg-neon transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs shadow-xl flex items-center gap-3"
                  >
                    <Globe size={16} />
                    Start Search
                  </button>
                )}
              </div>
            </div>
            
            <button onClick={onBack} className="mt-8 mx-auto text-white/30 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} />
              Back to Home
            </button>
          </motion.div>
        ) : isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex flex-col items-center justify-center"
          >
            <NeuralLoader label="Searching for origins" />
            <div className="mt-10 grid grid-cols-3 gap-8 w-full max-w-xl opacity-20">
              <div className="h-px bg-white"></div>
              <div className="h-px bg-white"></div>
              <div className="h-px bg-white"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col gap-8 w-full"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="lg:w-1/3 bg-surface border border-border rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em]">Input Media</span>
                  <div className="flex gap-2">
                    <Maximize2 size={14} className="text-white/20 hover:text-white cursor-pointer" />
                  </div>
                </div>

                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-black">
                  <img src={preview!} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="Evidence" />
                  <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5"></div>
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-neon/30 animate-scan-sweep-fast shadow-neon"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-charcoal border border-border rounded-xl">
                    <span className="text-[8px] font-black text-white/20 uppercase block mb-1">Confidence</span>
                    <span className="text-2xl font-black italic text-neon">{result.confidence}%</span>
                  </div>
                  <div className="p-4 bg-charcoal border border-border rounded-xl">
                    <span className="text-[8px] font-black text-white/20 uppercase block mb-1">Integrity</span>
                    <span className={`text-2xl font-black italic ${result.manipulationDetected ? 'text-red-500' : 'text-emerald-500'}`}>
                      {result.manipulationDetected ? 'LOW' : 'HIGH'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Fingerprint size={16} className="text-white/20" />
                    <span className="text-[9px] font-mono text-white/30 truncate uppercase tracking-widest">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={resetTrace}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon hover:text-black transition-all"
                  >
                    <RefreshCcw size={12} />
                    New Search
                  </button>
                </div>
              </div>

              <div className="lg:w-2/3 flex flex-col gap-8">
                <div className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex-grow">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Globe size={180} />
                  </div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${result.manipulationDetected ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {result.manipulationDetected ? <AlertCircle size={24} /> : <ShieldCheck size={24} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight">Origin Report</h3>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{result.originalEvent || 'DETECTED CONTEXT'}</p>
                      </div>
                    </div>

                    <p className="text-2xl font-light italic leading-relaxed text-white/90 max-w-3xl">
                      "{result.summary}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      {result.findings?.map((f: any, i: number) => (
                        <div key={i} className="flex gap-4 p-5 bg-charcoal/50 border border-border rounded-2xl">
                          <Layers size={18} className="text-neon shrink-0 mt-1" />
                          <div>
                            <span className="text-[10px] font-black uppercase text-white/30 block mb-1">{f.type}</span>
                            <p className="text-sm text-white/60 italic leading-relaxed">{f.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <FileSearch size={20} className="text-neon" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Verified Matches</h4>
                    </div>
                    <span className="px-3 py-1 bg-neon/10 border border-neon/20 rounded-full text-[9px] font-black text-neon uppercase">{result.sources?.length || 0} Sources</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.sources?.map((s: any, i: number) => (
                      <a 
                        key={i} 
                        href={s.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-6 bg-charcoal border border-border rounded-2xl flex items-center justify-between group hover:border-neon hover:bg-neon/5 transition-all shadow-lg"
                      >
                        <div className="space-y-1 overflow-hidden pr-4">
                          <p className="font-bold text-white/90 group-hover:text-white truncate">{s.title}</p>
                          <p className="text-[10px] font-mono text-white/20 truncate">{s.url}</p>
                        </div>
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-all">
                          <ExternalLink size={16} />
                        </div>
                      </a>
                    ))}
                    {(!result.sources || result.sources.length === 0) && (
                      <div className="col-span-2 py-10 text-center border border-dashed border-border rounded-2xl text-white/10 uppercase text-[10px] tracking-[0.3em]">
                        No external matches found in current archives
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-grow py-5 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-neon transition-all shadow-xl flex items-center justify-center gap-3">
                    <Share2 size={16} />
                    Share Results
                  </button>
                  <button onClick={resetTrace} className="flex-grow py-5 bg-surface border border-border text-white/40 font-black rounded-2xl text-xs uppercase tracking-widest hover:text-white hover:border-white transition-all">
                    New Investigation
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan-sweep-fast {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-sweep-fast {
          animation: scan-sweep-fast 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ReverseGrounding;
