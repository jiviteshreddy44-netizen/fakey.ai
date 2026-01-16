
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minus, Sparkles, Globe } from 'lucide-react';
import { startAssistantChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";
import { View, AnalysisResult } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; url: string; }[];
}

interface FloatingAssistantProps {
  currentView: View;
  analysisResult: AnalysisResult | null;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ currentView, analysisResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am your assistant. I can help explain results or answer general questions about what you see on the screen. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startAssistantChat();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const contextPrompt = `
      [Current Screen Information]
      Screen: ${currentView}
      ${analysisResult ? `Analysis on screen: ${JSON.stringify({
        id: analysisResult.id,
        verdict: analysisResult.verdict,
        probability: analysisResult.deepfakeProbability,
        summary: analysisResult.summary
      })}` : 'No specific analysis data is currently visible.'}
      
      User Question: ${userMsg}
    `;

    try {
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: contextPrompt });
      const text = response.text || 'I am sorry, I am having trouble connecting right now.';
      
      const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "Reference Link",
          url: chunk.web?.uri || ""
        })) || [];

      setMessages(prev => [...prev, { 
        role: 'model', 
        text,
        sources: groundingSources.length > 0 ? groundingSources : undefined
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection lost. Trying to reconnect...' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="mb-4 w-[400px] h-[580px] bg-surface border border-border rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            <header className="p-6 bg-charcoal/50 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-neon" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Neural Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-neon rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">Ready to help</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
                  <Minus size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-neon/10 border border-neon/20 text-white italic' 
                    : 'bg-white/5 border border-white/5 text-white/80'
                  } max-w-[85%]`}>
                    {m.text}
                    
                    {m.sources && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                        <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Helpful Links:</span>
                        {m.sources.map((s, idx) => (
                          <a key={idx} href={s.url} target="_blank" className="flex items-center gap-2 text-[10px] text-neon hover:underline truncate">
                            <Globe size={10} /> {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start">
                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-1">
                      <div className="w-1 h-1 bg-neon rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-neon rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-neon rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
            </div>

            <footer className="p-6 bg-charcoal/30 border-t border-border">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full bg-black border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/10 focus:border-neon outline-none transition-all"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center hover:bg-neon transition-all active:scale-90 disabled:opacity-20 shadow-xl"
                >
                  <Send size={14} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl border transition-all duration-500 group ${
          isOpen ? 'bg-white text-black border-white' : 'bg-surface border-border text-white hover:border-neon'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:text-neon" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon rounded-full border-4 border-charcoal animate-pulse"></div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingAssistant;
