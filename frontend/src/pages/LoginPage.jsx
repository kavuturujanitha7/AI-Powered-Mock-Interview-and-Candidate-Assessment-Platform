import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginPage({ setActivePage }) {
  const [email, setEmail] = useState('candidate@infosys.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email, password);
    setLoading(false);
    setActivePage('candidate-dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to access your interview analytics & practice history</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Quick Preset Selector Buttons for Testing */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Demo Preset Login:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('candidate@infosys.com'); setPassword('password123'); }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-indigo-400 hover:bg-slate-800"
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => { setEmail('recruiter@infosys.com'); setPassword('password123'); }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-cyan-400 hover:bg-slate-800"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@infosys.com'); setPassword('password123'); }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-emerald-400 hover:bg-slate-800"
              >
                Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Log In to Platform"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Don't have an account?{' '}
          <button onClick={() => setActivePage('register')} className="text-indigo-400 font-semibold hover:underline">
            Register here
          </button>
        </div>

      </div>
    </div>
  );
}
