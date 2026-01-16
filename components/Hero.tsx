
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const line1 = "Real media needs";
  const line2 = "REAL PROOF.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="text-center space-y-16 max-w-5xl mx-auto pt-28 pb-12 relative overflow-visible">
      <div className="space-y-10">
        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] flex flex-col items-center select-none">
          <span className="flex overflow-hidden">
            {line1.split("").map((char, i) => (
              <span 
                key={i} 
                className="animate-reveal inline-block text-white" 
                style={{ animationDelay: `${150 + i * 25}ms`, whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="flex overflow-hidden mt-2 group cursor-default">
            {line2.split("").map((char, i) => (
              <span 
                key={i} 
                className="animate-reveal inline-block text-neon italic group-hover:animate-glitch" 
                style={{ 
                  animationDelay: `${600 + i * 40}ms`, 
                  whiteSpace: char === " " ? "pre" : "normal"
                }}
              >
                {char}
              </span>
            ))}
          </span>
          
          <div className="w-full flex justify-center mt-10">
            <div className="h-[1px] bg-white/10 relative rounded-full overflow-hidden" style={{ width: '380px' }}>
              <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-neon to-transparent shadow-[0_0_25px_#00FF88] animate-scan-sweep opacity-70"></div>
            </div>
          </div>
        </h1>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.9, duration: 0.5, ease: "circOut" }}
            className="text-xl md:text-2xl text-white/80 font-light leading-relaxed"
          >
            Autonomous verification you can trust.
          </motion.p>
          
          <div className="flex justify-center items-center gap-2">
            <motion.p
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl text-white/40 font-light tracking-tight"
            >
              {"High-fidelity forensic analysis for ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  transition={{ delay: 1.1 + (i * 0.015) }}
                  style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char}
                </motion.span>
              ))}
              <span className="text-white font-medium">
                {["images", ", ", "video", ", and ", "synthetic audio"].map((segment, i) => (
                   <motion.span
                    key={i}
                    initial={{ opacity: 0, color: '#6366F1' }}
                    animate={{ opacity: 1, color: segment.includes('and') || segment === ', ' ? '#ffffff66' : '#ffffff' }}
                    transition={{ delay: 1.6 + (i * 0.1), duration: 0.3 }}
                   >
                    {segment}
                   </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, times: [0, 0.5, 1] }}
                className="inline-block w-[2px] h-5 bg-neon ml-1 align-middle shadow-[0_0_8px_#00FF88]"
              />
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="flex justify-center"
      >
        <button 
          onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
          className="group relative px-14 py-6 bg-charcoal border-2 border-neon text-neon font-black rounded-full text-xs uppercase tracking-[0.5em] hover:bg-neon hover:text-black transition-all duration-700 shadow-[0_0_40px_rgba(0,255,136,0.15)] hover:shadow-[0_0_60px_rgba(0,255,136,0.4)] active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">[ Upload media to verify ]</span>
          <div className="absolute inset-0 bg-neon translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-0"></div>
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000"></div>
        </button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16"
      >
        <FeatureItem 
          icon="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" 
          label="Biometric Mesh" 
          desc="Facial and motion consistency analysis" 
        />
        <FeatureItem 
          icon="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856a8.25 8.25 0 0 1 13.788 0M1.924 8.674a11.25 11.25 0 0 1 20.152 0M12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
          label="Signal Sync" 
          desc="Audio-visual alignment verification" 
        />
        <FeatureItem 
          icon="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .415.162.791.425 1.077.262.285.624.463 1.025.463s.763-.178 1.025-.463c.263-.286.425-.662.425-1.077 0-.231-.035-.454-.1-.664m-1.85 0c1.023-.07 2.05-.124 3.085-.162m-11.194 0c1.023.07 2.05.124 3.085.162m0 0V18.75A2.25 2.25 0 0 0 5.25 21h1.75m11.194-11.194A48.404 48.404 0 0 0 12 11.25c-1.047 0-2.09-.044-3.125-.132A48.394 48.394 0 0 0 3.085 10.75" 
          label="Metadata Integrity" 
          desc="Source and encoding anomaly detection" 
        />
      </motion.div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: string, label: string, desc: string }> = ({ icon, label, desc }) => (
  <div className="flex flex-col items-center gap-4 group px-4">
    <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-white/30 group-hover:text-neon group-hover:bg-neon/10 transition-all duration-700 border border-[#1A1A1A] group-hover:border-neon/40 shadow-xl group-hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] group-hover:-translate-y-2">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon} />
      </svg>
    </div>
    <div className="text-center">
      <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors duration-500">
        {label}
      </h4>
      <p className="text-[10px] text-white/20 mt-2 font-medium tracking-tight group-hover:text-white/50 transition-colors duration-500 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

export default Hero;
