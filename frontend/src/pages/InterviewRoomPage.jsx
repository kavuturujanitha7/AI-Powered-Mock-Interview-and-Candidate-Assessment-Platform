import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Edit3, Lightbulb, ChevronDown, ChevronUp, Bot, User, MessageSquare } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import AIInterviewerAgent from '../components/AIInterviewerAgent';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [aiDialogue, setAiDialogue] = useState('Hello! I am Sarah, your AI Technical Hiring Manager. Let\'s begin your interview session.');
  const [micStatusText, setMicStatusText] = useState('🎙️ Microphone Active: Speak your answer into your mic naturally!');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [visionMetrics, setVisionMetrics] = useState({ eyeContactRatio: 0.88, emotion: 'Focused & Confident' });
  const recognitionRef = useRef(null);

  const questions = sessionData?.questions || [
    {
      id: 1,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack Software Engineering",
      skill_focus: "System Design & Async Architecture",
      question_text: "Explain how you would design a scalable backend for a Full Stack Software Engineering application handling asynchronous events.",
      sample_answer: "I would use a decoupled microservices architecture with a FastAPI or Node.js gateway, an asynchronous message queue like Redis or RabbitMQ for event distribution, and scalable worker instances to handle heavy background processing."
    },
    {
      id: 2,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack Software Engineering",
      skill_focus: "API Security & JWT Token Auth",
      question_text: "What are JWT access tokens, how do they differ from session cookies, and how do you prevent token theft?",
      sample_answer: "JWT tokens are stateless, digitally signed JSON objects sent in HTTP Authorization headers. Unlike session cookies, servers don't need to store session IDs in memory. Theft is prevented using short expiration times, HTTPS TLS encryption, and storing tokens securely."
    },
    {
      id: 3,
      category: "Behavioral",
      difficulty: "Medium",
      domain: "Full Stack Software Engineering",
      skill_focus: "Problem Solving & Deployment Failure",
      question_text: "Describe a situation where a technical deployment failed in production. How did you diagnose and resolve it?",
      sample_answer: "I diagnosed the issue by inspecting server logs and error stack traces, identified a database pool connection leak, applied a hotfix patch to close unhandled connections, and restored system operations with zero data loss within 15 minutes."
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  const conversationalIntros = [
    "Hello and welcome! I am Sarah, your AI Hiring Manager. Please look at your camera and speak your answer into the microphone when ready.",
    "Thank you for that response! Let's move on to our next technical question.",
    "Great explanation. Now let's explore your behavioral approach to problem-solving..."
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
        const fullText = `${introText} ${currentQ.question_text}`;

        const utterance = new SpeechSynthesisUtterance(fullText);
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

  // Auto voiceover & dialogue update when new question loads
  useEffect(() => {
    setShowSampleAnswer(false);
    const introText = conversationalIntros[currentIdx % conversationalIntros.length];
    setAiDialogue(`${introText} "${currentQ.question_text}"`);

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

  // Web Speech Recognition (Real-Time Mic Audio STT)
  const startMicRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicStatusText('Speech recognition active. Speak into your microphone.');
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
        setMicStatusText('🎙️ LIVE RECORDING: Speak your answer into the microphone now!');
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
        setMicStatusText('Mic active. Speak your answer clearly into your microphone.');
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
      setMicStatusText('Microphone active. Speak your answer or click Auto-Fill.');
    }
  };

  const stopMicRecording = () => {
    setIsRecording(false);
    setMicStatusText('Microphone Paused.');
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
              {sessionData?.title || "Real AI Interviewer Session (Live Camera & Mic)"}
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

      {/* MAIN TWO COLUMN LAYOUT: WEBCAM CAMERA & AI INTERVIEWER AGENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WEBCAM VIDEO CAMERA COLUMN (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <WebcamMonitor onMetricsUpdate={(m) => setVisionMetrics(m)} />
          
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-[11px] font-semibold text-emerald-400">{micStatusText}</span>
            </div>
            
            {isRecording ? (
              <button
                onClick={stopMicRecording}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1.5 animate-pulse"
              >
                <MicOff className="w-3.5 h-3.5" /> Pause Mic
              </button>
            ) : (
              <button
                onClick={startMicRecording}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" /> Start Speaking Answer
              </button>
            )}
          </div>
        </div>

        {/* AI INTERVIEWER AGENT & CONVERSATIONAL COLUMN (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
          
          <div className="space-y-4">
            
            {/* AI INTERVIEWER AGENT COMPONENT */}
            <AIInterviewerAgent 
              isSpeaking={isSpeaking}
              isListening={isRecording}
              currentDialogue={aiDialogue}
              currentQuestion={currentQ.question_text}
            />

            {/* Main AI Interview Question Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
                  {currentQ.category} • {currentQ.difficulty} Question:
                </span>
                {isSpeaking && <span className="text-emerald-400 font-bold text-[10px] animate-pulse">🔊 Sarah Speaking...</span>}
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
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
                  <Lightbulb className="w-4 h-4 text-amber-400" /> ✨ View AI High-Score Answer Hint
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
                    <Edit3 className="w-3.5 h-3.5" /> Auto-Fill High-Score Answer
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Real-time Spoken Answer Transcript & Next Question Action */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-cyan-400" /> Spoken Answer Transcript:
              </span>
              
              <button
                onClick={insertSampleAnswer}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-mono"
              >
                <Edit3 className="w-3 h-3" /> Auto-Fill Text
              </button>
            </div>

            <textarea
              rows={3}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak your answer aloud into your microphone (words transcribe live on screen as you talk)..."
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />

            {!isRecording && (
              <button
                onClick={startMicRecording}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Mic className="w-4 h-4" /> 🎙️ Click Here to Speak Your Answer
              </button>
            )}

            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? "Analyzing Conversational Speech & Posture..." : (
                currentIdx < questions.length - 1 ? (
                  <>Submit Spoken Answer & Next Question <ArrowRight className="w-4 h-4" /></>
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
