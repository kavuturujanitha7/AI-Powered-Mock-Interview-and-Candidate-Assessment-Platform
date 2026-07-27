import React, { useState } from 'react';
import { Video, Shield, Sliders, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { startInterviewSession } from '../services/api';

export default function InterviewSetupPage({ setActivePage, setInterviewSession }) {
  const [category, setCategory] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [domain, setDomain] = useState('Full Stack Software Engineering');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    setLoading(true);
    const session = await startInterviewSession(category, difficulty, domain, numQuestions);
    setInterviewSession(session);
    setLoading(false);
    setActivePage('interview-room');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <Sliders className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold font-display text-white">AI Interview Configuration</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Customize interview parameters, difficulty level, and technical domain prior to entering the live simulation room.
        </p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* CATEGORY SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">1. Select Interview Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Technical", desc: "Algorithms, Coding, System Design" },
              { name: "HR", desc: "Background, Career Goals, Culture" },
              { name: "Behavioral", desc: "Leadership, Problem Solving" },
              { name: "Aptitude", desc: "Logic, Numerical Reasoning" }
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCategory(item.name)}
                className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                  category === item.name
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{item.name}</span>
                  {category === item.name && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* DIFFICULTY SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">2. Select Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === level
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {level} Level
              </button>
            ))}
          </div>
        </div>

        {/* DOMAIN SELECTION */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">3. Select Target Technology Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="Full Stack Software Engineering">Full Stack Software Engineering (Python, React, Node)</option>
            <option value="Data Science & Machine Learning">Data Science, AI & Machine Learning</option>
            <option value="Cloud Architecture & DevOps">Cloud Architecture & DevOps (AWS, Docker, CI/CD)</option>
            <option value="General Software Developer">General Computer Science & Core IT</option>
          </select>
        </div>

        {/* NUM QUESTIONS */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>4. Number of Questions</span>
            <span className="text-cyan-400 font-mono">{numQuestions} Questions</span>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-900 rounded-lg cursor-pointer"
          />
        </div>

        <button
          onClick={handleLaunch}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Initializing AI Interview Room..." : "Enter Live Mock Interview Room"} <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
