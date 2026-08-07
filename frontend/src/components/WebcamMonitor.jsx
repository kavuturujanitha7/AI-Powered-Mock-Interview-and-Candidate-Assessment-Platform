import React, { useEffect, useRef, useState } from 'react';
import { Camera, Eye } from 'lucide-react';

export default function WebcamMonitor({ onMetricsUpdate }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const startCamera = async () => {
    try {
      setPermissionDenied(false);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.warn("Webcam access error / fallback mode:", err);
      setPermissionDenied(true);
      setStreamActive(false);
    }
  };

  useEffect(() => {
    startCamera();

    // Telemetry update loop
    const interval = setInterval(() => {
      const simulatedEyePct = Math.min(100, Math.max(78, Math.floor(86 + (Math.random() * 10 - 5))));
      const emotions = ['Attentive & Calm', 'Focused & Confident', 'Composed & Ready'];
      const currentEmo = emotions[Math.floor(Math.random() * emotions.length)];
      
      if (onMetricsUpdate) {
        onMetricsUpdate({ eyeContactRatio: simulatedEyePct / 100.0, emotion: currentEmo });
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card border border-slate-800 bg-slate-950 aspect-video shadow-2xl group">
      
      {/* Clean Unobstructed Video Stream (No overlay badges covering candidate's face) */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={`w-full h-full object-cover transform -scale-x-100 ${streamActive ? 'block' : 'hidden'}`}
      />

      {/* Fallback View if Camera Permission Pending */}
      {!streamActive && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/95 relative p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          
          <div>
            <p className="text-sm font-bold text-white">Live Camera Preview</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              {permissionDenied 
                ? "Camera permission requested. Click below to allow camera access." 
                : "Initializing Live Webcam Stream..."}
            </p>
          </div>

          <button
            onClick={startCamera}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" /> Enable Live Webcam
          </button>
        </div>
      )}

      {/* Single Small Clean Camera Badge at Top Left */}
      <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-md">
        ● ON SCREEN
      </div>

    </div>
  );
}
