
import React, { useState, useRef } from 'react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) onUpload(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) onUpload(files[0]);
  };

  return (
    <div 
      id="upload-zone"
      className={`relative group transition-all duration-500 w-full animate-reveal`}
      style={{ animationDelay: '1800ms' }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative bg-[#121212] border-2 ${isDragging ? 'border-neon bg-[#1A1A1A]' : 'border-border'} rounded-[2rem] p-20 flex flex-col items-center justify-center text-center gap-10 cursor-pointer hover:border-white/20 transition-all duration-300 shadow-2xl`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />

        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-white/10 group-hover:text-neon group-hover:bg-neon/10 transition-all duration-500 border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-white">Verify Content</h2>
          <p className="text-white/40 text-lg max-w-sm mx-auto leading-relaxed">
            Drag media into the forensic field to initiate neural analysis. 
            <span className="block mt-2 font-black text-white/10 text-[10px] uppercase tracking-[0.4em]">MP4, MOV, JPG, PNG, WAV</span>
          </p>
        </div>

        <button className="px-16 py-5 bg-white text-black font-black rounded-xl hover:bg-neon hover:text-black transition-all duration-300 shadow-2xl group-hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.3em]">
          Browse Terminal
        </button>

        <div className="flex items-center gap-6 text-[10px] font-black text-white/5 uppercase tracking-[0.5em]">
          <div className="h-px w-12 bg-border"></div>
          Neural Link Active
          <div className="h-px w-12 bg-border"></div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;