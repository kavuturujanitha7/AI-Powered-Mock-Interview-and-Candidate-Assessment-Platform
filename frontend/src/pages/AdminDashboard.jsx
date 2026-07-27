import React, { useEffect, useState } from 'react';
import { Shield, Server, Users, FileText, Activity, CheckCircle2, Cpu, Database } from 'lucide-react';
import { fetchAdminMetrics } from '../services/api';

export default function AdminDashboard({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetchAdminMetrics();
      setData(res);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs animate-pulse">
        Loading Platform Admin Telemetry & Metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
            <Shield className="w-4 h-4" /> System Administration Workspace
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Platform Health & AI Telemetry</h1>
          <p className="text-xs text-slate-400">Monitor system load, database records, and AI model parameters</p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          System Operational
        </span>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Total Platform Users</span>
          <div className="text-3xl font-extrabold text-white">{data.total_users}</div>
          <span className="text-[11px] text-cyan-400">Candidates & Recruiters</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Total Interview Sessions</span>
          <div className="text-3xl font-extrabold text-indigo-400">{data.total_sessions}</div>
          <span className="text-[11px] text-slate-400">Simulations Executed</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Resumes Parsed</span>
          <div className="text-3xl font-extrabold text-emerald-400">{data.total_resumes_parsed}</div>
          <span className="text-[11px] text-emerald-400">PDF Extractions Active</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">System Latency</span>
          <div className="text-3xl font-extrabold text-cyan-400">42 ms</div>
          <span className="text-[11px] text-emerald-400">Optimal REST API Response</span>
        </div>

      </div>

      {/* SYSTEM ARCHITECTURE & AI MODEL CONFIG PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">AI Engine Configuration</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">Speech-to-Text Model:</span>
              <span className="font-mono text-cyan-400 font-semibold">Whisper API / Web Speech STT</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">Vision & Posture Tracker:</span>
              <span className="font-mono text-indigo-400 font-semibold">MediaPipe Face Mesh v0.10</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">Scoring Engine Formula:</span>
              <span className="font-mono text-emerald-400 font-semibold">Infosys 4-Factor Rubric v2.4</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Database className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Database & Service Diagnostics</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">Database Driver:</span>
              <span className="font-mono text-slate-200 font-semibold">SQLite / PostgreSQL ORM</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">JWT Token Expiry:</span>
              <span className="font-mono text-slate-200 font-semibold">24 Hours (HS256)</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex justify-between items-center">
              <span className="text-slate-300">CORS Policy:</span>
              <span className="font-mono text-emerald-400 font-semibold">Strict Allow-Headers</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
