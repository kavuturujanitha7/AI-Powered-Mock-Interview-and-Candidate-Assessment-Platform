import React from 'react';
import { Bot, Volume2, Mic, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AIInterviewerAgent({ isSpeaking, isListening, currentDialogue, currentQuestion }) {
  return (
    <div className="glass-card p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 space-y-4 shadow-2xl relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[60px] pointer-events-none"></div>

      {/* AI AGENT AVATAR HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          {/* Animated Avatar Ring */}
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-0.5 shadow-lg ${isSpeaking ? 'animate-pulse ring-4 ring-cyan-500/40' : ''}`}>
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400">
                <Bot className="w-6 h-6" />
              </div>
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-ping"></span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Sarah <span className="text-[10px] text-indigo-400 font-mono font-normal bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">LLM AI Hiring Agent</span>
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                {isSpeaking ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Speaking Question...
                  </span>
                ) : isListening ? (
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening to Candidate...
                  </span>
                ) : (
                  <span className="text-slate-400">Ready for Next Answer</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> LLM Active
        </span>
      </div>

      {/* AI AGENT LIVE DIALOGUE SPEECH BUBBLE */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block font-bold">
          AI Agent Dialogue:
        </span>
        <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
          "{currentDialogue || "Welcome! Please turn on your camera and speak your answer out loud into the microphone."}"
        </p>
      </div>

    </div>
  );
}
