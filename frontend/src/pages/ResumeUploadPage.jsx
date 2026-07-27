import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, Sparkles, ArrowRight, FileCheck, Layers } from 'lucide-react';
import { uploadResumeFile } from '../services/api';

export default function ResumeUploadPage({ setActivePage }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setParsing(true);
    const res = await uploadResumeFile(file);
    setParsedResult(res);
    setParsing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold font-display text-white">AI Resume & Skill Extraction Workflow</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Upload your resume PDF to extract skills, experience, and personalize AI-generated mock interview questions.
        </p>
      </div>

      {/* UPLOAD ZONE */}
      <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition-all text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
          <Upload className="w-8 h-8" />
        </div>

        <div>
          <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2 transition-all">
            <FileText className="w-4 h-4" /> Select PDF Resume
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
          </label>
          <p className="text-[11px] text-slate-400 mt-2">Supports PDF files up to 10MB</p>
        </div>

        {file && (
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl max-w-xs mx-auto flex items-center justify-between text-xs text-slate-200">
            <span className="truncate font-mono">{file.name}</span>
            <span className="text-[10px] text-emerald-400 font-bold">Ready</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || parsing}
          className={`w-full max-w-xs py-3 rounded-xl font-bold text-xs shadow-lg transition-all ${
            !file || parsing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-indigo-500/25 hover:scale-105'
          }`}
        >
          {parsing ? "Parsing Resume PDF..." : "Extract Skills with AI"}
        </button>
      </div>

      {/* PARSED SKILLS RESULTS PREVIEW */}
      {parsedResult && (
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Extracted Candidate Profile</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Resume Parsed Successfully
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Detected Skill Matrix:</span>
              <div className="flex flex-wrap gap-2">
                {parsedResult.parsed_skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-slate-400">Experience Level:</span>
                <p className="text-xs font-semibold text-white">{parsedResult.parsed_experience}</p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-slate-400">Education Background:</span>
                <p className="text-xs font-semibold text-white">{parsedResult.parsed_education}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Generated Executive Summary:</span>
              <p className="text-xs text-slate-300 leading-relaxed">{parsedResult.parsed_summary}</p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('interview-setup')}
            className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Generate Customized AI Interview Questions <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      )}

    </div>
  );
}
