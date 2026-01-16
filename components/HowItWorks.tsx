
import React, { useState } from 'react';

const steps = [
  {
    id: 1,
    title: "1. Media Ingestion",
    short: "Secure uplink and forensic-grade sandboxing.",
    full: "We immediately isolate the file within an encrypted pipeline, stripping proprietary metadata to prevent bias and ensuring the neural core only analyzes the raw signal components.",
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
  },
  {
    id: 2,
    title: "2. Integrity Analysis",
    short: "Structural signatures and codec forensics.",
    full: "Our engine isolates frequency domain anomalies and GAN artifacts characteristic of synthetic media generation, scanning for hidden manipulation paths invisible to the human eye.",
    icon: "M10 21h4m-4-4h4m-4-4h4M6 21h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
  },
  {
    id: 3,
    title: "3. Neural Patterning",
    short: "Biometric symmetry and acoustic spectral analysis.",
    full: "We verify the physics of light on skin (subsurface scattering) and vocal frequencies. Our system analyzes raw spectra to uncover hidden inconsistencies in cloned voices and synthetic textures.",
    icon: "M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.618a3.323 3.323 0 01-4.016 4.016 3.323 3.323 0 00-4.016-4.016a3.323 3.323 0 014.016-4.016 3.323 3.323 0 004.016 4.016 3.323 3.323 0 014.016-4.016"
  },
  {
    id: 4,
    title: "4. Actionable Report",
    short: "Generating court-ready auditable documentation.",
    full: "Every analysis delivers a complete forensic record with confidence scores and explainability tools. Designed for judicial environments, ensuring findings are transparent and admissible.",
    icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 9v2m0 4h.01"
  }
];

const HowItWorks: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <section className="space-y-16 py-12">
      <div className="space-y-4 text-center">
        <h3 className="text-[10px] font-bold text-neon uppercase tracking-[0.5em]">Forensic Protocol</h3>
        <h2 className="text-4xl font-bold tracking-tight">How Verification Works</h2>
        <p className="text-white/40 text-sm max-w-lg mx-auto">A multi-layered approach combining pixel-level forensics with structural file analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <div 
            key={step.id}
            onClick={() => setExpanded(expanded === step.id ? null : step.id)}
            className={`group p-10 bg-[#121212] border ${expanded === step.id ? 'border-neon bg-[#1A1A1A]' : 'border-border'} rounded-[2.5rem] transition-all duration-500 hover:bg-[#1A1A1A] cursor-pointer animate-reveal`}
            style={{ animationDelay: `${1100 + idx * 150}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-grow">
                <div className={`w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 text-white/30 ${expanded === step.id ? 'text-neon' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.icon} />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold transition-colors group-hover:text-white uppercase italic tracking-tight">{step.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{step.short}</p>
              </div>
              
              <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-500 shrink-0 mt-1 ${expanded === step.id ? 'bg-neon text-black rotate-180' : 'text-white/20'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            
            <div className={`accordion-content ${expanded === step.id ? 'open' : ''}`}>
              <div className="accordion-inner">
                <p className="text-white/60 text-sm leading-relaxed border-t border-border pt-8 mt-8 italic">
                  "{step.full}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
