import React, { useEffect, useState } from 'react';
import { Award, Video, FileText, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Play, RefreshCcw } from 'lucide-react';
import { fetchCandidateDashboard } from '../services/api';

export default function CandidateDashboard({ setActivePage, setSelectedSessionId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetchCandidateDashboard();
      setData(res);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs animate-pulse">
        Loading Candidate Analytics & Interview History...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-16">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Welcome back, <span className="text-gradient">{data.user_name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track your AI performance metrics, speech telemetry, and readiness score.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('resume-upload')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Upload Resume
          </button>
          
          <button
            onClick={() => setActivePage('interview-setup')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" /> Start New Interview
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Average Overall Score</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{data.average_overall_score} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
          <div className="text-[11px] text-emerald-400 font-medium">Ranked: Good Candidate</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Interviews Attended</span>
            <Video className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{data.completed_interviews}</div>
          <div className="text-[11px] text-slate-400">Completed Sessions</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Resumes Uploaded</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{data.resumes_uploaded}</div>
          <div className="text-[11px] text-emerald-400">Skill Extraction Active</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Readiness Status</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            Interview Ready
          </div>
          <div className="text-[11px] text-slate-400">High Confidence Rating</div>
        </div>

      </div>

      {/* TWO COLUMN GRID: SKILL BREAKDOWN & WEAK-AREA PREDICTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SKILL-WISE BREAKDOWN BARS */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Skill-Wise Assessment Metrics</h2>
              <p className="text-xs text-slate-400">Based on SmartHire 4-Factor Assessment Rubric</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Rubric Verified
            </span>
          </div>

          <div className="space-y-4">
            {data.skill_breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.skill}</span>
                  <span className="text-indigo-400 font-mono">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Rubric Weight: 30% Comm, 25% Conf, 30% Tech, 15% Prof</span>
            <span className="text-emerald-400 font-medium">Target: &gt;80%</span>
          </div>
        </div>

        {/* WEAK AREA PREDICTION CARD */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Weak-Area Diagnostic</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            AI analysis of your speech pace and posture during technical answers:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <span className="text-amber-400 font-semibold block">Filler Word Frequency</span>
              <p className="text-slate-400 text-[11px]">Slight hesitation detected on system design questions. Practice 2-second silent pauses.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
              <span className="text-cyan-400 font-semibold block">System Architecture Depth</span>
              <p className="text-slate-400 text-[11px]">Include microservices & caching keywords to maximize Technical Relevance score.</p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('interview-setup')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition-all flex items-center justify-center gap-1.5"
          >
            Practice Weak Areas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* RECENT SESSIONS TABLE */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Interview Session History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4">Title / Domain</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {data.recent_sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100">{session.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[10px]">
                      {session.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{session.difficulty}</td>
                  <td className="py-3 px-4 font-bold font-mono text-cyan-400">{session.overall_score} / 100</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      session.performance_rating === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                      session.performance_rating === 'Good' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {session.performance_rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{session.created_at}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        if (setSelectedSessionId) setSelectedSessionId(session.id);
                        setActivePage('interview-report');
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all text-[11px] font-medium"
                    >
                      View Report
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
