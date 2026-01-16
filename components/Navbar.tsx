
import React from 'react';

interface NavbarProps {
  onReset: () => void;
  onOpenLive: () => void;
  onOpenText: () => void;
  privacyMode: boolean;
  setPrivacyMode: (m: boolean) => void;
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onReset, onOpenLive, onOpenText, privacyMode, setPrivacyMode, onToggleSidebar, sidebarExpanded }) => {
  return (
    <nav className="z-50 px-6 md:px-10 py-6 md:py-8 flex items-center justify-between bg-[#121212] border-b border-border sticky top-0">
      <div className="flex items-center gap-6 md:gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
        <button 
          onClick={onToggleSidebar}
          className={`flex items-center justify-center p-2 hover:text-white transition-colors group ${sidebarExpanded ? 'text-neon' : ''}`}
        >
          <div className="flex flex-col gap-1 w-5">
            <div className={`h-[2px] w-full bg-current transition-all duration-300 ${sidebarExpanded ? 'rotate-45 translate-y-[6px]' : ''}`}></div>
            <div className={`h-[2px] w-full bg-current transition-all duration-300 ${sidebarExpanded ? 'opacity-0' : ''}`}></div>
            <div className={`h-[2px] w-full bg-current transition-all duration-300 ${sidebarExpanded ? '-rotate-45 -translate-y-[6px]' : ''}`}></div>
          </div>
        </button>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="h-5 w-px bg-border"></div>
          <span className="flex items-center gap-3">
            <span className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-neon"></span>
            Link Operational
          </span>
          <div className="h-5 w-px bg-border"></div>
          <span className="font-mono opacity-60">NODE 01 READY</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-[#1A1A1A] border border-border rounded-xl group transition-all hover:border-neon/40">
           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Forensic Guard</span>
           <button 
             onClick={() => setPrivacyMode(!privacyMode)}
             className={`w-11 h-6 rounded-full relative transition-all duration-500 ${privacyMode ? 'bg-neon' : 'bg-white/10'}`}
           >
             <div className={`absolute top-1.5 w-3 h-3 rounded-full transition-all duration-500 ${privacyMode ? 'left-6 bg-black' : 'left-1.5 bg-white/40'}`}></div>
           </button>
        </div>
        
        <button 
          onClick={onReset}
          className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-neon transition-all shadow-xl active:scale-95"
        >
          Quick Scan
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
