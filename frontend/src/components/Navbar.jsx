import React from 'react';
import { Sparkles, Video, FileText, BarChart2, Award, LogOut } from 'lucide-react';
import { getStoredUser, removeStoredToken } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const user = getStoredUser();

  const handleLogout = () => {
    removeStoredToken();
    localStorage.removeItem('smarthire_user');
    setActivePage('landing');
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActivePage('landing')} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold font-display tracking-tight text-white flex items-center gap-1">
                SmartHire <span className="text-gradient">AI</span>
              </span>
            </div>
          </div>

          {/* Compact 5 Navigation Pills - Zero Empty Space Gaps */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner shrink-0">
            <button
              onClick={() => setActivePage('landing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activePage === 'landing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('candidate-dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activePage === 'candidate-dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart2 className="w-3 h-3" /> Candidate Hub
            </button>
            <button
              onClick={() => setActivePage('resume-upload')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activePage === 'resume-upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3 h-3" /> Resume AI
            </button>
            <button
              onClick={() => setActivePage('interview-setup')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activePage === 'interview-setup' || activePage === 'interview-room' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Video className="w-3 h-3" /> Mock Interview
            </button>
            <button
              onClick={() => setActivePage('interview-report')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activePage === 'interview-report' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-3 h-3 text-emerald-400" /> AI Reports
            </button>
          </nav>

          {/* User Profile & Auth Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.full_name ? user.full_name[0] : 'U'}
                  </div>
                  <span className="text-[11px] font-medium text-slate-200 hidden sm:inline">{user.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md hover:opacity-90 transition-all"
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
