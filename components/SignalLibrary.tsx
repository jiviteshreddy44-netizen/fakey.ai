
import React from 'react';

const forensicModules = [
  {
    title: "Pixel Analysis Core",
    desc: "Our engine breaks visuals down to their raw pixel structure to detect manipulation at its origin. No matter how subtle the alteration, pixel-level forensics brings it to light.",
    tag: "Visual",
    code: "PX FORENSIC"
  },
  {
    title: "Structural Check",
    desc: "Analyzes every technical signature inside the file container, from codecs to timestamps. These markers reveal manipulation paths invisible in the visual or audio layers alone.",
    tag: "Technical",
    code: "INTEGRITY"
  },
  {
    title: "Voice Analysis",
    desc: "Analyzes the raw audio spectrum to uncover artifacts left by synthesis and manipulation. Even the most natural-sounding cloned voices reveal hidden acoustic inconsistencies.",
    tag: "Audio",
    code: "VOICE SIG"
  },
  {
    title: "Detailed Report Engine",
    desc: "Delivers a complete, auditable record of every analysis performed. Designed for formal environments, it ensures findings are transparent and clear.",
    tag: "Documentation",
    code: "LAW CERT"
  },
  {
    title: "Useful Intelligence",
    desc: "Goes beyond simple yes/no. Provides detailed reports with confidence scores, visual indicators, and audit trails to help users understand precisely why content was flagged.",
    tag: "Findings",
    code: "ANALYSIS"
  },
  {
    title: "Neural Suite",
    desc: "Leverages a layered approach that analyzes visuals, file structure, metadata, and audio signals to ensure higher accuracy and robust adaptability against evolving threats.",
    tag: "Security",
    code: "AUTO AI"
  }
];

const SignalLibrary: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-border pb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Verification <span className="text-neon">Methods</span></h2>
            <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">Protocols and Methodology</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-neon bg-neon/10 px-4 py-1.5 rounded-full border border-neon/40 shadow-neon-low uppercase tracking-[0.2em]">Secure Protocol v4</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forensicModules.map((sig, idx) => (
            <div 
              key={idx} 
              className="relative p-8 bg-[#121212] border border-border rounded-[2.5rem] hover:border-neon/40 transition-all group overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="font-mono text-[60px] font-black italic">{idx + 1}</span>
              </div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <span className="text-[9px] font-black text-neon uppercase tracking-[0.4em] px-3 py-1 bg-neon/5 border border-neon/20 rounded-lg">
                  {sig.tag}
                </span>
                <span className="text-[8px] font-mono text-white/10 group-hover:text-white/30 transition-colors uppercase">
                  {sig.code}
                </span>
              </div>

              <h4 className="text-xl font-black text-white/90 mb-4 group-hover:text-white transition-colors italic uppercase tracking-tight">
                {sig.title}
              </h4>
              <p className="text-sm text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors">
                {sig.desc}
              </p>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon/60"></div>
                </div>
                <span className="text-[8px] font-black text-white/10 uppercase tracking-widest group-hover:text-neon/40 transition-colors">Verified Methods</span>
              </div>
            </div>
          ))}
       </div>

       <div className="p-12 bg-[#121212] border border-border rounded-[3rem] text-center space-y-6 shadow-2xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Statement of Accuracy</h3>
          <p className="text-white/40 text-sm max-w-3xl mx-auto italic font-light leading-relaxed">
            "Our solution goes beyond surface-level detection, using a layered approach that analyzes visuals, file structure, metadata, and audio signals to uncover even sophisticated changes. By combining multiple techniques, we ensure higher accuracy and low false positives, delivering clear insights for every analysis."
          </p>
       </div>
    </div>
  );
};

export default SignalLibrary;
