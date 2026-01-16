
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, onClick }) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8 text-lg', text: 'text-lg' },
    md: { icon: 'w-12 h-12 text-2xl', text: 'text-3xl' },
    lg: { icon: 'w-16 h-16 text-3xl', text: 'text-5xl' },
    xl: { icon: 'w-24 h-24 text-5xl', text: 'text-7xl' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 group cursor-pointer select-none transition-all duration-500 ${className}`}
    >
      <div className={`relative ${currentSize.icon} flex items-center justify-center`}>
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-white rounded-2xl group-hover:bg-neon transition-colors duration-500 shadow-2xl group-hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] group-hover:-rotate-3"></div>
        <div className="absolute inset-0 border border-white/20 rounded-2xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-125"></div>
        
        {/* The 'F' Mark */}
        <span className="relative z-10 font-black text-black italic">F</span>
        
        {/* Micro HUD scanning line on the icon */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/10 group-hover:bg-black/20 animate-scan-line-v opacity-0 group-hover:opacity-100"></div>
      </div>

      {showText && (
        <div className="flex flex-col items-start">
          <h1 className={`font-black tracking-tighter italic uppercase leading-none ${currentSize.text}`}>
            FAKEY<span className="text-neon transition-colors duration-500 group-hover:text-white">.AI</span>
          </h1>
          <div className="h-[2px] w-0 bg-neon group-hover:w-full transition-all duration-700 mt-1 shadow-[0_0_15px_#00FF88]"></div>
        </div>
      )}
    </div>
  );
};

export default Logo;
