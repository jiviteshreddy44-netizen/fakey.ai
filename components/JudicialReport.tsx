
import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { generateForensicCertificate } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';
import { FileText, Download, ArrowLeft } from 'lucide-react';

const JudicialReport: React.FC<{ result: AnalysisResult; onBack: () => void }> = ({ result, onBack }) => {
  const [reportText, setReportText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const content = await generateForensicCertificate(result);
        setReportText(content);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [result]);

  const handleDownloadTxt = () => {
    if (!reportText) return;
    const element = document.createElement("a");
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `FAKEY_ANALYSIS_${result.id}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <header className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <button onClick={onBack} className="text-white/30 hover:text-neon mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Analysis <span className="text-neon">Log</span></h2>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">Detailed evidence export</p>
        </div>
        <button 
          onClick={handleDownloadTxt} 
          className="px-8 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-neon transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
          <Download size={14} />
          Save Text Report
        </button>
      </header>

      {isLoading ? (
        <div className="py-40">
          <NeuralLoader label="Interrogating logs" />
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-border p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden font-mono text-xs leading-relaxed text-white/80">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <FileText size={120} />
          </div>
          <pre className="whitespace-pre-wrap break-words">
            {reportText}
          </pre>
        </div>
      )}

      <footer className="pt-10 text-center opacity-30 text-[10px] font-mono uppercase tracking-[0.5em]">
        End of Transmission
      </footer>
    </div>
  );
};

export default JudicialReport;
