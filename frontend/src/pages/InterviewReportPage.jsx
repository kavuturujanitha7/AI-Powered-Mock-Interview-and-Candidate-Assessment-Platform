import React from 'react';
import { Award, Download, CheckCircle2, AlertTriangle, Lightbulb, Mic, Eye, BarChart, ArrowRight, Share2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InterviewReportPage({ finalReport, setActivePage }) {
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
    eye_contact_ratio: 0.88,
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
          <h1 className="text-xl font-bold font-display text-white flex items-center gap-2">
            AI Assessment Report <span className="text-gradient">#Session-{report.session_id}</span>
          </h1>
          <p className="text-xs text-slate-400">Infosys 4-Factor Rubric Evaluation & Speech/Vision Telemetry</p>
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
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* PRINTABLE / CANVAS CONTAINER */}
      <div id="report-container" className="space-y-8 p-2">
        
        {/* OVERALL SCORE HERO CARD */}
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

        {/* 4 SCORING RUBRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">1. Communication (30%)</span>
            <div className="text-2xl font-extrabold text-white font-mono">{report.communication_score}</div>
            <p className="text-[11px] text-slate-400">Verbal clarity & sentence structure</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">2. Confidence (25%)</span>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{report.confidence_score}</div>
            <p className="text-[11px] text-slate-400">Eye contact & posture stability</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">3. Tech Relevance (30%)</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{report.technical_score}</div>
            <p className="text-[11px] text-slate-400">Answer accuracy & keyword match</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">4. Professionalism (15%)</span>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">{report.professionalism_score}</div>
            <p className="text-[11px] text-slate-400">Time management & etiquette</p>
          </div>

        </div>

        {/* SPEECH & VISION TELEMETRY METRICS */}
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
              <span className="text-lg font-bold text-white">{Math.round((report.eye_contact_ratio || 0.88) * 100)}%</span>
              <span className="text-[10px] text-emerald-400 block">MediaPipe Camera Tracked</span>
            </div>
          </div>
        </div>

        {/* STRENGTHS, WEAKNESSES & ACTIONABLE TIPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* STRENGTHS */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Identified Key Strengths</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.strengths.map((item, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WEAKNESSES & IMPROVEMENT TIPS */}
          <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Actionable Recommendations</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.improvement_tips.map((tip, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
