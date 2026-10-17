import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: { name: string; email: string; avatar: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('alex.morgan@creova.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Alex Morgan');

  const handleQuickLogin = (roleName: string, roleEmail: string, roleAvatar: string) => {
    onLogin({ name: roleName, email: roleEmail, avatar: roleAvatar });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || 'Creator User',
      email: email || 'creator@creova.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    });
  };

  return (
    <div className="min-h-screen bg-grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#DEDFD8] rounded-3xl p-8 shadow-xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#050505] text-[#C8F34A] shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">CREOVA</h1>
          <p className="text-xs text-[#737373]">Complete AI Creator Operating System</p>
        </div>

        {/* Quick Demo Logins */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider text-center">Quick Creator Access</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Alex Morgan', 'alex@creova.ai', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces')}
              className="p-3 bg-[#F8F8F4] border border-[#DEDFD8] hover:border-[#111111] rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2.5"
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                alt="Alex"
                className="w-8 h-8 rounded-xl object-cover" 
              />
              <div>
                <p className="text-xs font-bold text-[#111111]">Alex Morgan</p>
                <p className="text-[9px] text-[#737373]">Lead Creator</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Marcus Vance', 'marcus@creova.ai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces')}
              className="p-3 bg-[#F8F8F4] border border-[#DEDFD8] hover:border-[#111111] rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2.5"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" 
                alt="Marcus"
                className="w-8 h-8 rounded-xl object-cover" 
              />
              <div>
                <p className="text-xs font-bold text-[#111111]">Marcus Vance</p>
                <p className="text-[9px] text-[#737373]">Studio Producer</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#888888]">
          <div className="flex-1 h-px bg-[#DEDFD8]" />
          <span>or sign in with workspace</span>
          <div className="flex-1 h-px bg-[#DEDFD8]" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Creator Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl pl-10 pr-4 py-3 text-xs text-[#111111] outline-none focus:border-[#111111]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Work Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-[#888888]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@creova.ai"
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl pl-10 pr-4 py-3 text-xs text-[#111111] outline-none focus:border-[#111111]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-[#888888]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl pl-10 pr-4 py-3 text-xs text-[#111111] outline-none focus:border-[#111111]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <span>Launch Creator Studio</span>
            <ArrowRight className="w-4 h-4 text-[#C8F34A]" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[#EEEEEA] flex items-center justify-center gap-1.5 text-[11px] text-[#737373]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
          <span>Enterprise Grade Security & Encrypted Workspace</span>
        </div>
      </div>
    </div>
  );
};
