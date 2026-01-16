
import React from 'react';
import { AnalysisResult, Verdict } from '../types';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Recent Intelligence Briefs
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {history.map((item) => (
          <button 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative p-4 bg-zinc-900 border border-white/5 rounded-2xl text-left hover:border-neon/30 transition-all overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${
              item.verdict === Verdict.REAL ? 'bg-emerald-500' : 
              item.verdict === Verdict.LIKELY_FAKE ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            
            <p className="text-[10px] text-white/30 font-mono mb-1">{new Date(item.timestamp).toLocaleDateString()}</p>
            <h4 className="font-bold text-xs truncate text-white/80 group-hover:text-neon">{item.fileMetadata.name}</h4>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.confidence}% Conf</span>
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-neon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                 </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
