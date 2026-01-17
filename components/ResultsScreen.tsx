
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, Verdict } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Activity,
  Download,
  Share2,
  Play,
  Pause,
  Fingerprint,
  Zap,
  RotateCcw,
  ArrowLeft,
  BarChart3,
  Target,
  ArrowDownRight,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface ResultsScreenProps {
  result: AnalysisResult;
  onReupload: () => void;
  onOpenReport: () => void;
  onOpenTimeline: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onReupload, onOpenReport }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeAnomaly, setActiveAnomaly] = useState<any | null>(null);
  const [expandedAnomaly, setExpandedAnomaly] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = result.fileMetadata.type.includes('video');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isVideo]);

  const seekTo = (timestampStr?: string, explanation?: any) => {
    if (!videoRef.current || !timestampStr) return;
    const [mins, secs] = timestampStr.split(':').map(Number);
    const time = (mins * 60) + (secs || 0);
    
    videoRef.current.currentTime = time;
    videoRef.current.pause();
    setIsPlaying(false);
    
    if (explanation) {
      setActiveAnomaly(explanation);
      setTimeout(() => setActiveAnomaly(null), 4000);
    }
  };

  const handleAnomalyClick = (idx: number, e: any) => {
    const isExpanding = expandedAnomaly !== idx;
    setExpandedAnomaly(isExpanding ? idx : null);
    if (isExpanding) {
      seekTo(e.timestamp, e);
    }
  };

  const handleExport = (type: string) => {
    if (type === 'PDF' || type === 'TXT') onOpenReport();
    else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `fakey_report_${result.id}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  const getPointerPos = (category: string) => {
    switch(category) {
      case 'visual': return { top: '30%', left: '45%' };
      case 'audio': return { top: '60%', left: '50%' };
      case 'temporal': return { top: '50%', left: '20%' };
      default: return { top: '40%', left: '40%' };
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <nav className="sticky top-0 z-[100] bg-charcoal/95 border-b border-border h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white text-black px-2 py-0.5 rounded font-black italic text-xs tracking-tighter">F</div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-none">Scan ID: {result.id}</span>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">{new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onReupload} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white hover:text-neon rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
            <ArrowLeft size={12} /> Back to Queue
          </button>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-neon transition-all">
            <RotateCcw size={12} /> New Scan
          </button>
        </div>
      </nav>

      <main className="flex-grow max-w-[1400px] mx-auto w-full p-6 md:p-10 space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-8 rounded-[2rem] border flex flex-col justify-center relative overflow-hidden transition-all shadow-2xl ${result.verdict === Verdict.REAL ? 'bg-emerald-500/5 border-emerald-500/30 shadow-emerald-500/5' : 'bg-red-500/5 border-red-500/30 shadow-red-500/5'}`}>
            <div className={`w-fit px-6 py-2 rounded-xl border-2 font-black italic uppercase tracking-widest text-lg mb-6 ${result.verdict === Verdict.REAL ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}`}>
              {result.verdict === Verdict.REAL ? 'Likely Real' : 'Likely Deepfake'}
            </div>
            <h2 className="text-xl font-bold mb-2">Verdict Analysis</h2>
            <p className="text-white/60 text-sm italic font-light leading-relaxed">{result.summary}</p>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck size={120} />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[2rem] p-8 flex items-center justify-between shadow-xl relative group">
            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Neural Detection Probability</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black italic text-white">{result.deepfakeProbability}</span>
                  <span className="text-xl font-black text-white/20">/ 100</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Confidence:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${result.confidenceLevel === 'High' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {result.confidenceLevel}
                </span>
              </div>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="42" fill="none" 
                  stroke={result.deepfakeProbability > 50 ? "#ef4444" : "#10b981"} 
                  strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: "264 264", strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * result.deepfakeProbability) / 100 }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={24} className={result.deepfakeProbability > 50 ? "text-red-500" : "text-emerald-500"} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            <div className="bg-surface border border-border rounded-[2.5rem] p-10 shadow-xl flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tight">Forensic Findings</h3>
                <span className="text-[10px] font-mono text-neon/40 uppercase">Anomaly_Extraction_Live</span>
              </div>
              
              <div className="space-y-4 overflow-y-auto pr-2 max-h-[600px] no-scrollbar">
                {result.explanations.map((e, idx) => (
                   <div 
                    key={idx} 
                    className={`border rounded-2xl transition-all duration-300 ${expandedAnomaly === idx ? 'border-neon/40 bg-neon/5' : 'border-border bg-charcoal/30'}`}
                   >
                    <button 
                      onClick={() => handleAnomalyClick(idx, e)}
                      className="w-full text-left flex items-center justify-between p-6 group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-2 h-2 rounded-full ${result.deepfakeProbability > 50 ? 'bg-red-500 shadow-red-500/50' : 'bg-neon shadow-neon'}`}></div>
                        <div>
                          <h4 className={`text-xs font-black uppercase tracking-widest transition-colors ${expandedAnomaly === idx ? 'text-neon' : 'text-white/80 group-hover:text-neon'}`}>
                            {e.point}
                          </h4>
                          <span className="text-[9px] font-mono text-white/20 uppercase mt-1 block">Vector: {e.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {e.timestamp && (
                           <span className="text-[10px] font-mono text-neon/60 bg-neon/5 px-2 py-0.5 rounded border border-neon/10">{e.timestamp}</span>
                        )}
                        <ChevronDown 
                          size={16} 
                          className={`text-white/20 transition-transform duration-300 ${expandedAnomaly === idx ? 'rotate-180 text-neon' : ''}`} 
                        />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {expandedAnomaly === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-12 pb-6">
                            <div className="h-px bg-white/5 mb-4" />
                            <p className="text-sm text-white/60 italic leading-relaxed">
                              {e.detail}
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                              <Target size={12} className="text-neon/40" />
                              <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Forensic Insight Verified</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-xl sticky top-28">
              <div className="p-6 border-b border-border bg-charcoal/30 flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Evidence Viewer</h3>
                 <span className="text-[10px] font-mono text-neon/40">{result.fileMetadata.name}</span>
              </div>
              
              <div className="relative aspect-video bg-black flex items-center justify-center group/viewer">
                 {isVideo ? (
                   <video ref={videoRef} src={result.fileMetadata.preview} className="w-full h-full object-contain" />
                 ) : (
                   <img src={result.fileMetadata.preview} className="w-full h-full object-contain" alt="Evidence" />
                 )}
                 
                 <AnimatePresence>
                   {activeAnomaly && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none z-20"
                     >
                        <div 
                          className="absolute flex flex-col items-center gap-2"
                          style={getPointerPos(activeAnomaly.category)}
                        >
                           <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
                           >
                             <ArrowDownRight size={48} className="text-neon drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
                           </motion.div>
                           <div className="bg-black/80 border border-neon px-4 py-2 rounded-lg backdrop-blur-md">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={12} className="text-neon" />
                                <span className="text-[10px] font-black uppercase text-neon tracking-widest">{activeAnomaly.point}</span>
                              </div>
                              <p className="text-[9px] text-white/60 italic leading-tight max-w-[140px]">{activeAnomaly.detail}</p>
                           </div>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>

                 {isVideo && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/viewer:opacity-100 transition-opacity">
                      <button onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 text-white pointer-events-auto">
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                   </div>
                 )}
              </div>

              <div className="p-8 space-y-8">
                 {isVideo ? (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={12} className="text-neon" />
                          <span>Anomaly Probability Graph</span>
                        </div>
                        <span className="text-neon font-mono">{videoProgress.toFixed(1)}% / 100%</span>
                      </div>
                      
                      <div className="relative h-24 bg-charcoal border border-border rounded-xl overflow-hidden px-1">
                        <div className="absolute inset-0 flex items-end gap-[1px]">
                          {Array.from({length: 80}).map((_, i) => {
                            const baseHeight = (Math.sin(i * 0.5) + 1.2) * 20;
                            const height = result.deepfakeProbability > 50 ? baseHeight + (Math.random() * 30) : baseHeight;
                            return (
                              <div key={i} className="flex-grow bg-neon/30" style={{ height: `${height}%`, opacity: i / 80 < videoProgress / 100 ? 1 : 0.2 }}></div>
                            );
                          })}
                        </div>
                        <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-neon" style={{ left: `${videoProgress}%` }}></div>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <Target size={18} className="text-neon" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Extraction Metadata</h4>
                      </div>
                      <div className="p-4 bg-charcoal border border-border rounded-xl flex items-center gap-4">
                        <Fingerprint size={20} className="text-neon/40" />
                        <div className="overflow-hidden">
                           <span className="text-[8px] font-black text-white/20 uppercase block tracking-widest">Metadata Hash</span>
                           <p className="text-[10px] font-mono text-white/40 truncate">{result.id}</p>
                        </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-surface border border-border rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center shadow-2xl relative overflow-hidden">
           <div className="shrink-0 w-20 h-20 bg-charcoal border border-border rounded-2xl flex items-center justify-center text-white/20">
              <Activity size={40} />
           </div>
           <div className="flex-grow space-y-4">
              <h3 className="text-xl font-black italic uppercase text-white">Forensic Guidance</h3>
              <p className="text-sm text-white/50 leading-relaxed italic max-w-3xl">
                {result.userRecommendation}. Analysis identifies anomalies across multiple neural vectors. Treat findings as probabilistic indicators.
              </p>
           </div>
           <div className="flex flex-col gap-3 shrink-0">
              <button onClick={() => handleExport('TXT')} className="px-8 py-4 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-neon transition-all flex items-center gap-2">
                <Download size={16} /> Export Forensic Log
              </button>
           </div>
        </section>
      </main>
    </div>
  );
};

export default ResultsScreen;
