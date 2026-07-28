import React from 'react';
import { Sparkles, Video, FileText, BarChart2, ShieldCheck, ArrowRight, Brain, Mic, Eye, Award, CheckCircle } from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 text-center max-w-5xl mx-auto px-4">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Next-Generation Candidate Assessment Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
          Master Tech & HR Interviews with <br />
          <span className="text-gradient">Real-Time AI Coaching</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          SmartHire AI combines Speech Analysis, Eye-Contact & Emotion Tracking, Resume Skill Extraction, and AI Question Generation to accelerate candidate interview readiness.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('interview-setup')}
            className="px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            Start Mock Interview <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setActivePage('resume-upload')}
            className="px-7 py-3.5 rounded-2xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Upload Resume for AI Analysis
          </button>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Speech & WPM Analysis", icon: Mic, color: "text-cyan-400" },
            { label: "Eye Contact & Emotion", icon: Eye, color: "text-indigo-400" },
            { label: "Resume PDF Parsing", icon: FileText, color: "text-emerald-400" },
            { label: "Multi-Criteria Rubric", icon: Award, color: "text-purple-400" }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3 text-left">
              <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200">{item.label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* CORE MODULES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">System Architecture & Modules</h2>
          <p className="text-slate-400 text-sm mt-2">Built for Automated Candidate Interview Preparation & Assessment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Module 1 */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800/80 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Resume Skill Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated PDF parser extracts technical skills, technologies, experience levels, and domain experience to personalize interview questions.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> PDF Parsing Engine</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Technology & Skill Detection</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Candidate Summary Generator</li>
            </ul>
          </div>

          {/* Module 2 */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800/80 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. AI Interview Simulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive interview room with live webcam face-mesh monitoring, microphone audio waveform visualizer, and customizable question categories.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> HR, Tech, Behavioral & Aptitude</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Real-time STT Speech Transcript</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Timer & Session State Control</li>
            </ul>
          </div>

          {/* Module 3 */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800/80 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Multi-Criteria Scoring & Rubric</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates performance using exact weighted rubric: Communication (30%), Confidence (25%), Technical Relevance (30%), Professionalism (15%).
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Filler Word & WPM Counter</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Eye Contact Consistency %</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Downloadable Performance Report</li>
            </ul>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-card p-10 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-3xl font-bold text-white">Ready for your AI Mock Assessment?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Experience the complete end-to-end workflow: Upload your resume, take a simulated technical interview, and inspect your AI evaluation report.
          </p>

          <button
            onClick={() => setActivePage('interview-setup')}
            className="px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Launch Interview Session Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
