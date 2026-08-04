import React from 'react';
import { Sparkles, Video, FileText, BarChart2, LogOut } from 'lucide-react';
import { getStoredUser, removeStoredToken } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const user = getStoredUser();

  const handleLogout = () => {
    removeStoredToken();
    localStorage.removeItem('smarthire_user');
    setActivePage('landing');
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage('landing')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                SmartHire <span className="text-gradient">AI</span>
              </span>
              <span className="text-[9px] text-slate-400 block tracking-wide font-mono uppercase">AI Mock Interview Platform</span>
            </div>
          </div>

          {/* Navigation Links - Tight, Centered, Compact Container (No Empty Space) */}
          <nav className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setActivePage('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'landing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('candidate-dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePage === 'candidate-dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> Candidate Hub
            </button>
            <button
              onClick={() => setActivePage('resume-upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePage === 'resume-upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Resume AI
            </button>
            <button
              onClick={() => setActivePage('interview-setup')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activePage === 'interview-setup' || activePage === 'interview-room' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Mock Interview
            </button>
          </nav>

          {/* User Profile & Auth Button */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.full_name ? user.full_name[0] : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">{user.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md hover:opacity-90 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
