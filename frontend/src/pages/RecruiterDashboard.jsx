import React, { useEffect, useState } from 'react';
import { UserCheck, Users, Award, Search, ArrowUpRight, CheckCircle2, Sliders } from 'lucide-react';
import { fetchRecruiterAnalytics } from '../services/api';

export default function RecruiterDashboard({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchRecruiterAnalytics();
      setData(res);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs animate-pulse">
        Loading Recruiter Candidate Evaluation Analytics...
      </div>
    );
  }

  const filteredCandidates = data.candidates.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <UserCheck className="w-4 h-4" /> Recruiter & Hiring Manager Workspace
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Candidate Evaluation Matrix</h1>
          <p className="text-xs text-slate-400">Compare candidate mock interview scores and AI assessment readiness</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search candidate name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Total Evaluated Candidates</span>
          <div className="text-3xl font-extrabold text-white">{data.total_candidates}</div>
          <span className="text-[11px] text-cyan-400">Active Candidates</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Platform Average Score</span>
          <div className="text-3xl font-extrabold text-cyan-400">{data.average_platform_score} / 100</div>
          <span className="text-[11px] text-emerald-400 font-medium">Qualified Threshold: 75.0</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Ready for Hire Ratio</span>
          <div className="text-3xl font-extrabold text-emerald-400">75%</div>
          <span className="text-[11px] text-slate-400">High Technical & Speech Score</span>
        </div>
      </div>

      {/* CANDIDATE EVALUATION TABLE */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Candidate Assessment Directory</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Interviews Attended</th>
                <th className="py-3 px-4">Highest Score</th>
                <th className="py-3 px-4">Recruitment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-100">{c.full_name}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{c.email}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{c.interviews_attended} Sessions</td>
                  <td className="py-3.5 px-4 font-bold font-mono text-cyan-400">{c.highest_score} / 100</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      c.status === 'Ready for Hire' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActivePage('interview-report')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      View Report <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
