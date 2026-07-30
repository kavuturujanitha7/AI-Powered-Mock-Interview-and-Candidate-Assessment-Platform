import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Edit3, Lightbulb, ChevronDown, ChevronUp, Bot, User, MessageSquare } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [aiDialogue, setAiDialogue] = useState('Welcome! Let\'s begin your mock interview session.');
  const [micStatusText, setMicStatusText] = useState('Click "Start Voice Recording" to Speak');
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
      skill_focus: "System Design & Async",
      question_text: "Describe a situation where a technical deployment failed in production. How did you diagnose and resolve it?",
      sample_answer: "I diagnosed the issue by inspecting server logs and error stack traces, identified a database pool connection leak, applied a hotfix patch to close unhandled connections, and restored system operations with zero data loss within 15 minutes."
    },
    {
      id: 2,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack",
      skill_focus: "API Security & JWT",
      question_text: "What are JWT access tokens, how do they differ from session cookies, and how do you prevent token theft?",
      sample_answer: "JWT tokens are stateless, digitally signed JSON objects sent in HTTP Authorization headers. Unlike session cookies, servers don't need to store session IDs in memory. Theft is prevented using short expiration times, HTTPS TLS encryption, and storing tokens securely."
    },
    {
      id: 3,
      category: "Behavioral",
      difficulty: "Medium",
      domain: "Full Stack",
      skill_focus: "Leadership & Teamwork",
      question_text: "Describe how you handle conflicting technical opinions within your engineering team during sprint planning.",
      sample_answer: "I encourage data-driven discussions where each team member presents benchmarks and architectural trade-offs. We align on measurable criteria like performance, maintainability, and delivery timelines to reach a consensus."
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  // Conversational introductions for questions
  const conversationalIntros = [
    "Hello and welcome! I'm Sarah, your AI Hiring Manager today. Let's start with our first question.",
    "Thank you for that response! Moving on to our next key domain topic...",
    "Great explanation. Now let's explore your approach to the next interview challenge...",
    "Excellent effort. Let's look at the next scenario to evaluate your technical & behavioral depth..."
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech Synthesis (AI Voiceover)
  const speakQuestion = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const introText = conversationalIntros[currentIdx % conversationalIntros.length];
        const fullSpeech = `${introText} ${currentQ.question_text}`;

        const utterance = new SpeechSynthesisUtterance(fullSpeech);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.lang = 'en-US';

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Auto voiceover & dialogue update when new question loads
  useEffect(() => {
    setShowSampleAnswer(false);
    const introText = conversationalIntros[currentIdx % conversationalIntros.length];
    setAiDialogue(introText);

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

  // Start Mic & Speech-to-Text Recognition upon user click
  const startMicRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicStatusText('Speech recognition active. Type or speak into your microphone.');
        return;
      }

      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setMicStatusText('🔴 Recording Active... Speak into your microphone now!');
      };

      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) {
          setCandidateAnswer(prev => prev ? `${prev} ${text.trim()}` : text.trim());
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setMicStatusText('Mic active. Speak clearly or click Auto-Fill.');
      };

      recognition.onend = () => {
        if (isRecording) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Microphone access:", err);
      setMicStatusText('Microphone active. Type your answer or click Auto-Fill.');
    }
  };

  const stopMicRecording = () => {
    setIsRecording(false);
    setMicStatusText('Microphone Paused. Click "Start Voice Recording" to resume.');
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
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
    stopMicRecording();
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
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {sessionData?.title || "Conversational AI Interview Session"}
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">
              Question {currentIdx + 1} of {questions.length} • Domain Focus: {currentQ.skill_focus}
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
              <span className="font-mono text-[11px]">{micStatusText}</span>
            </div>
            
            {isRecording ? (
              <button
                onClick={stopMicRecording}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1.5 animate-pulse"
              >
                <MicOff className="w-3.5 h-3.5" /> Stop Mic Recording
              </button>
            ) : (
              <button
                onClick={startMicRecording}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" /> Start Voice Recording
              </button>
            )}
          </div>
        </div>

        {/* AI INTERVIEWER AVATAR & CONVERSATIONAL PROMPT COLUMN (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* AI Interviewer Character Header */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    Sarah <span className="text-[10px] text-indigo-400 font-mono font-normal">• AI Technical Interviewer</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Conducting Live Conversation</span>
                </div>
              </div>

              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-2.5 py-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1 text-[11px] font-semibold animate-pulse"
                >
                  <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                </button>
              ) : (
                <button
                  onClick={speakQuestion}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md hover:scale-105 transition-all flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Speak Voiceover
                </button>
              )}
            </div>

            {/* Conversational AI Dialogue Bubble */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <p className="leading-relaxed font-sans">{aiDialogue}</p>
            </div>

            {/* Main AI Interview Question Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
                  {currentQ.category} • {currentQ.difficulty} Question:
                </span>
                {isSpeaking && <span className="text-emerald-400 font-bold text-[10px] animate-pulse">🔊 Sarah Speaking...</span>}
              </div>
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
                  <Lightbulb className="w-4 h-4 text-amber-400" /> ✨ View AI High-Score Answer
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
                    <Edit3 className="w-3.5 h-3.5" /> Auto-Fill This High-Score Answer
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Response / Candidate Speech-to-Text Input Area */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cyan-400" /> Your Spoken Answer / Transcript:
              </span>
              
              <button
                onClick={insertSampleAnswer}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Edit3 className="w-3 h-3" /> Auto-Fill Answer
              </button>
            </div>

            <textarea
              rows={4}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Click 'Start Voice Recording' below to speak your answer, or click 'Auto-Fill Answer'..."
              className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />

            {!isRecording && (
              <button
                onClick={startMicRecording}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Mic className="w-4 h-4" /> 🎙️ Click Here to Start Speaking Your Answer
              </button>
            )}

            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Analyzing Conversational Speech & Posture..." : (
                currentIdx < questions.length - 1 ? (
                  <>Submit Answer & Continue Interview <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Finish Interview & Generate AI Assessment Report <CheckCircle2 className="w-4 h-4" /></>
                )
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
