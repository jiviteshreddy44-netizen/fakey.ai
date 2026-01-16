
import React, { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '../services/geminiService';
import NeuralLoader from './NeuralLoader';

const AudioLab: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setIsLoading(true);
        try {
          const text = await transcribeAudio(blob);
          setTranscription(text);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Mic access denied", e);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-4">
        <button onClick={onBack} className="text-white/30 hover:text-neon mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Terminal Home
        </button>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Vocal <span className="text-neon">Interrogator</span></h2>
        <p className="text-white/40 text-sm font-sans mt-1">Acoustic Analysis and Transcription</p>
      </header>

      <div className="p-16 bg-surface border border-border rounded-[3rem] flex flex-col items-center gap-12 text-center shadow-2xl">
        <div className="relative">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 group ${
              isRecording 
              ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-110' 
              : 'bg-surfaceLight border border-border hover:border-neon hover:bg-neon/10'
            }`}
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-white rounded-sm animate-pulse"></div>
            ) : (
              <svg className="w-12 h-12 text-white/20 group-hover:text-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v10a3 3 0 006 0V6a3 3 0 00-3-3z"/></svg>
            )}
          </button>
          {isRecording && (
            <div className="absolute inset-[-20px] border border-red-500/20 rounded-full animate-ping"></div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{isRecording ? 'Listening...' : transcription ? 'Transcription Complete' : 'Ready to record'}</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            Our analysis core will capture and transcribe vocal signals for forensic review.
          </p>
        </div>

        {isLoading && <NeuralLoader label="DECODING_AUDIO" />}

        {transcription && !isLoading && (
          <div className="w-full mt-8 p-10 bg-black border border-border rounded-3xl text-left animate-in slide-in-from-bottom-5 duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block mb-6">Recovered Text</span>
            <p className="text-xl text-white/80 font-light leading-relaxed italic">"{transcription}"</p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setTranscription(null)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Clear Stream</button>
              <button onClick={() => navigator.clipboard.writeText(transcription)} className="text-[10px] font-black uppercase tracking-widest text-neon/60 hover:text-neon transition-colors">Copy to Terminal</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioLab;
