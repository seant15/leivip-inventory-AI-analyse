
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const steps = [
    "Uploading optimized photos...",
    "Scanning displays...",
    "Detecting clothing items...",
    "Categorizing by style & color...",
    "Crafting merchandising tips..."
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Variable speed progress: starts fast, slows down as it gets closer to 95%
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev + 0.1 > 99 ? 99 : prev + 0.05;
        const jump = (100 - prev) / 40;
        return prev + jump;
      });
    }, 100);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) return steps.length - 1;
        return prev + 1;
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in duration-500">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center">
          <Loader2 size={48} className="text-indigo-500 animate-spin" />
        </div>
        <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-indigo-500/20 animate-pulse" />
      </div>

      <div className="text-center space-y-4 w-full">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Intelligence Engine Active</h3>
          <p className="text-slate-400 text-sm h-6 transition-all duration-500">{steps[currentStep]}</p>
        </div>
        
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Processing</span>
          <p className="text-xs font-mono text-indigo-400 font-bold">{Math.round(progress)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800">
            <div className="absolute inset-0 bg-indigo-500/5 animate-[scan_3s_infinite]" />
            <div className="w-full h-full bg-gradient-to-t from-slate-950/80 to-transparent" />
            <div className="absolute bottom-2 left-2 w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500/40 animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
