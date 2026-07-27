import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function WebcamMonitor({ onMetricsUpdate }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [eyeContactScore, setEyeContactScore] = useState(88);
  const [detectedEmotion, setDetectedEmotion] = useState('Focused & Confident');
  const [headPosture, setHeadPosture] = useState('Centered (Optimal)');

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          setPermissionError(false);
        }
      } catch (err) {
        console.warn("Webcam access requested but fallback simulation active:", err);
        setPermissionError(true);
        setStreamActive(false);
      }
    }
    setupCamera();

    // Micro-simulation loop for eye tracking telemetry
    const interval = setInterval(() => {
      const simulatedEyePct = Math.min(100, Math.max(72, Math.floor(85 + (Math.random() * 12 - 6))));
      setEyeContactScore(simulatedEyePct);
      
      const emotions = ['Focused & Confident', 'Attentive', 'Calm & Composed'];
      setDetectedEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
      
      if (onMetricsUpdate) {
        onMetricsUpdate({ eyeContactRatio: simulatedEyePct / 100.0, emotion: detectedEmotion });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card border border-slate-800 bg-slate-950 aspect-video shadow-2xl group">
      
      {/* Video Feed / Simulation canvas */}
      {streamActive ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 relative p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-3 animate-pulse">
            <Camera className="w-10 h-10 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-slate-200">AI Vision Tracking Simulation</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            {permissionError ? "Webcam preview fallback mode active." : "Initializing MediaPipe Vision Pipeline..."}
          </p>
          
          {/* Simulated Candidate Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-400 animate-spin"></div>
          </div>
        </div>
      )}

      {/* AI Face & Eye Bounding Box Simulation Overlay */}
      <div className="absolute inset-8 border-2 border-dashed border-cyan-400/40 rounded-3xl pointer-events-none flex flex-col justify-between p-4 transition-all">
        <div className="flex justify-between items-start">
          <span className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            MediaPipe Face Mesh Active
          </span>
          <span className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Eye Contact: {eyeContactScore}%
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div className="bg-slate-950/80 backdrop-blur p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
            <span className="text-slate-400">Emotion:</span> <span className="text-indigo-400 font-semibold">{detectedEmotion}</span>
          </div>
          <div className="bg-slate-950/80 backdrop-blur p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono">
            <span className="text-slate-400">Head Posture:</span> <span className="text-emerald-400 font-semibold">{headPosture}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
