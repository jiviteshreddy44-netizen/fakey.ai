
import React from 'react';
import { View } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onReset: () => void;
  expanded: boolean;
  onToggle: () => void;
  privacyMode?: boolean;
  setPrivacyMode?: (m: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onReset, expanded, onToggle, privacyMode, setPrivacyMode }) => {
  const items = [
    { view: View.HOME, label: 'Control Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
    { view: View.BATCH_TRIAGE, label: 'Batch Processing', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25' },
    { view: View.REVERSE_GROUNDING, label: 'Source Finder', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { view: View.TEXT_LAB, label: 'Text Analysis', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25' },
    { view: View.LIVE, label: 'Live Camera', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { view: View.HISTORY, label: 'Analysis History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#050505] z-[60] transition-opacity duration-500 ${expanded ? 'opacity-95' : 'opacity-0 pointer-events-none'}`} 
        onClick={onToggle} 
      />
      
      <aside 
        className={`fixed left-0 top-0 h-screen border-r border-border bg-[#121212] flex flex-col p-10 transition-all duration-500 ease-in-out z-[70] shadow-2xl ${
          expanded ? 'w-[320px] translate-x-0' : 'w-[320px] -translate-x-full'
        }`}
      >
        <div className="mb-14">
          <Logo size="md" onClick={() => { onReset(); onToggle(); }} />
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-3 ml-1">Truth Verification Suite</p>
        </div>

        <nav className="flex-grow space-y-2 overflow-y-auto no-scrollbar pr-2">
          {items.map((item) => (
            <button
              key={item.view}
              onClick={() => { onNavigate(item.view); onToggle(); }}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-xl transition-all duration-300 group relative ${
                currentView === item.view 
                ? 'bg-[#1A1A1A] text-accent border border-accent/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                : 'text-white/40 hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-300 shrink-0 ${currentView === item.view ? 'scale-110 text-accent' : 'group-hover:scale-110'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {item.label}
              </span>
              
              {currentView === item.view && (
                <div className="absolute right-4 w-1 h-1 bg-accent rounded-full shadow-neon"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-border space-y-4">
          <button 
            onClick={() => { onReset(); onToggle(); }}
            className="w-full py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-neon transition-all shadow-xl active:scale-95"
          >
            New Scan
          </button>
          <button 
            onClick={onToggle} 
            className="w-full py-4 bg-[#1A1A1A] border border-border text-white/40 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-[#2A2A2A] transition-all hover:text-white"
          >
            Close Menu
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
