import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = ({ dashboardData }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Orbit Assistant. Ask me anything about the ISS, current news, or astronauts in space!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await chatWithAI(userMessage, dashboardData);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-5 bg-primary/10 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
            <Bot size={20} />
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-widest block">Orbit AI</span>
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">Qwen-3 System Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed font-medium ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
                : 'bg-secondary/80 backdrop-blur-md text-foreground rounded-tl-none border border-white/10'
            }`}>
              <div className={`flex items-center gap-1.5 mb-2 opacity-50 font-black uppercase tracking-widest text-[8px]`}>
                {msg.role === 'user' ? <User size={8} /> : <Bot size={8} />}
                <span>{msg.role}</span>
              </div>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none border border-white/10">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-5 bg-black/5 dark:bg-white/5 backdrop-blur-md border-t border-white/10 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Transmit message to Orbit AI..."
          className="flex-grow bg-secondary/50 rounded-2xl px-5 py-3 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-white/10 transition-all placeholder:text-muted-foreground/50"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary text-white p-3 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
        >
          <Send size={18} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
