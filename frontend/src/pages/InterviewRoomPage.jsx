import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Edit3, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [visionMetrics, setVisionMetrics] = useState({ eyeContactRatio: 0.88, emotion: 'Focused' });
  const recognitionRef = useRef(null);

  const questions = sessionData?.questions || [
    {
      id: 1,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack",
      skill_focus: "System Design",
      question_text: "Describe a situation where a technical deployment failed in production. How did you diagnose and resolve it?",
      sample_answer: "I diagnosed the issue by inspecting server logs and error stack traces, identified a database pool connection leak, applied a hotfix patch to close unhandled connections, and restored system operations with zero data loss within 15 minutes."
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech Synthesis (AI Voiceover)
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      
      const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const engVoice = voices.find(v => v.lang.includes('en') || v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        utterance.voice = engVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto voiceover when new question loads
  useEffect(() => {
    setShowSampleAnswer(false);
    const timeout = setTimeout(() => {
      speakQuestion();
    }, 400);
    return () => clearTimeout(timeout);
  }, [currentIdx]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition (Microphone Speech-to-Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text.trim()) {
            setCandidateAnswer(prev => {
              if (prev.includes(text.trim())) return prev;
              return prev ? `${prev} ${text}` : text;
            });
          }
        };

        recognition.onend = () => {
          if (isRecording && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition active fallback mode:", err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [currentIdx, isRecording]);

  const toggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
    } else {
      setIsRecording(true);
    }
  };

  const insertSampleAnswer = () => {
    setCandidateAnswer(
      currentQ.sample_answer || 
      "I diagnosed the issue by inspecting server logs and error stack traces, identified a database pool connection leak, applied a hotfix patch to close unhandled connections, and restored system operations with zero data loss within 15 minutes."
    );
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    stopSpeaking();
    setSubmitting(true);
    
    await submitQuestionAnswer({
      session_id: sessionData?.session_id || 1,
      question_index: currentIdx + 1,
      question_text: currentQ.question_text,
      candidate_answer: candidateAnswer || currentQ.sample_answer || "In a production environment, I diagnose technical failures by analyzing server logs and error metrics.",
      transcript: candidateAnswer,
      eye_contact_ratio: visionMetrics.eyeContactRatio
    });

    setCandidateAnswer('');
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSubmitting(false);
    } else {
      const report = await finishInterviewSession(sessionData?.session_id || 1);
      setFinalReport(report);
      setSubmitting(false);
      setActivePage('interview-report');
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
              {sessionData?.title || "Technical Mock Interview (Full Stack Software Engineering)"}
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

      {/* MAIN TWO COLUMN LAYOUT */}
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
              onClick={toggleMic}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isRecording 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}
            >
              {isRecording ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
              {isRecording ? "Mic Speech Transcriber ON" : "Mic Speech Transcriber OFF"}
            </button>
          </div>
        </div>

        {/* AI INTERVIEWER PROMPT & RESPONSE COLUMN (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Question Card & Voiceover controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[10px] uppercase font-bold">
                {currentQ.category} • {currentQ.difficulty}
              </span>
              
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold animate-pulse"
                >
                  <VolumeX className="w-4 h-4" /> Stop Voiceover
                </button>
              ) : (
                <button
                  onClick={speakQuestion}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600 transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" /> Read Aloud (Voiceover)
                </button>
              )}
            </div>

            {/* AI Prompt box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 flex items-center justify-between">
                <span>AI Interviewer Prompt:</span>
                {isSpeaking && <span className="text-emerald-400 font-bold text-[10px] animate-pulse">🔊 AI Voice Reading...</span>}
              </span>
              <p className="text-base font-semibold text-white leading-relaxed">
                "{currentQ.question_text}"
              </p>
            </div>

            {/* AI SUGGESTED HIGH-SCORE ANSWER EXPANDER */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 overflow-hidden transition-all">
              <button
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> ✨ View AI High-Score Sample Answer
                </span>
                {showSampleAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSampleAnswer && (
                <div className="p-4 pt-2 border-t border-amber-500/20 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    "{currentQ.sample_answer || "Demonstrated comprehensive domain understanding with clear structured examples."}"
                  </p>
                  <button
                    onClick={insertSampleAnswer}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Auto-Fill This High-Score Answer into Textbox
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Response / Speech-to-Text Input Area */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cyan-400" /> Your Spoken Answer / Transcript:
              </span>
              <button
                onClick={insertSampleAnswer}
                className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Edit3 className="w-3 h-3" /> Auto-Fill Answer
              </button>
            </div>

            <textarea
              rows={4}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak aloud into your microphone (your words will transcribe automatically here) or click 'Auto-Fill Answer' above..."
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
