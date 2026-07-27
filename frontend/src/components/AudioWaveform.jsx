import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function AudioWaveform({ isRecording }) {
  const [bars, setBars] = useState([20, 45, 80, 60, 30, 90, 70, 40, 65, 85, 35, 50]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 85) + 15));
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
      <div className={`p-2 rounded-lg ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
        {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </div>

      <div className="flex items-center gap-1 h-8 px-2">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isRecording ? 'bg-gradient-to-t from-indigo-500 to-cyan-400' : 'bg-slate-700'
            }`}
            style={{ height: isRecording ? `${height}%` : '20%' }}
          />
        ))}
      </div>

      <div className="text-right font-mono text-[11px]">
        <span className={isRecording ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
          {isRecording ? 'LIVE AUDIO INPUT' : 'MIC PAUSED'}
        </span>
      </div>
    </div>
  );
}
