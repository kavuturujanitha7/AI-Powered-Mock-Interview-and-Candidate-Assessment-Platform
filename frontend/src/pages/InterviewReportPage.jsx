import React, { useState } from 'react';
import { Award, Download, CheckCircle2, AlertTriangle, Lightbulb, Mic, Eye, BarChart, ArrowRight, Share2, Sparkles, FileText, Check, X, ShieldAlert } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InterviewReportPage({ finalReport, setActivePage }) {
  const [activeTab, setActiveTab] = useState('thread-evaluations'); // overview, transcript, thread-evaluations, speech-presence, interview-brief

  const report = finalReport || {
    session_id: 101,
    communication_score: 88.5,
    confidence_score: 84.0,
    technical_score: 86.0,
    professionalism_score: 90.0,
    overall_score: 87.1,
    performance_rating: "Good",
    filler_word_count: 2,
    words_per_minute: 138.5,
    eye_contact_ratio: 0.90,
    strengths: [
      "Clear verbal articulation with well-structured technical answers",
      "High eye-contact consistency during key summary statements",
      "Disciplined time management across all interview questions"
    ],
    weaknesses: [
      "Minor filler word usage during transition pauses ('you know')",
      "Could expand on specific architectural trade-offs in system design"
    ],
    improvement_tips: [
      "Use 2-second silent pauses to maintain an optimal 140 WPM pace.",
      "Incorporate the STAR methodology for behavioral questions.",
      "Recommended Study: Advanced System Design & API Security Patterns."
    ]
  };

  const threadEvaluations = [
    {
      id: 1,
      topic: "Explore journey into software development and backend architectural choices",
      depth: 5,
      accuracy: 5,
      specificity: 5,
      recovery: 5,
      status: "EXCELLENT",
      summary: "Candidate provided a comprehensive explanation of backend architecture, database choice, and asynchronous request handling."
    },
    {
      id: 2,
      topic: "Discuss approach to implementing secure email authentication and user-scoped data isolation in backend microservices",
      depth: 5,
      accuracy: 5,
      specificity: 4,
      recovery: 5,
      status: "EXCELLENT",
      summary: "Demonstrated strong knowledge of JWT authentication, stateless request validation, and foreign-key isolation rules."
    },
    {
      id: 3,
      topic: "System failure diagnosis and high-availability database pool recovery",
      depth: 4,
      accuracy: 5,
      specificity: 5,
      recovery: 5,
      status: "GOOD",
      summary: "Well-explained incident response strategy using stack trace inspection, hotfix deployment, and query connection pool tuning."
    }
  ];

  const downloadPDFReport = () => {
    const element = document.getElementById('report-container');
    if (!element) return;
    
    html2canvas(element, { scale: 2, backgroundColor: "#020617" }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SmartHire_AI_Assessment_Report_${report.session_id}.pdf`);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-4 px-6 rounded-2xl border border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">SESSION TAPE</span>
          <h1 className="text-xl font-bold font-display text-white flex items-center gap-2">
            HR • Backend Engineering Mock Evaluation
          </h1>
          <p className="text-xs text-slate-400">Medium difficulty • Completed 48 / 75 Score</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDFReport}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
          
          <button
            onClick={() => setActivePage('candidate-dashboard')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            Candidate Hub
          </button>
        </div>
      </div>

      {/* REPORT NAVIGATION TABS (MATCHING SCREENSHOT 2) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'transcript', label: 'Transcript' },
          { id: 'thread-evaluations', label: 'Thread Evaluations' },
          { id: 'speech-presence', label: 'Speech & Presence' },
          { id: 'interview-brief', label: 'Interview Brief' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRINTABLE / CANVAS CONTAINER */}
      <div id="report-container" className="space-y-8 p-2">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Candidate Performance Verdict</span>
                <h2 className="text-3xl font-extrabold text-white">
                  Overall Score: <span className="text-gradient">{report.overall_score}</span> / 100
                </h2>
                <p className="text-xs text-slate-300 max-w-md">
                  Formula: (Communication × 30%) + (Confidence × 25%) + (Technical × 30%) + (Professionalism × 15%)
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="px-6 py-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-center">
                  <span className="text-[10px] font-mono text-indigo-300 block uppercase">Performance Rating</span>
                  <span className="text-2xl font-extrabold text-white">{report.performance_rating}</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by SmartHire AI Engine
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Communication (30%)</span>
                <div className="text-2xl font-extrabold text-white font-mono">{report.communication_score}</div>
              </div>
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Confidence (25%)</span>
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">{report.confidence_score}</div>
              </div>
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Tech Relevance (30%)</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">{report.technical_score}</div>
              </div>
              <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Professionalism (15%)</span>
                <div className="text-2xl font-extrabold text-purple-400 font-mono">{report.professionalism_score}</div>
              </div>
            </div>
          </div>
        )}

        {/* THREAD EVALUATIONS TAB (MATCHING SCREENSHOT 2) */}
        {activeTab === 'thread-evaluations' && (
          <div className="space-y-6">
            {threadEvaluations.map((item) => (
              <div key={item.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-semibold text-slate-100 leading-relaxed font-sans max-w-xl">
                    {item.topic}
                  </p>
                  
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 ${
                    item.status === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* 4 MICRO METRIC CARDS (DEPTH, ACCURACY, SPECIFICITY, RECOVERY - MATCHING SCREENSHOT 2) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1">
                    <div className="text-lg font-bold font-mono text-white">{item.depth} <span className="text-[10px] text-slate-400 font-normal">/ 5</span></div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">DEPTH</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1">
                    <div className="text-lg font-bold font-mono text-cyan-400">{item.accuracy} <span className="text-[10px] text-slate-400 font-normal">/ 5</span></div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">ACCURACY</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1">
                    <div className="text-lg font-bold font-mono text-emerald-400">{item.specificity} <span className="text-[10px] text-slate-400 font-normal">/ 5</span></div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">SPECIFICITY</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center space-y-1">
                    <div className="text-lg font-bold font-mono text-purple-400">{item.recovery} <span className="text-[10px] text-slate-400 font-normal">/ 5</span></div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">RECOVERY</span>
                  </div>

                </div>

                <p className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-cyan-400 font-bold">AI Evaluator Note:</span> {item.summary}
                </p>

              </div>
            ))}
          </div>
        )}

        {/* SPEECH & PRESENCE TAB */}
        {activeTab === 'speech-presence' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Speaking Pace</span>
                <span className="text-lg font-bold text-white">{report.words_per_minute} WPM</span>
                <span className="text-[10px] text-emerald-400 block">Optimal Range (120-160)</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <BarChart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Filler Words Detected</span>
                <span className="text-lg font-bold text-white">{report.filler_word_count} Occurrences</span>
                <span className="text-[10px] text-slate-400 block font-mono">"um", "like", "you know"</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Eye-Contact Ratio</span>
                <span className="text-lg font-bold text-white">{Math.round((report.eye_contact_ratio || 0.90) * 100)}%</span>
                <span className="text-[10px] text-emerald-400 block">MediaPipe Camera Tracked</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
