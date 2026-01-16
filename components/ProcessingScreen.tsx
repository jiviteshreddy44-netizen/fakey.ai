
import React, { useState, useEffect } from 'react';

const forensicSteps = [
  { id: 'integrity', label: "FILE ANALYSIS", subtext: "SCANNING DIGITAL STRUCTURE" },
  { id: 'biometric', label: "BIOMETRIC CHECK", subtext: "EVALUATING FACIAL SYMMETRY" },
  { id: 'neural', label: "AI DETECTION", subtext: "PROBING SYNTHETIC PATTERNS" },
  { id: 'temporal', label: "FLOW SCAN", subtext: "VERIFYING MOTION CONTINUITY" }
];

const ProcessingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 100 / forensicSteps.length;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 0.4;
        const nextProgress = prev + increment;
        
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          return 99.9;
        }

        const newStep = Math.floor(nextProgress / stepDuration);
        if (newStep !== currentStep && newStep < forensicSteps.length) {
          setCurrentStep(newStep);
        }

        return nextProgress;
      });
    }, 60);

    return () => {
      clearInterval(progressInterval);
    };
  }, [currentStep]);

  const size = 440;
  const center = size / 2;
  const radius = 160;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden animate-in fade-in duration-1000">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-forensic opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.01)_0%,transparent_70%)]"></div>
        
        <div className="absolute top-10 left-10 w-48 space-y-2 opacity-40">
          <div className="h-px w-full bg-gradient-to-r from-neon/40 to-transparent"></div>
          <div className="flex justify-between font-mono text-[8px] tracking-[0.3em] text-white/40 uppercase">
            <span>Uplink</span>
            <span className="text-neon">Encrypted</span>
          </div>
          <div className="font-mono text-[8px] text-white/20">READY FOR ANALYSIS</div>
        </div>

        <div className="absolute bottom-10 right-10 w-48 space-y-2 opacity-40 text-right">
          <div className="font-mono text-[8px] text-white/20">PROGRESS: {progress.toFixed(1)}%</div>
          <div className="flex justify-between font-mono text-[8px] tracking-[0.3em] text-white/40 uppercase">
            <span className="text-neon">Verifying</span>
            <span>Local Node</span>
          </div>
          <div className="h-px w-full bg-gradient-l from-neon/40 to-transparent"></div>
        </div>
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
          <div className="absolute inset-0 border border-white/5 rounded-full animate-spin duration-[60s]"></div>
          
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-white/20 -translate-x-1/2"></div>
          </div>

          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <defs>
              <filter id="glow-processing" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <circle 
              cx={center} cy={center} r={radius} 
              fill="none" 
              stroke="var(--neon)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={circumference - (circumference * progress) / 100}
              style={{ filter: 'url(#glow-processing)', transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative group">
              <span className="text-9xl font-black italic tracking-tighter text-white tabular-nums drop-shadow-2xl">
                {Math.floor(progress)}
              </span>
              <span className="absolute -top-4 -right-6 text-2xl font-black text-white/20">%</span>
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">{forensicSteps[currentStep].subtext}</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-10 animate-in slide-in-from-right-10 duration-1000">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Active Tasks</span>
            <div className="space-y-6">
              {forensicSteps.map((step, idx) => (
                <div key={step.id} className="relative group">
                  <div className={`flex items-center gap-6 transition-all duration-700 ${idx === currentStep ? 'translate-x-2' : idx < currentStep ? 'opacity-40' : 'opacity-20'}`}>
                    <div className="relative">
                      <div className={`w-3.5 h-3.5 rotate-45 border-2 transition-all duration-500 ${
                        idx < currentStep ? 'bg-neon border-neon shadow-neon' : 
                        idx === currentStep ? 'bg-transparent border-neon animate-pulse' : 'bg-transparent border-white/10'
                      }`}></div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-black tracking-widest uppercase transition-colors ${idx === currentStep ? 'text-white' : 'text-white/40'}`}>
                        {step.label}
                      </span>
                      {idx === currentStep && (
                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-neon animate-[progress-fast_2s_ease-in-out_infinite]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-border space-y-4">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">System Health</span>
             <div className="flex items-center gap-4 text-[11px] font-mono italic">
                <div className={`w-2 h-2 rounded-full ${progress > 25 ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-white/10'}`}></div>
                <span className={progress > 25 ? 'text-white/60' : 'text-white/20'}>Integrity Check</span>
             </div>
             <div className="flex items-center gap-4 text-[11px] font-mono italic">
                <div className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-neon"></div>
                <span className="text-white">Analyzing Patterns</span>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
