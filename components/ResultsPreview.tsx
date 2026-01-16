
import React from 'react';

const ResultsPreview: React.FC = () => {
  return (
    <section className="py-24 relative overflow-visible animate-reveal" style={{ animationDelay: '2200ms' }}>
      <div className="absolute inset-0 bg-neon/[0.02] rounded-[4rem] blur-[120px] pointer-events-none"></div>
      
      <div className="relative bg-[#121212] border border-border rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center gap-16 shadow-3xl">
        <div className="max-w-3xl space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-neon uppercase tracking-[0.5em]">Forensic Insights</h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              Transparent Scoring. <br />
              <span className="text-white/40">No Black Box.</span>
            </h2>
            <p className="text-lg text-white/40 font-normal leading-relaxed">
              Every analysis generates a granular breakdown of signals. We provide the evidence so you can trust the conclusion. Our scoring is 100% explainable, mapping every artifact detected to a specific forensic risk.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 pt-6">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Avg Processing</p>
              <p className="text-3xl font-bold text-white/90">~8.4s</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Confidence</p>
              <div className="flex items-center gap-2 animate-pulse-soft">
                <span className="w-2 h-2 bg-neon rounded-full shadow-neon"></span>
                <p className="text-3xl font-bold text-neon">98.4%</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Signal Nodes</p>
              <p className="text-3xl font-bold text-white/90">2,400+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsPreview;
