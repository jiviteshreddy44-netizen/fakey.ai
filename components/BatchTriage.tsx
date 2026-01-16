
import React, { useState } from 'react';
import { analyzeMedia, generateForensicCertificate } from '../services/geminiService';
import { AnalysisResult } from '../types';
import NeuralLoader from './NeuralLoader';
import { Download, FileText, Table, ArrowLeft, Trash2, Play } from 'lucide-react';

const BatchTriage: React.FC<{ onBack: () => void; onResultSelect: (res: AnalysisResult) => void }> = ({ onBack, onResultSelect }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleStartTriage = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);
    
    const processedResults: AnalysisResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      setCurrentFileIndex(i);
      const file = files[i];
      try {
        const metadata = { 
          name: file.name, 
          size: (file.size / 1024 / 1024).toFixed(2) + 'MB', 
          type: file.type, 
          preview: URL.createObjectURL(file) 
        };
        const res = await analyzeMedia(file, metadata);
        processedResults.push(res);
        setResults([...processedResults]); // Update UI incrementally
      } catch (e) {
        console.error(`Failed to analyze ${file.name}`, e);
      }
    }
    setIsProcessing(false);
  };

  const exportToExcel = () => {
    if (results.length === 0) return;
    
    const headers = ["ID", "Filename", "Verdict", "Probability", "Confidence", "Summary", "Date"];
    const rows = results.map(r => [
      r.id,
      r.fileMetadata.name,
      r.verdict,
      r.deepfakeProbability,
      r.confidence,
      `"${r.summary.replace(/"/g, '""')}"`,
      new Date(r.timestamp).toISOString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `FAKEY_BATCH_EXPORT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportIndividualLogs = async () => {
    if (results.length === 0) return;
    
    for (const res of results) {
      const log = await generateForensicCertificate(res);
      const blob = new Blob([log], { type: 'text/plain' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `FAKEY_LOG_${res.id}_${res.fileMetadata.name}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Brief delay to prevent browser download queuing issues
      await new Promise(r => setTimeout(r, 200));
    }
  };

  const clearQueue = () => {
    setFiles([]);
    setResults([]);
  };

  const progressPercentage = files.length > 0 ? (results.length / files.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button onClick={onBack} className="text-white/30 hover:text-neon mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} />
            Terminal Home
          </button>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Batch <span className="text-neon">Processing</span></h2>
          <p className="text-white/40 text-sm font-sans mt-1 uppercase tracking-widest">Verify multiple assets at once</p>
        </div>

        {results.length > 0 && !isProcessing && (
          <div className="flex gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <Table size={14} className="text-emerald-500" />
              Export Excel
            </button>
            <button 
              onClick={exportIndividualLogs}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <FileText size={14} className="text-neon" />
              Batch Logs
            </button>
          </div>
        )}
      </header>

      {files.length === 0 ? (
        <div 
          className="p-20 bg-surface border-2 border-dashed border-border rounded-[3rem] text-center space-y-8 cursor-pointer hover:border-neon transition-all group shadow-2xl" 
          onClick={() => document.getElementById('batch-upload')?.click()}
        >
          <input type="file" id="batch-upload" multiple className="hidden" onChange={handleFileChange} />
          <div className="w-20 h-20 bg-surfaceLight border border-border rounded-2xl flex items-center justify-center mx-auto text-white/20 group-hover:text-neon transition-colors shadow-lg">
            <Download size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight italic">Upload Files</h3>
            <p className="text-white/30 text-sm italic">Analyze multiple suspected files simultaneously.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-grow space-y-4 w-full">
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] mb-1 block">Progress</span>
                      <h4 className="text-xl font-bold italic uppercase">{isProcessing ? `Analyzing: ${files[currentFileIndex]?.name}` : 'Ready to process'}</h4>
                   </div>
                   <div className="text-right">
                      <span className="text-3xl font-black italic">{Math.floor(progressPercentage)}%</span>
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{results.length} / {files.length} Done</p>
                   </div>
                </div>
                <div className="h-3 bg-black rounded-full overflow-hidden border border-border p-0.5">
                  <div 
                    className={`h-full bg-neon transition-all duration-500 ease-out shadow-[0_0_15px_rgba(0,255,136,0.5)] ${isProcessing ? 'animate-pulse' : ''}`} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-4 shrink-0">
                {!isProcessing ? (
                  <>
                    <button 
                      onClick={handleStartTriage}
                      className="px-10 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-neon transition-all shadow-xl flex items-center gap-2"
                    >
                      <Play size={14} fill="currentColor" />
                      Start Batch
                    </button>
                    <button 
                      onClick={clearQueue}
                      className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <div className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl">
                    <NeuralLoader label="Processing..." />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] px-4">Files to analyze</span>
            <div className="grid gap-3">
              {files.map((file, i) => {
                const res = results.find(r => r.fileMetadata.name === file.name);
                return (
                  <div 
                    key={i} 
                    onClick={() => res && onResultSelect(res)} 
                    className={`p-6 bg-surface border border-border rounded-2xl flex items-center justify-between transition-all group shadow-lg ${res ? 'hover:border-neon cursor-pointer scale-[0.99] hover:scale-100' : i === currentFileIndex && isProcessing ? 'border-neon/40 animate-pulse' : 'opacity-40'}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-3.5 h-3.5 rotate-45 border-2 transition-all duration-500 ${
                        res ? (res.verdict === 'REAL' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 border-red-500 shadow-[0_0_10px_#ef4444]') : 
                        i === currentFileIndex && isProcessing ? 'bg-neon/20 border-neon' : 'bg-white/5 border-white/10'
                      }`}></div>
                      <div>
                        <p className="font-bold text-white/90 group-hover:text-neon truncate max-w-xs md:max-w-md">{file.name}</p>
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">
                          {res ? `${res.verdict} // SCORE: ${res.deepfakeProbability}%` : 
                           i === currentFileIndex && isProcessing ? 'Analyzing now' : 'Waiting'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {res && (
                        <div className="hidden md:flex flex-col text-right">
                          <span className="text-[8px] font-black text-white/20 uppercase">Confidence</span>
                          <span className="text-[10px] font-bold text-white/60">{res.confidence}%</span>
                        </div>
                      )}
                      {res ? (
                        <ArrowLeft className="w-5 h-5 text-white/10 group-hover:text-neon rotate-180 transition-transform" strokeWidth={3} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/5 border-t-neon animate-spin opacity-20"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchTriage;
