
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BackgroundGraphics: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
      {/* 1. Deep Field Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,#08120e_0%,#050505_100%)]"></div>

      {/* 2. Forensic Grid (Subdued) */}
      <div className="absolute inset-0 opacity-[0.03] bg-grid-forensic"></div>

      {/* 3. The Emerald Ribbon - Dynamic Flow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-full h-full opacity-80" 
          viewBox="0 0 1440 900" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* The primary glowing gradient for the silk edge */}
            <linearGradient id="ribbon-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0" />
              <stop offset="20%" stopColor="#00FF88" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00FF88" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#00FF88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
            </linearGradient>

            {/* Volumetric falloff gradient */}
            <radialGradient id="ribbon-volume" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
            </radialGradient>

            <filter id="ribbon-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="gooey" />
              <feComposite in="SourceGraphic" in2="gooey" operator="over" />
            </filter>

            <filter id="sharp-glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Volumetric Shadow Layer */}
          <motion.path
            d="M-200,600 Q400,200 1000,700 T1600,400"
            fill="none"
            stroke="url(#ribbon-volume)"
            strokeWidth="600"
            animate={{
              d: [
                "M-200,600 Q400,200 1000,700 T1600,400",
                "M-200,400 Q500,800 1100,300 T1600,600",
                "M-200,600 Q400,200 1000,700 T1600,400"
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* The Sharp Silk Edge */}
          <motion.path
            d="M-200,600 Q400,200 1000,700 T1600,400"
            fill="none"
            stroke="url(#ribbon-glow-grad)"
            strokeWidth="2"
            filter="url(#sharp-glow)"
            style={{
              x: mousePos.x * 20,
              y: mousePos.y * 10
            }}
            animate={{
              d: [
                "M-200,600 Q400,200 1000,700 T1600,400",
                "M-200,400 Q500,800 1100,300 T1600,600",
                "M-200,600 Q400,200 1000,700 T1600,400"
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Secondary Faint Trace */}
          <motion.path
            d="M-200,300 Q600,100 900,500 T1600,200"
            fill="none"
            stroke="#00FF88"
            strokeWidth="1"
            className="opacity-10"
            animate={{
              d: [
                "M-200,300 Q600,100 900,500 T1600,200",
                "M-200,500 Q300,600 1200,400 T1600,700",
                "M-200,300 Q600,100 900,500 T1600,200"
              ]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </svg>
      </div>

      {/* 4. Global Vignette & Noise */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.4)_60%,rgba(5,5,5,0.9)_100%)]"></div>
      
      {/* Subtle Analog Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundGraphics;
