
import React from 'react';
import { AnalysisResult } from '../types';
import { motion } from 'framer-motion';

const ForensicTimeline: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const timestamps = result.explanations.filter(e => e.timestamp);
  
  if (timestamps.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-border rounded-2xl opacity-20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sequential_Data_Unavailable</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="relative pt-20 pb-20 px-4 md:px-10">
        <div className="h-px bg-border absolute top-1/2 left-0 right-0 opacity-40"></div>
        
        {/* Metric Marks */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none opacity-10 px-4">
           {Array.from({length: 40}).map((_, i) => (
             <div key={i} className={`h-2 w-px bg-white ${i % 5 === 0 ? 'h-5 bg-neon' : ''}`}></div>
           ))}
        </div>

        <div className="flex justify-around items-center h-40 relative z-10">
           {timestamps.map((exp, i) => (
             <motion.div 
               key={i} 
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
               className="relative group cursor-pointer flex flex-col items-center"
             >
                {/* Connector Line */}
                <div className={`w-[1px] h-14 bg-border transition-all duration-500 group-hover:h-20 group-hover:bg-neon/40 ${i % 2 === 0 ? 'order-1 translate-y-6' : 'order-3 -translate-y-6'}`}></div>
                
                {/* Interactive Node */}
                <div className={`relative z-20 order-2 w-3.5 h-3.5 rotate-45 border-2 transition-all duration-500 group-hover:scale-150 group-hover:rotate-[135deg] ${
                  exp.category === 'visual' ? 'border-neon bg-neon shadow-[0_0_15px_#00FF88]' : 
                  exp.category === 'audio' ? 'border-purple-500 bg-purple-500 shadow-[0_0_15px_#A855F7]' : 
                  'border-white/40 bg-white/20'
                }`}>
                   <div className="absolute inset-0 bg-white/40 animate-ping rounded-full scale-50 opacity-0 group-hover:opacity-100"></div>
                </div>
                
                {/* Floating Tooltip */}
                <div className={`absolute ${i % 2 === 0 ? 'bottom-full mb-12' : 'top-full mt-12'} left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 pointer-events-none z-50`}>
                   <div className="bg-surface border border-border p-5 rounded-2xl w-60 shadow-2xl relative">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-[8px] font-black text-neon uppercase tracking-widest">{exp.category}</span>
                         <span className="text-[10px] font-mono text-white/30">{exp.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-white/80 font-light italic uppercase tracking-tight">"{exp.point}"</p>
                      
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-neon/40"></div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-neon/40"></div>
                   </div>
                </div>

                {/* Timestamp Label */}
                <span className={`absolute ${i % 2 === 0 ? '-bottom-12' : '-top-12'} left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/10 tracking-widest transition-colors group-hover:text-neon`}>
                  {exp.timestamp}
                </span>
             </motion.div>
           ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-10 pt-10 border-t border-border/50">
         <div className="flex items-center gap-3 group">
            <div className="w-2.5 h-2.5 rotate-45 border border-neon bg-neon shadow-[0_0_8px_#00FF88]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Visual Anomaly</span>
         </div>
         <div className="flex items-center gap-3 group">
            <div className="w-2.5 h-2.5 rotate-45 border border-purple-500 bg-purple-500 shadow-[0_0_8px_#A855F7]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Neural Drifts</span>
         </div>
      </div>
    </div>
  );
};

export default ForensicTimeline;
