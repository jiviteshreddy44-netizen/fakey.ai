
import React from 'react';

const NeuralLoader: React.FC<{ label?: string }> = ({ label = "Analysing digital patterns" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative w-24 h-24">
        {/* Layered Hex-Grid Loader */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin duration-[4000ms]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-30">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="var(--neon)" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute inset-2 flex items-center justify-center animate-spin-reverse duration-[3000ms]">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-60">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="var(--neon)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="absolute inset-4 flex items-center justify-center animate-spin duration-[2000ms]">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="var(--neon)" strokeWidth="2" strokeDasharray="10, 5" />
          </svg>
        </div>
        
        {/* Core pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-neon rounded-full animate-pulse shadow-neon"></div>
        </div>
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] animate-pulse">
          {label}
        </p>
        <div className="flex justify-center gap-1">
          <div className="w-1 h-1 bg-neon/20 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-neon/40 rounded-full animate-bounce delay-100"></div>
          <div className="w-1 h-1 bg-neon/60 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NeuralLoader;
