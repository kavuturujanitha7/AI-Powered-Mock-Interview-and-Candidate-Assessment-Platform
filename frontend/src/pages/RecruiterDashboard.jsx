import React, { useEffect, useState } from 'react';
import { UserCheck, Users, Award, Search, ArrowUpRight, CheckCircle2, Sliders, BarChart2, Shield } from 'lucide-react';
import { fetchRecruiterAnalytics } from '../services/api';

export default function RecruiterDashboard({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('user-management'); // user-management, interview-management, analytics-dashboard, reports

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
        Loading Admin / Recruiter Interface Telemetry...
      </div>
    );
  }

  const filteredCandidates = data.candidates.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* EXPLICIT HEADER FOR ADMIN / RECRUITER INTERFACE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
            <Shield className="w-4 h-4" /> Admin / Recruiter Interface
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Management & Analytics Workspace</h1>
          <p className="text-xs text-slate-400">User Management, Interview Management, Analytics Dashboard & Reports</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search candidate or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 4 EXPLICIT SUB-MODULE TABS FROM ARCHITECTURE DIAGRAM */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('user-management')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'user-management' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> 1. User Management
        </button>

        <button
          onClick={() => setActiveSubTab('interview-management')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'interview-management' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> 2. Interview Management
        </button>

        <button
          onClick={() => setActiveSubTab('analytics-dashboard')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'analytics-dashboard' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> 3. Analytics Dashboard
        </button>

        <button
          onClick={() => setActivePage('interview-report')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'reports' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-400" /> 4. Reports
        </button>
      </div>

      {/* OVERVIEW STATS / ANALYTICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Total Evaluated Candidates</span>
          <div className="text-3xl font-extrabold text-white">{data.total_candidates}</div>
          <span className="text-[11px] text-cyan-400">User Management Active</span>
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

      {/* CANDIDATE EVALUATION TABLE / INTERVIEW MANAGEMENT */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">User & Interview Management Directory</h2>
          <span className="text-xs font-mono text-cyan-400">Total Records: {filteredCandidates.length}</span>
        </div>

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
