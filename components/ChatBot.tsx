
import React, { useState, useEffect, useRef } from 'react';
import { startAssistantChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; url: string; }[];
}

const ChatBot: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Secure link established. I am your Forensic Assistant. I have real-time access to global facts. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startAssistantChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: userMsg });
      const text = response.text || 'Error processing response.';
      
      const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "Verified Source",
          url: chunk.web?.uri || ""
        })) || [];

      setMessages(prev => [...prev, { 
        role: 'model', 
        text,
        sources: groundingSources.length > 0 ? groundingSources : undefined
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Communication interrupted. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[750px] flex flex-col bg-[#080808] border border-border rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <header className="p-8 border-b border-border flex items-center justify-between bg-[#121212]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-neon rounded-full animate-pulse shadow-neon"></div>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white">Neural Assistant</h2>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">Secure Node Operational</p>
          </div>
        </div>
        <button onClick={onBack} className="text-white/20 hover:text-white transition-colors p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </header>

      <div ref={scrollRef} className="flex-grow p-10 overflow-y-auto space-y-8 no-scrollbar bg-[#050505]">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-8 rounded-2xl ${
              m.role === 'user' 
              ? 'bg-[#1A1A1A] border border-border text-white' 
              : 'bg-[#121212] border border-border text-white shadow-xl'
            }`}>
              <p className="text-[14px] leading-relaxed font-light">{m.text}</p>
              
              {m.sources && m.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[#2A2A2A] space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">References:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {m.sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-[#080808] border border-border rounded-xl hover:border-neon transition-all group"
                      >
                        <span className="text-[11px] font-bold text-white/40 truncate group-hover:text-neon">{src.title}</span>
                        <svg className="w-3.5 h-3.5 text-white/10 group-hover:text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="2.5"/></svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[8px] font-mono text-white/10 uppercase mt-3 tracking-widest px-1">
              {m.role === 'user' ? 'Local Input' : 'Forensic Log'} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#121212] border border-border p-8 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neon animate-pulse">Neural Threading...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="p-10 bg-[#121212] border-t border-border">
        <div className="relative group max-w-3xl mx-auto">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a forensic question..."
            className="w-full bg-[#080808] border border-border rounded-xl py-5 px-8 text-sm text-white placeholder:text-white/10 focus:border-neon outline-none transition-all pr-20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white text-black rounded-lg flex items-center justify-center hover:bg-neon transition-all active:scale-95 disabled:opacity-20 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l7-7-7-7M5 12h14"/></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBot;
