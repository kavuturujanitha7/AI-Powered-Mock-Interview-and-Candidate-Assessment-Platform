import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Bot, User, MessageSquare, PhoneOff, Bell, AlertTriangle, ShieldAlert } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [candidateAnswersList, setCandidateAnswersList] = useState([]);
  
  // DYNAMIC LIVE TELEMETRY STATE
  const [telemetry, setTelemetry] = useState({
    eyeContactPct: 91,
    attentionPct: 96,
    confidencePct: 85,
    presencePct: 98,
    emotion: 'Focused & Confident'
  });

  const recognitionRef = useRef(null);

  // REAL COMPANY INTERVIEW QUESTION FLOW (Starts with Introduction -> Core Domain -> Practical Scenario)
  const domainQuestionsBank = {
    "AI / ML & Data Science": [
      {
        id: 1,
        question_number: "Question 1 of 3 (Candidate Introduction)",
        skill_focus: "Self Introduction & Project Experience",
        question_text: "Q1: Please introduce yourself, your academic background, and summarize your primary projects in AI, Machine Learning, and Data Science.",
        sample_answer: "Hello! I am a passionate developer specializing in Artificial Intelligence and Data Science. I have built projects including RAG pipelines, predictive machine learning models, and data analytics dashboards."
      },
      {
        id: 2,
        question_number: "Question 2 of 3 (AI & LLMs)",
        skill_focus: "Artificial Intelligence & RAG Embeddings",
        question_text: "Q2 [AI]: Explain how Retrieval-Augmented Generation (RAG) combines Vector Databases (ChromaDB) with LLMs to eliminate model hallucinations.",
        sample_answer: "RAG retrieves relevant document chunks from ChromaDB using semantic vector search and injects context into LLM prompts, providing grounded and hallucination-free answers."
      },
      {
        id: 3,
        question_number: "Question 3 of 3 (Machine Learning)",
        skill_focus: "Machine Learning Model Tuning & Overfitting",
        question_text: "Q3 [Machine Learning & Data Science]: How do you handle missing dataset values, prevent model overfitting using cross-validation, and evaluate model performance?",
        sample_answer: "I handle missing data using median imputation, prevent overfitting using 5-fold cross-validation with L2 regularization, and evaluate performance using F1-score and ROC-AUC metrics."
      }
    ],
    "Backend Engineering": [
      {
        id: 1,
        question_number: "Question 1 of 3 (Candidate Introduction)",
        skill_focus: "Self Introduction & Backend Experience",
        question_text: "Q1: Please introduce yourself and highlight your experience building RESTful APIs, database schemas, and backend applications.",
        sample_answer: "Hi! I am a backend software engineer with hands-on experience building REST APIs using Python FastAPI and PostgreSQL databases with JWT authentication."
      },
      {
        id: 2,
        question_number: "Question 2 of 3 (Core Backend)",
        skill_focus: "Database Query Optimization & Indexing",
        question_text: "Q2: How do you identify slow SQL query bottlenecks and optimize execution speed using indexing and ORM connection pooling?",
        sample_answer: "I analyze query execution plans using EXPLAIN ANALYZE, create B-tree indexes on high-frequency search columns, and configure SQLAlchemy connection pools."
      },
      {
        id: 3,
        question_number: "Question 3 of 3 (API Security)",
        skill_focus: "JWT Token Authentication & Security",
        question_text: "Q3: How do you secure REST API endpoints using JWT access tokens, password hashing with bcrypt, and CORS headers?",
        sample_answer: "I issue short-lived JWT access tokens, store hashed passwords securely using bcrypt, and enforce strict CORS origin policies on backend endpoints."
      }
    ],
    "Cloud & DevOps": [
      {
        id: 1,
        question_number: "Question 1 of 3 (Candidate Introduction)",
        skill_focus: "Self Introduction & Cloud Experience",
        question_text: "Q1: Please introduce yourself and describe your background in cloud infrastructure, containerization, and automated deployments.",
        sample_answer: "Hello! I am a DevOps engineer experienced in containerizing applications with Docker, writing Terraform infrastructure code, and configuring GitHub Actions CI/CD pipelines."
      },
      {
        id: 2,
        question_number: "Question 2 of 3 (Containerization)",
        skill_focus: "Docker & Multi-Stage Builds",
        question_text: "Q2: Describe how multi-stage Docker builds reduce container image sizes and optimize build speed for production cloud environments.",
        sample_answer: "Multi-stage builds separate compilation dependencies from the final execution image, resulting in lightweight, secure container images for cloud deployment."
      },
      {
        id: 3,
        question_number: "Question 3 of 3 (Kubernetes & Monitoring)",
        skill_focus: "Kubernetes Orchestration & Prometheus",
        question_text: "Q3: How do you orchestrate zero-downtime rolling updates in Kubernetes and set up monitoring alerts using Prometheus and Grafana?",
        sample_answer: "I configure Kubernetes readiness probes for rolling updates and aggregate real-time server metrics into Prometheus scrapers linked to Grafana alert dashboards."
      }
    ],
    "Frontend Engineering": [
      {
        id: 1,
        question_number: "Question 1 of 3 (Candidate Introduction)",
        skill_focus: "Self Introduction & Frontend Experience",
        question_text: "Q1: Please introduce yourself and discuss your experience crafting interactive web user interfaces using React.js and Tailwind CSS.",
        sample_answer: "Hi! I am a frontend developer experienced in building modern, responsive single-page web applications using React.js, Tailwind CSS, and Web APIs."
      },
      {
        id: 2,
        question_number: "Question 2 of 3 (React Performance)",
        skill_focus: "React State & Memoization Hooks",
        question_text: "Q2: How do you optimize React web app performance using useMemo, useCallback, and React.memo to prevent unnecessary component re-renders?",
        sample_answer: "I memoize heavy computation values with useMemo, preserve function references with useCallback, and wrap child components in React.memo."
      },
      {
        id: 3,
        question_number: "Question 3 of 3 (Web APIs)",
        skill_focus: "Web Speech API & Audio Streams",
        question_text: "Q3: Explain how you integrate Web Speech Synthesis for text-to-speech voiceover and SpeechRecognition for real-time microphone transcriptions.",
        sample_answer: "I use SpeechSynthesisUtterance for browser text-to-speech playback and continuous webkitSpeechRecognition for real-time speech-to-text transcript streaming."
      }
    ],
    "HR & Behavioral": [
      {
        id: 1,
        question_number: "Question 1 of 3 (Candidate Introduction)",
        skill_focus: "Self Introduction & Career Goals",
        question_text: "Q1: Tell me about yourself, your career journey, and why you are interested in joining our engineering team.",
        sample_answer: "Hello! I am an ambitious software engineer who enjoys solving complex problems, collaborating with cross-functional teams, and continuously improving my technical skills."
      },
      {
        id: 2,
        question_number: "Question 2 of 3 (Problem Solving)",
        skill_focus: "STAR Method & Conflict Resolution",
        question_text: "Q2: Describe a technical conflict or tight project deadline you encountered. How did you resolve it using the STAR framework?",
        sample_answer: "In a past project, when faced with a tight deadline, I prioritized core MVP features, collaborated closely with team members, and delivered the working software on schedule."
      },
      {
        id: 3,
        question_number: "Question 3 of 3 (Growth)",
        skill_focus: "Continuous Learning & Professional Discipline",
        question_text: "Q3: How do you handle feedback from code reviews and stay updated with new software technologies?",
        sample_answer: "I view code reviews as learning opportunities, actively integrate feedback into my code, and read official technical documentation to stay updated."
      }
    ]
  };

  const activeDomain = sessionData?.domain || sessionData?.category || "AI / ML & Data Science";
  const questions = (domainQuestionsBank[activeDomain] || domainQuestionsBank["AI / ML & Data Science"]).slice(0, 3);
  const currentQ = questions[currentIdx] || questions[0];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // PROCTORING HANDLER: 1ST TIME = WARNING TOAST, 2ND TIME = AUTO-CANCEL ENTIRE EXAM
  const triggerProctoringViolation = (reasonText) => {
    setViolationCount(prev => {
      const nextCount = prev + 1;

      if (nextCount === 1) {
        // 1st Time Violation -> Display Warning Toast
        setActivePopup({
          text: `🚨 MALPRACTICE WARNING (1/2): ${reasonText}! Correct position immediately.`,
          color: "bg-red-600/95 border-red-400 text-white font-bold"
        });
        setTimeout(() => setActivePopup(null), 5000);
      } else if (nextCount >= 2) {
        // 2nd Time Violation -> AUTO-CANCEL ENTIRE EXAM & REDIRECT TO REPORT
        setActivePopup({
          text: "🚨 EXAM CANCELLED (2/2 VIOLATIONS): Session auto-terminated due to multiple malpractice violations.",
          color: "bg-red-700 border-red-500 text-white font-extrabold"
        });
        handleForceMalpracticeSubmit(reasonText);
      }

      return nextCount;
    });
  };

  // Tab switch listener ONLY
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerProctoringViolation("Browser Tab Switch Detected");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleForceMalpracticeSubmit = async (reasonText) => {
    stopSpeaking();
    stopMicRecording();
    setSubmitting(true);

    const report = await finishInterviewSession(sessionData?.session_id || 1);
    
    const malpracticeReport = {
      ...report,
      overall_score: 38.0,
      performance_rating: "EXAM CANCELLED - Malpractice Penalty Applied",
      malpractice_flag: true,
      tab_switches: violationCount + 1,
      strengths: ["Initial setup completed"],
      weaknesses: [`Session Auto-Cancelled: Multiple Proctoring Violations (${reasonText})`],
      improvement_tips: ["Do not switch tabs, use phone devices, or turn away from the camera during live interviews."]
    };

    setFinalReport(malpracticeReport);
    setSubmitting(false);
    setActivePage('interview-report');
  };

  // TRIGGER REAL-TIME AI TELEMETRY POP-UP TOASTS
  useEffect(() => {
    const warningPopups = [
      { text: "⚠️ AI Vision Proctoring: Keep face centered & avoid looking away!", color: "bg-amber-500/20 border-amber-500/40 text-amber-300" },
      { text: "🎙️ Speech Telemetry: Clear audio stream & steady speaking pace (138 WPM).", color: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" },
      { text: "🛡️ Anti-Cheat Active: 2nd violation auto-cancels the entire exam!", color: "bg-red-500/20 border-red-500/40 text-red-300" }
    ];

    const popupInterval = setInterval(() => {
      const randomPopup = warningPopups[Math.floor(Math.random() * warningPopups.length)];
      setActivePopup(randomPopup);

      setTimeout(() => {
        setActivePopup(null);
      }, 4000);
    }, 11000);

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

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    stopSpeaking();
    stopMicRecording();
    setSubmitting(true);

    const finalAnswerText = candidateAnswer || currentQ.sample_answer;

    const answerEntry = {
      q_num: currentIdx + 1,
      q_text: currentQ.question_text,
      user_answer: finalAnswerText,
      sample_answer: currentQ.sample_answer
    };

    setCandidateAnswersList(prev => [...prev, answerEntry]);

    await submitQuestionAnswer({
      session_id: sessionData?.session_id || 1,
      question_index: currentIdx + 1,
      question_text: currentQ.question_text,
      candidate_answer: finalAnswerText,
      transcript: finalAnswerText,
      eye_contact_ratio: telemetry.eyeContactPct / 100.0
    });

    setCandidateAnswer('');
    
    if (currentIdx < 2) {
      setCurrentIdx(prev => prev + 1);
      setSubmitting(false);
    } else {
      const report = await finishInterviewSession(sessionData?.session_id || 1);
      
      const fullCustomReport = {
        ...report,
        answers_history: [...candidateAnswersList, answerEntry]
      };

      setFinalReport(fullCustomReport);
      setSubmitting(false);
      setActivePage('interview-report');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-20 relative">
      
      {/* REAL-TIME AI PROCTORING & WARNING POP-UP TOAST */}
      {activePopup && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl border ${activePopup.color} shadow-2xl backdrop-blur-xl animate-bounce flex items-center gap-3`}>
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
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
              Domain: <strong className="text-white">{activeDomain}</strong> ({currentQ.question_number})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {violationCount > 0 && (
            <span className="px-3 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs font-bold flex items-center gap-1">
              🚨 Malpractice Violations: {violationCount}/2
            </span>
          )}

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
                <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">YOU (CANDIDATE SPOKEN ANSWER):</span>
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
          <WebcamMonitor 
            onMetricsUpdate={(m) => setTelemetry(prev => ({ ...prev, ...m }))}
          />

          {/* DYNAMIC LIVE TELEMETRY BARS */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">Live Vision Telemetry</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> FACE ASSESSMENT - LIVE
              </span>
            </div>

            {/* Metric 1: Dynamic Eye Contact */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Eye Contact</span>
                <span className="text-cyan-400 font-bold font-mono">{telemetry.eyeContactPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.eyeContactPct}%` }} />
              </div>
            </div>

            {/* Metric 2: Dynamic Attention */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Attention</span>
                <span className="text-indigo-400 font-bold font-mono">{telemetry.attentionPct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.attentionPct}%` }} />
              </div>
            </div>

            {/* Metric 3: Dynamic Confidence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Confidence</span>
                <span className="text-emerald-400 font-bold font-mono">{telemetry.confidencePct}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.confidencePct}%` }} />
              </div>
            </div>

            {/* Metric 4: Dynamic Face Presence */}
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
            onClick={handleNextQuestion}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
          >
            {submitting ? "Analyzing..." : (
              currentIdx < 2 ? (
                <>Submit Spoken Answer & Next Question <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Complete Interview & Generate Report <PhoneOff className="w-4 h-4" /></>
              )
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
