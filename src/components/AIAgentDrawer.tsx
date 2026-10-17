import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Loader2, Zap } from 'lucide-react';

interface AIAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const AIAgentDrawer: React.FC<AIAgentDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: "Hello! I am your CREOVA AI Creator Agent. I can help you brainstorm viral hooks, optimize retention, plan publishing calendars, or analyze your content growth. How can I assist you today?",
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim()) return;

    const userMsg: Message = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: promptToSend,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          systemInstruction: "You are CREOVA AI, an elite Creator Agent and co-founder strategist for top content creators. Provide precise, actionable, retention-focused creator guidance."
        })
      });
      const data = await res.json();
      const agentReplyText = data.success && data.text ? data.text : "I'm here to help you scale your creator business. Let's optimize your next video!";

      const agentMsg: Message = {
        id: 'm_' + (Date.now() + 1),
        sender: 'agent',
        text: agentReplyText,
        time: 'Just now'
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: 'm_' + (Date.now() + 1),
        sender: 'agent',
        text: "I encountered a connection issue with the AI core. Please try again.",
        time: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🔥 Give me 3 viral hooks for my next video",
    "📈 How can I improve viewer retention past the 50% mark?",
    "💰 Best monetization strategies for micro-creators",
    "⏰ Optimal publishing times for YouTube & TikTok"
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#EDEEE5] h-full shadow-2xl border-l border-[#DEDFD8] flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#DEDFD8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#050505] text-[#C8F34A] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#111111] flex items-center gap-1.5">
                <span>CREOVA AI Agent</span>
                <span className="px-2 py-0.5 bg-[#C8F34A]/30 text-[#111111] text-[9px] font-bold rounded-full">Gemini 3.8</span>
              </h2>
              <p className="text-[10px] text-[#737373]">Autonomous creator strategy & co-pilot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F8F8F4] border border-[#DEDFD8] flex items-center justify-center text-[#737373] hover:text-[#111111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 bg-white/60 border-b border-[#DEDFD8] space-y-2">
          <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#C8F34A]" />
            Quick Creator Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="text-[11px] bg-white border border-[#DEDFD8] hover:border-[#111111] text-[#111111] px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left shadow-2xs"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-[#050505] text-white' : 'bg-[#C8F34A] text-[#050505]'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-[#050505] text-white rounded-tr-none' : 'bg-white border border-[#DEDFD8] text-[#111111] rounded-tl-none'}`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[9px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-[#888888]' : 'text-[#888888]'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C8F34A] text-[#050505] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#DEDFD8] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-[#737373]">
                <Loader2 className="w-4 h-4 text-[#C8F34A] animate-spin" />
                <span>AI Agent is analyzing & formulating strategy...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-[#DEDFD8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#F8F8F4] border border-[#DEDFD8] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#C8F34A] focus-within:border-[#111111] transition-all"
          >
            <input
              type="text"
              placeholder="Ask AI Agent anything about content strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent text-xs text-[#111111] placeholder-[#888888] outline-none flex-1 py-1.5"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-[#050505] hover:bg-[#222222] disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 text-[#C8F34A]" />
            </button>
          </form>
          <p className="text-[10px] text-center text-[#888888] mt-2">
            Powered by Gemini AI • CREOVA Creator Operating System
          </p>
        </div>
      </div>
    </div>
  );
};
