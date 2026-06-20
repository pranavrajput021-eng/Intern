import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Dumbbell, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'coach' | 'athlete';
  text: string;
  timestamp: Date;
}

export default function AestheticCoachChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Greetings, Athlete. I am your dedicated Aesthetic Athlete Coach. Ask me anything about workout plans, bodybuilding splits, nutritional protocols, or performance optimization. I focus exclusively on athletic excellence.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  const phrases = [
    "Aesthetic Coach AI Active ✨",
    "Get Custom Splits ⚡",
    "Optimize Recovery 🧪",
    "Chat for Fitness Tips 💪"
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) return;

    const currentPhrase = phrases[phraseIdx];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && typedText === currentPhrase) {
      // Pause at full phrase
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting
          ? currentPhrase.substring(0, typedText.length - 1)
          : currentPhrase.substring(0, typedText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIdx, isOpen]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'athlete',
      text: rawText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: rawText.trim(),
          history: messages.map(m => ({
            role: m.sender === 'coach' ? 'model' : 'user',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Service communication failed');
      }

      const data = await response.json();
      const coachMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'coach',
        text: data.reply || "I am experiencing structural communication gaps. Let's resume physical training.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'coach',
        text: "Apologies, the fitness server is currently recovering. Let's repeat our set in a moment or confirm your API key configuration.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'coach',
        text: "Greetings, Athlete. I am your dedicated Aesthetic Athlete Coach. Ask me anything about workout plans, bodybuilding splits, nutritional protocols, or performance optimization. I focus exclusively on athletic excellence.",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-left bg-transparent">
      <AnimatePresence>
        {!isOpen && (
          <div className="flex items-center gap-3 bg-transparent select-none">
            {/* Elegant Pure Dark Black & Green attention-grabbing active typer badge */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="px-4 py-2 bg-[#000000] border border-emerald-950 rounded-2xl shadow-2xl shadow-emerald-950/20 backdrop-blur-xl flex items-center gap-2 max-w-[260px] cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-tight uppercase">
                {typedText || "Aesthetic Coach AI"}
                <span className="animate-pulse ml-0.5 text-emerald-300">|</span>
              </span>
            </motion.div>

            <motion.button
              key="badge-trigger"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-900 text-white shadow-xl shadow-emerald-900/30 hover:scale-105 transition active:scale-95 cursor-pointer relative group shrink-0 border border-emerald-800"
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping" />
              <Dumbbell className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </motion.button>
          </div>
        )}

        {isOpen && (
          <motion.div
            key="coach-chatbox"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-[#000000] border border-emerald-850/40 rounded-3xl shadow-2xl shadow-emerald-950/40 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#052316] border-b border-emerald-950/80 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-neutral-100 flex items-center gap-1.5 leading-none">
                    Aesthetic Coach AI
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  </h4>
                  <span className="text-[10px] text-emerald-500/80 font-mono">ATHLETIC EXCELLENCE SHELL</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear Conversation"
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-emerald-950/35 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-emerald-950/35 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#000] custom-scrollbar flex flex-col">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'athlete' ? 'justify-end' : 'justify-start'} bg-transparent`}
                >
                  <div className={`flex gap-2 max-w-[82%] ${m.sender === 'athlete' ? 'flex-row-reverse' : 'flex-row'} bg-transparent`}>
                    <div className={`w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center text-[10px] uppercase font-bold font-mono ${
                      m.sender === 'athlete' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {m.sender === 'athlete' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.sender === 'athlete'
                        ? 'bg-emerald-950/45 text-emerald-300 border border-emerald-900/55 shadow-sm rounded-tr-none text-right'
                        : 'bg-neutral-900/60 text-neutral-250 border border-emerald-950/40 shadow-inner rounded-tl-none text-left'
                    } whitespace-pre-wrap`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start bg-transparent">
                  <div className="flex gap-2 bg-transparent">
                    <div className="w-6.5 h-6.5 rounded-lg shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-neutral-900/60 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 text-xs text-neutral-400 border border-emerald-950/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions / Bubbles */}
            {messages.length === 1 && (
              <div className="px-5 pb-3 flex flex-wrap gap-1.5 bg-[#000]">
                {[
                  "Suggest a 4-day workout split",
                  "Suggest pre-workout meal",
                  "Explain Progressive Overload"
                ].map((suggest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(suggest)}
                    className="px-3 py-1.5 text-[10px] text-emerald-300 bg-[#000] border border-emerald-950 hover:border-emerald-800 hover:text-emerald-400 rounded-xl transition duration-150 cursor-pointer text-left"
                  >
                    💡 {suggest}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-4 bg-emerald-950/10 border-t border-emerald-950/60 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your Coach anything on physical fitness..."
                className="flex-1 bg-black/80 border border-emerald-950 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 placeholder:text-emerald-700/65 focus:outline-none focus:border-emerald-700 transition shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-[#000000] disabled:text-neutral-750 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-lg border border-emerald-900/40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
