
import React, { useRef, useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { analyzeMedia } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';

interface LiveScannerProps {
  onBack: () => void;
  onResult: (result: AnalysisResult) => void;
}

const LiveScanner: React.FC<LiveScannerProps> = ({ onBack, onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState("Calibrating Lens...");

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setStatus("ACCESS DENIED");
      }
    }
    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setStatus("PROBING SYNC...");

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/jpeg', 0.95));
      if (blob) {
        const file = new File([blob], "forensic_capture.jpg", { type: "image/jpeg" });
        setStatus("NEURAL ANALYSIS IN PROGRESS...");
        try {
          const result = await analyzeMedia(file, { 
            name: "HUD STREAM SNAPSHOT", 
            size: "Snapshot", 
            type: "image/jpeg",
            preview: canvasRef.current.toDataURL('image/jpeg')
          });
          onResult(result);
        } catch (e) {
          setStatus("SCAN ERROR RETRYING");
          setIsCapturing(false);
        }
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-charcoal relative animate-in fade-in duration-1000">
      <div className="absolute top-12 left-12">
        <button onClick={onBack} className="text-white/30 hover:text-white flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-black transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Terminate Link
        </button>
      </div>

      <div className="relative w-full max-w-3xl aspect-video rounded-[3rem] overflow-hidden border border-border shadow-2xl bg-black group">
        <video 
          ref={videoRef} autoPlay playsInline 
          className={`w-full h-full object-cover transition-all duration-1000 grayscale contrast-125 brightness-75 ${isCapturing ? 'opacity-30 blur-md' : 'opacity-80'}`} 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* HUD UI OVERLAY */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid Overlay */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
             {Array.from({length: 144}).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20"></div>
             ))}
          </div>

          {/* Corner Elements */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-neon opacity-40 shadow-neon"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-neon opacity-40 shadow-neon"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-neon opacity-40 shadow-neon"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-neon opacity-40 shadow-neon"></div>

          {/* Biometric Scan Frame */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-neon/20 animate-pulse">
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-px bg-neon/50"></div>
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-px bg-neon/50"></div>
             <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-40 w-px bg-neon/50"></div>
             <div className="absolute right-[-1px] top-1/2 -translate-y-1/2 h-40 w-px bg-neon/50"></div>
             
             {/* Scanning Line */}
             <div className="absolute inset-x-4 h-[2px] bg-neon/60 shadow-neon animate-scan-v-fast"></div>
          </div>

          {/* Telemetry Data */}
          <div className="absolute left-12 top-12 space-y-4">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Signal Lock</span>
                <span className="text-neon font-mono text-xs">ENCRYPTED SHA256</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Frame Delta</span>
                <span className="text-white/60 font-mono text-xs">0.0034 MS</span>
             </div>
          </div>

          {/* Processing Overlay */}
          {isCapturing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black animate-in fade-in duration-500">
               <NeuralLoader label={status} />
            </div>
          )}
        </div>

        {!isCapturing && (
          <div className="absolute bottom-0 left-0 w-full p-12 bg-gradient-to-t from-black to-transparent flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 bg-surface px-6 py-2 rounded-full border border-border">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-red-500/50"></span>
              <p className="text-[10px] font-mono text-white/60 tracking-[0.3em] uppercase">{status}</p>
            </div>
            <button 
              onClick={handleCapture}
              className="px-16 py-5 bg-white text-black font-black rounded-3xl hover:bg-neon hover:scale-105 transition-all active:scale-95 shadow-2xl uppercase tracking-widest text-sm"
            >
              Initiate Deep Scan
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center space-y-2 max-w-md">
        <p className="text-white/60 text-xs font-light tracking-tight">Keep the subject within the center frame for optimal artifact extraction.</p>
        <p className="text-white/10 text-[9px] font-mono uppercase tracking-widest">SYSTEM REQUIREMENT: HIGH CONTRAST LIGHTING</p>
      </div>

      <style>{`
        @keyframes scan-v-fast {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-v-fast { animation: scan-v-fast 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default LiveScanner;
