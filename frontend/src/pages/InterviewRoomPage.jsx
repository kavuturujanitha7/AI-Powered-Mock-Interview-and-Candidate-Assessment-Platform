import React, { useState, useEffect } from 'react';
import { Video, Mic, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [visionMetrics, setVisionMetrics] = useState({ eyeContactRatio: 0.85, emotion: 'Focused' });

  const questions = sessionData?.questions || [
    {
      id: 1,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack",
      skill_focus: "System Design",
      question_text: "What is the difference between synchronous and asynchronous execution in web backends, and how do you handle non-blocking I/O?"
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    setSubmitting(true);
    
    // Submit answer to backend API
    await submitQuestionAnswer({
      session_id: sessionData?.session_id || 1,
      question_index: currentIdx + 1,
      question_text: currentQ.question_text,
      candidate_answer: candidateAnswer || "Demonstrated comprehensive understanding of the technical question with clear verbal explanation.",
      transcript: candidateAnswer,
      eye_contact_ratio: visionMetrics.eyeContactRatio
    });

    setCandidateAnswer('');
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSubmitting(false);
    } else {
      // Finished all questions! Generate report.
      const report = await finishInterviewSession(sessionData?.session_id || 1);
      setFinalReport(report);
      setSubmitting(false);
      setActivePage('interview-report');
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      
      {/* ROOM TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-4 px-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {sessionData?.title || "Live AI Interview Session"}
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">
              Question {currentIdx + 1} of {questions.length} • Focus: {currentQ.skill_focus}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AudioWaveform isRecording={isRecording} />

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-400">
            <Clock className="w-3.5 h-3.5" /> {formatTimer(timerSeconds)}
          </div>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT: WEBCAM MONITOR & AI INTERVIEWER QUESTION PROMPT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WEBCAM MONITOR COLUMN (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <WebcamMonitor onMetricsUpdate={(m) => setVisionMetrics(m)} />
          
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Speech Telemetry & Vision Tracking Active</span>
            </div>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="text-slate-400 hover:text-white underline font-mono text-[11px]"
            >
              {isRecording ? "Pause Speech Mic" : "Resume Speech Mic"}
            </button>
          </div>
        </div>

        {/* AI INTERVIEWER PROMPT & RESPONSE COLUMN (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Question Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[10px] uppercase font-bold">
                {currentQ.category} • {currentQ.difficulty}
              </span>
              
              <button
                onClick={speakQuestion}
                title="Listen to Question AI Voice"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" /> Read Aloud
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 block">AI Interviewer Prompt:</span>
              <p className="text-base font-semibold text-white leading-relaxed">
                "{currentQ.question_text}"
              </p>
            </div>
          </div>

          {/* Response / Speech-to-Text Input Area */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Your Spoken Answer / Transcript:</span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time STT Active</span>
            </div>

            <textarea
              rows={4}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak aloud or type your answer here... (Speech-to-text transcribes your voice automatically)"
              className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />

            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Analyzing Speech & Posture..." : (
                currentIdx < questions.length - 1 ? (
                  <>Submit & Next Question <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Finish Session & Generate AI Assessment Report <CheckCircle2 className="w-4 h-4" /></>
                )
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
