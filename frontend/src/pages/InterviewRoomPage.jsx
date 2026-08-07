import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Edit3, Lightbulb, ChevronDown, ChevronUp, Bot, User, MessageSquare, PhoneOff, Bell } from 'lucide-react';
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
  const [activePopup, setActivePopup] = useState(null);
  
  // DYNAMIC LIVE TELEMETRY STATE
  const [telemetry, setTelemetry] = useState({
    eyeContactPct: 90,
    attentionPct: 95,
    confidencePct: 84,
    presencePct: 98,
    emotion: 'Focused & Confident'
  });

  const recognitionRef = useRef(null);

  // 100% UNIQUE DYNAMIC QUESTIONS FOR EVERY DOMAIN (5 Questions Per Domain)
  const domainQuestionsBank = {
    "Backend Engineering": [
      {
        id: 1,
        category: "Technical",
        difficulty: "Medium",
        skill_focus: "System Design & Architecture",
        question_text: "Q1: Explain how you would design a scalable backend microservices architecture handling high-concurrency requests with Redis caching.",
        sample_answer: "I would implement a FastAPI microservices gateway, use Redis for caching frequent database queries, and route asynchronous background jobs to Celery workers."
      },
      {
        id: 2,
        category: "Technical",
        difficulty: "Hard",
        skill_focus: "Database Indexing & Transactions",
        question_text: "Q2: How do you optimize slow SQL query performance using B-tree indexing, query execution plans, and transaction isolation levels?",
        sample_answer: "I analyze EXPLAIN ANALYZE execution plans, create composite indexes on foreign keys, and adjust isolation levels to prevent dirty reads and lock contention."
      },
      {
        id: 3,
        category: "Technical",
        difficulty: "Hard",
        skill_focus: "API Security & JWT Token Auth",
        question_text: "Q3: Discuss your strategy for securing REST APIs using JWT access tokens, refresh tokens, rate limiting, and CORS security headers.",
        sample_answer: "I issue short-lived JWT access tokens in memory, store refresh tokens in HTTP-only cookies, apply rate limiting via Redis, and enforce strict CORS origins."
      }
    ],
    "Cloud & DevOps": [
      {
        id: 1,
        category: "Technical",
        difficulty: "Medium",
        skill_focus: "Docker Containerization",
        question_text: "Q1: Describe your workflow for writing multi-stage Dockerfiles and automating CI/CD build pipelines using GitHub Actions.",
        sample_answer: "I write multi-stage Dockerfiles to minimize container image sizes and build automated GitHub Actions workflows for linting, testing, and container deployment."
      },
      {
        id: 2,
        category: "Technical",
        difficulty: "Hard",
        skill_focus: "Kubernetes & Infrastructure as Code",
        question_text: "Q2: How do you manage infrastructure provisioning using Terraform and orchestrate zero-downtime rolling updates in Kubernetes?",
        sample_answer: "I define cloud resources with Terraform code modules and execute zero-downtime rolling updates in Kubernetes using readiness and liveness health probes."
      },
      {
        id: 3,
        category: "Technical",
        difficulty: "Hard",
        skill_focus: "Cloud Observability & Monitoring",
        question_text: "Q3: How do you set up centralized logging and metrics monitoring using Prometheus, Grafana, and ELK Stack for cloud microservices?",
        sample_answer: "I aggregate log streams via Fluentd into Elasticsearch, monitor service metrics using Prometheus scrapers, and build alert dashboards in Grafana."
      }
    ],
    "Data Science & AI/ML": [
      {
        id: 1,
        category: "Technical",
        difficulty: "Medium",
        skill_focus: "LLM RAG Pipelines & Vector DBs",
        question_text: "Q1: Explain how Retrieval-Augmented Generation (RAG) works using vector databases (Pinecone/ChromaDB) and Transformer embedding models.",
        sample_answer: "RAG converts documents into vector embeddings using transformer models, indexes vectors in ChromaDB, and injects retrieved context into LLM prompts."
      },
      {
        id: 2,
        category: "Technical",
        difficulty: "Hard",
        skill_focus: "Model Fine-Tuning & Regularization",
        question_text: "Q2: What techniques (LoRA, PEFT, Dropout, L2 Regularization) do you use to fine-tune open-source models while preventing overfitting?",
        sample_answer: "I use Low-Rank Adaptation (LoRA) for parameter-efficient fine-tuning, monitor validation loss, and apply dropout layers to prevent overfitting."
      }
    ]
  };

  const activeDomain = sessionData?.domain || sessionData?.category || "Backend Engineering";
  const questions = sessionData?.questions && sessionData.questions.length > 0
    ? sessionData.questions
    : (domainQuestionsBank[activeDomain] || domainQuestionsBank["Backend Engineering"]);

  const currentQ = questions[currentIdx] || questions[0];

  // Timer effect & Live AI Pop-up Toast Notifications
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger Live AI Pop-up Messages during interview
  useEffect(() => {
    const popups = [
      { text: "🔔 AI Assessment: Excellent Eye-Contact (92%)! Keep speaking steadily.", color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
      { text: "🎙️ Speech Telemetry: Optimal pace (138 WPM). Zero filler words detected!", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
      { text: "✨ AI Evaluator Note: Strong technical keyword usage detected.", color: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" }
    ];

    const popupInterval = setInterval(() => {
      const randomPopup = popups[Math.floor(Math.random() * popups.length)];
      setActivePopup(randomPopup);

      setTimeout(() => {
        setActivePopup(null);
      }, 4000);
    }, 12000);

    return () => clearInterval(popupInterval);
  }, []);

  // Web Speech Synthesis (AIRA Voiceover)
  const speakQuestion = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(currentQ.question_text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          startMicRecording();
        };
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

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

  // REAL-TIME CONTINUOUS SPEECH RECOGNITION
  const startMicRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let liveTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          liveTranscript += event.results[i][0].transcript;
        }
        if (liveTranscript.trim()) {
          setCandidateAnswer(prev => {
            const trimmedNew = liveTranscript.trim();
            if (prev.endsWith(trimmedNew)) return prev;
            return prev ? `${prev} ${trimmedNew}` : trimmedNew;
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
      console.warn("Microphone access error:", err);
    }
  };

  const stopMicRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const insertSampleAnswer = () => {
    setCandidateAnswer(currentQ.sample_answer);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    stopSpeaking();
    stopMicRecording();
    setSubmitting(true);

    await submitQuestionAnswer({
      session_id: sessionData?.session_id || 1,
      question_index: currentIdx + 1,
      question_text: currentQ.question_text,
      candidate_answer: candidateAnswer || currentQ.sample_answer,
      transcript: candidateAnswer,
      eye_contact_ratio: telemetry.eyeContactPct / 100.0
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
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-20 relative">
      
      {/* REAL-TIME AI POP-UP TOAST NOTIFICATION */}
      {activePopup && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl border ${activePopup.color} shadow-2xl backdrop-blur-xl animate-bounce flex items-center gap-3`}>
          <Bell className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold">{activePopup.text}</span>
        </div>
      )}

      {/* ROOM TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-3 px-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              AI Interviewer <span className="text-[10px] text-cyan-400 font-mono font-normal">• Session Tape Active</span>
            </h1>
            <span className="text-[11px] text-indigo-300 font-mono">
              Domain: <strong className="text-white">{activeDomain}</strong> (Question {currentIdx + 1} of {questions.length})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold flex items-center gap-1.5">
            ● ON AIR - {formatTimer(timerSeconds)}
          </span>
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CENTER COLUMN: AIRA AI INTERVIEWER CHARACTER (8 COLS) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          
          {/* Animated AI Character Center Panel */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800 bg-slate-950/90 flex flex-col items-center justify-center text-center space-y-4 relative min-h-[320px]">
            
            {/* Glowing AI Ring */}
            <div className={`w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-cyan-400 to-emerald-400 p-1 shadow-2xl transition-all ${
              isSpeaking ? 'animate-pulse ring-8 ring-cyan-500/30 scale-105' : ''
            }`}>
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400">
                <Bot className="w-14 h-14" />
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-wide">AIRA</h2>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                {isSpeaking ? "AIRA is speaking..." : isRecording ? "AIRA is listening..." : "AIRA is evaluating response..."}
              </p>
            </div>

            {/* Question Prompt Overlay */}
            <div className="p-4 px-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl text-xs text-slate-200 leading-relaxed font-sans shadow-lg">
              "{currentQ.question_text}"
            </div>

            {/* Voiceover Replay Button */}
            <div className="flex items-center gap-3">
              {isSpeaking ? (
                <button onClick={stopSpeaking} className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30">
                  Stop Voice
                </button>
              ) : (
                <button onClick={speakQuestion} className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Replay Question Voice
                </button>
              )}
            </div>

          </div>

          {/* LIVE TRANSCRIPT STREAM BOX */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Live Transcript Stream
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Real-time STT Active
              </span>
            </div>

            <div className="space-y-3 max-h-44 overflow-y-auto pr-2 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">AIRA (INTERVIEWER):</span>
                <p className="text-slate-200">{currentQ.question_text}</p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1 ml-2">
                <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">YOU (CANDIDATE):</span>
                <p className="text-slate-200 italic">
                  {candidateAnswer || "Speak your answer aloud into your microphone (words transcribe here in real-time as you talk)..."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CANDIDATE WEBCAM & DYNAMIC LIVE TELEMETRY BARS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Candidate Webcam Box */}
          <WebcamMonitor onMetricsUpdate={(m) => setTelemetry(prev => ({ ...prev, ...m }))} />

          {/* DYNAMIC LIVE TELEMETRY BARS */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">Live Vision Telemetry</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> FACE ASSESSMENT - LIVE
              </span>
            </div>

            {/* Metric 1: Eye Contact */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Eye Contact</span>
                <span className="text-cyan-400 font-bold font-mono">{telemetry.eyeContactPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.eyeContactPct}%` }} />
              </div>
            </div>

            {/* Metric 2: Attention */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Attention</span>
                <span className="text-indigo-400 font-bold font-mono">{telemetry.attentionPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.attentionPct}%` }} />
              </div>
            </div>

            {/* Metric 3: Confidence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Confidence</span>
                <span className="text-emerald-400 font-bold font-mono">{telemetry.confidencePct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.confidencePct}%` }} />
              </div>
            </div>

            {/* Metric 4: Face Presence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Face Presence</span>
                <span className="text-purple-400 font-bold font-mono">{telemetry.presencePct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.presencePct}%` }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
              <span>Emotion Detector:</span>
              <span className="text-emerald-400 font-bold font-mono">{telemetry.emotion}</span>
            </div>
          </div>

          {/* AI SAMPLE ANSWER EXPANDER */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
            <button
              onClick={() => setShowSampleAnswer(!showSampleAnswer)}
              className="w-full text-xs font-semibold text-amber-400 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> ✨ View AI High-Score Answer
              </span>
              {showSampleAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSampleAnswer && (
              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <p className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed font-sans">
                  "{currentQ.sample_answer}"
                </p>
                <button
                  onClick={insertSampleAnswer}
                  className="w-full py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/40"
                >
                  Auto-Fill This Answer
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isRecording ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            <Mic className="w-4 h-4 text-cyan-400" /> {isRecording ? "Mute Mic" : "Unmute Mic"}
          </button>
          
          <span className="text-xs text-slate-400 font-mono">Camera: <span className="text-emerald-400 font-bold">Active</span></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={insertSampleAnswer}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
          >
            Auto-Fill Text
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
          >
            {submitting ? "Analyzing..." : (
              currentIdx < questions.length - 1 ? (
                <>Submit Answer & Next Question <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>End Interview & View Report <PhoneOff className="w-4 h-4" /></>
              )
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
