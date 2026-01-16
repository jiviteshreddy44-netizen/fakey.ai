
import React from 'react';

interface CTASectionProps {
  onStart: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStart }) => {
  return (
    <section className="py-20 animate-reveal" style={{ animationDelay: '3000ms' }}>
      <div className="bg-[#121212] border border-accent/20 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative shadow-3xl overflow-hidden group">
        <div className="absolute inset-0 bg-accent/[0.02] group-hover:bg-accent/[0.04] transition-all duration-1000"></div>
        
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Restore your trust.</h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            Stop guessing and start verifying. Join the global standard for media forensic integrity.
          </p>
        </div>

        <div className="relative z-10 pt-4">
          <button 
            onClick={onStart}
            className="px-12 py-5 bg-white text-black font-black rounded-xl hover:bg-neon transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 text-sm uppercase tracking-widest"
          >
            Initiate Verification
          </button>
        </div>

        <div className="relative z-10 text-[9px] font-black text-white/10 uppercase tracking-[0.5em] pt-4">
          Secured by Neural Guard
        </div>
      </div>
    </section>
  );
};

export default CTASection;
