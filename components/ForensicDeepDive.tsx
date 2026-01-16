
import React, { useState } from 'react';

const categories = [
  {
    id: 'visual',
    title: "Visual Anomaly Detection",
    detail: "Analyzing 32 specific facial markers for micro-inconsistencies in lighting, texture, and movement. We spot the 'uncanny valley' effects that AI models still struggle to replicate perfectly.",
    metrics: ["Light Bounce", "Symmetry Delta", "Sub-surface Scattering"]
  },
  {
    id: 'audio',
    title: "Audio Fingerprinting",
    detail: "Scanning vocal frequencies for compression artifacts common in text-to-speech models. We verify breathing patterns and phoneme timing which are often omitted by clones.",
    metrics: ["Vocal Jitter", "Formant Stability", "Spectral Leakage"]
  },
  {
    id: 'temporal',
    title: "Temporal Consistency",
    detail: "Frame-by-frame analysis ensures that motion vectors remain logically consistent throughout the duration of the media, catching frame-swaps and stitching artifacts.",
    metrics: ["Optical Flow", "Frame Cohesion", "Drift Analysis"]
  }
];

const ForensicDeepDive: React.FC = () => {
  const [active, setActive] = useState<string | null>('visual');

  return (
    <section className="space-y-8 py-12 animate-reveal" style={{ animationDelay: '1800ms' }}>
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-1/3 space-y-4">
          <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.5em]">Deep Breakdown</h3>
          <h2 className="text-4xl font-bold tracking-tight">Detection Categories</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Our neural forensic suite analyzes content across three primary vectors to ensure a complete verification profile.
          </p>
        </div>
        
        <div className="md:w-2/3 w-full space-y-4">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-500 ${active === cat.id ? 'bg-[#121212] border-accent/40 shadow-xl' : 'bg-transparent border-border hover:border-white/20'}`}
            >
              <button 
                onClick={() => setActive(active === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className={`text-xl font-bold transition-all duration-300 ${active === cat.id ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                  {cat.title}
                </span>
                <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all ${active === cat.id ? 'bg-white text-black rotate-180' : 'text-white/20'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </button>
              
              <div className={`accordion-content ${active === cat.id ? 'open' : ''}`}>
                <div className="accordion-inner p-8 pt-0 space-y-6">
                  <p className="text-white/60 text-base leading-relaxed max-w-xl">
                    {cat.detail}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {cat.metrics.map(m => (
                      <span key={m} className="px-3 py-1.5 bg-[#1A1A1A] border border-border rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/30">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForensicDeepDive;
