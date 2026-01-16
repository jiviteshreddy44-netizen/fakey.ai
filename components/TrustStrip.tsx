
import React, { useEffect, useRef, useState } from 'react';

const TrustStrip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const signals = [
    { 
      label: "Neural Analysis", 
      desc: "Multi-layer AI detection", 
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" 
    },
    { 
      label: "Transparent Results", 
      desc: "See why media is flagged", 
      icon: "M2.036 12.322a1.012 1.012 0 010-.644C3.412 8.13 7.03 5.375 12 5.375s8.588 2.755 9.964 6.303a1.012 1.012 0 010 .644C20.588 15.87 16.97 18.625 12 18.625s-8.588-2.755-9.964-6.303z M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" 
    },
    { 
      label: "Verified Proof", 
      desc: "Calm, evidence-driven verdicts", 
      icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.223 12.003 12.003 0 0012 20.24a12.003 12.003 0 008.402-14.017A11.959 11.959 0 0112 2.714z" 
    },
    { 
      label: "No Fear-Based Alerts", 
      desc: "Objective security rating", 
      icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" 
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="w-full py-20 bg-charcoal relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((sig, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center text-center lg:items-start lg:text-left p-8 bg-surface border border-border rounded-[2rem] group cursor-default transition-all duration-700 hover:border-neon/40 shadow-2xl ${isVisible ? 'animate-reveal' : 'opacity-0 translate-y-4'}`}
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-surfaceLight flex items-center justify-center text-white/30 group-hover:text-neon group-hover:bg-neon/10 border border-border transition-all duration-500 mb-6 shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d={sig.icon} 
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors">
                  {sig.label}
                </span>
                <p className="text-[11px] font-medium text-white/20 group-hover:text-white/50 transition-colors leading-relaxed uppercase tracking-wider">
                  {sig.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
