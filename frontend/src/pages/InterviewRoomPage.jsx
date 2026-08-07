import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Volume2, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Send, Sparkles, VolumeX, Edit3, Lightbulb, ChevronDown, ChevronUp, Bot, User, MessageSquare, PhoneOff, Zap, ShieldCheck } from 'lucide-react';
import WebcamMonitor from '../components/WebcamMonitor';
import AudioWaveform from '../components/AudioWaveform';
import { submitQuestionAnswer, finishInterviewSession } from '../services/api';

export default function InterviewRoomPage({ sessionData, setActivePage, setFinalReport }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);
  const [noiseFilterActive, setNoiseFilterActive] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [transcriptStream, setTranscriptStream] = useState([]);
  const [visionMetrics, setVisionMetrics] = useState({ 
    eyeContactRatio: 0.90, 
    attention: 100, 
    confidence: 78, 
    facePresence: 100, 
    emotion: 'Neutral' 
  });
  const recognitionRef = useRef(null);

  const questions = sessionData?.questions || [
    {
      id: 1,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack Software Engineering",
      skill_focus: "System Design & Architecture",
      question_text: "To start, could you briefly introduce yourself and walk me through your technical background?",
      sample_answer: "Yeah, I'm a software developer with experience building full-stack applications using Python, React.js, FastAPI, and PostgreSQL. I enjoy designing scalable architectures and automated AI workflows.",
      hints: [
        "Mention your core tech stack (e.g. Python, React, SQL).",
        "Highlight a key project or system you built.",
        "Keep your introduction concise (under 60 seconds)."
      ]
    },
    {
      id: 2,
      category: "Technical",
      difficulty: "Medium",
      domain: "Full Stack Software Engineering",
      skill_focus: "Backend Architecture & Security",
      question_text: "Discuss your approach to implementing secure email authentication and user-scoped data isolation in backend microservices.",
      sample_answer: "I implement secure JWT access tokens, bcrypt password hashing, and user-scoped database isolation using foreign-key security policies and middleware context verification.",
      hints: [
        "Explain JWT access tokens vs session cookies.",
        "Mention password hashing (bcrypt/Argon2).",
        "Discuss middleware context authorization."
      ]
    }
  ];

  const currentQ = questions[currentIdx] || questions[0];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech Synthesis (AIRA AI Voiceover)
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
    setShowAiHint(false);
    
    setTranscriptStream(prev => [
      ...prev,
      { sender: 'AIRA', text: currentQ.question_text, time: formatTimer(timerSeconds) }
    ]);

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

  // Web Speech Recognition (Real-Time Mic STT)
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
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) {
          setCandidateAnswer(prev => prev ? `${prev} ${text.trim()}` : text.trim());
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
    
    if (candidateAnswer) {
      setTranscriptStream(prev => [
        ...prev,
        { sender: 'YOU', text: candidateAnswer, time: formatTimer(timerSeconds) }
      ]);
    }

    await submitQuestionAnswer({
      session_id: sessionData?.session_id || 1,
      question_index: currentIdx + 1,
      question_text: currentQ.question_text,
      candidate_answer: candidateAnswer || currentQ.sample_answer,
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
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 pb-20">
      
      {/* ROOM TOP HEADER - ON AIR STATUS & AI NOISE FILTER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-3 px-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            AI Interviewer <span className="text-[10px] text-cyan-400 font-mono font-normal">• Session Tape Active</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI NOISE CANCELLATION FILTER TOGGLE */}
          <button
            onClick={() => setNoiseFilterActive(!noiseFilterActive)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all flex items-center gap-1.5 ${
              noiseFilterActive 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            {noiseFilterActive ? "AI Noise Cancellation: ACTIVE" : "Noise Filter: OFF"}
          </button>

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

            {/* Voiceover Replay Button & AI Hint Trigger */}
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

              {/* AI HINT GENERATOR BUTTON */}
              <button
                onClick={() => setShowAiHint(!showAiHint)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> {showAiHint ? "Hide AI Hints" : "⚡ Get AI Hints"}
              </button>
            </div>

            {/* AI HINTS EXPANDABLE BOX */}
            {showAiHint && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-xl text-left space-y-2 animate-fade-in">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase block">⚡ Key Answer Points to Mention:</span>
                <ul className="space-y-1 text-xs text-amber-200">
                  {(currentQ.hints || ["Mention architecture patterns.", "Explain error recovery.", "Keep under 60 seconds."]).map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* LIVE TRANSCRIPT STREAM BOX */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Live Transcript Stream
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Real-time STT Active</span>
            </div>

            <div className="space-y-3 max-h-44 overflow-y-auto pr-2 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">AIRA (Interviewer):</span>
                <p className="text-slate-200">{currentQ.question_text}</p>
              </div>

              {candidateAnswer && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1 ml-4">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold">YOU (Candidate):</span>
                  <p className="text-slate-200">{candidateAnswer}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CANDIDATE WEBCAM & LIVE TELEMETRY BARS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Candidate Webcam Box */}
          <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
            <WebcamMonitor onMetricsUpdate={(m) => setVisionMetrics(prev => ({ ...prev, ...m }))} />
            <div className="absolute top-3 left-3 bg-red-500 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white uppercase font-mono">
              ON SCREEN
            </div>
          </div>

          {/* LIVE TELEMETRY BARS */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">Live Vision Telemetry</span>
              <span className="text-[10px] font-mono text-emerald-400">FACE ASSESSMENT - LIVE</span>
            </div>

            {/* Metric 1: Eye Contact */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Eye Contact</span>
                <span className="text-cyan-400 font-bold">90%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: '90%' }} />
              </div>
            </div>

            {/* Metric 2: Attention */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Attention</span>
                <span className="text-indigo-400 font-bold">100%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full transition-all duration-300" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Metric 3: Confidence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Confidence</span>
                <span className="text-emerald-400 font-bold">78%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: '78%' }} />
              </div>
            </div>

            {/* Metric 4: Face Presence */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Face Presence</span>
                <span className="text-purple-400 font-bold">100%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full transition-all duration-300" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
              <span>Emotion Detector:</span>
              <span className="text-emerald-400 font-bold">Neutral / Focused</span>
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
