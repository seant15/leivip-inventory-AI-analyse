
import React from 'react';
import { LayoutDashboard, Camera, PieChart, Sparkles, Box } from 'lucide-react';
import { AppStep } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: AppStep;
  onNavigate?: (step: AppStep) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentStep, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Box size={20} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">LEIVIP <span className="text-indigo-400">INTEL</span></h1>
          </div>
          <div className="flex items-center gap-1">
             <div className={`h-1.5 w-6 rounded-full ${currentStep === AppStep.CAPTURE ? 'bg-indigo-500' : 'bg-slate-700'}`} />
             <div className={`h-1.5 w-6 rounded-full ${currentStep === AppStep.PROCESSING ? 'bg-indigo-500' : 'bg-slate-700'}`} />
             <div className={`h-1.5 w-6 rounded-full ${currentStep === AppStep.ANALYSIS ? 'bg-indigo-500' : 'bg-slate-700'}`} />
             <div className={`h-1.5 w-6 rounded-full ${currentStep === AppStep.REORGANIZE ? 'bg-indigo-500' : 'bg-slate-700'}`} />
             <div className={`h-1.5 w-6 rounded-full ${currentStep === AppStep.REPORT ? 'bg-indigo-500' : 'bg-slate-700'}`} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 pb-24">
        {children}
      </main>

      {/* Footer Navigation (Sticky) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 p-4 pb-8 safe-area-inset-bottom">
        <div className="flex justify-around items-center max-w-2xl mx-auto">
          <button 
            onClick={() => onNavigate?.(AppStep.CAPTURE)}
            className={`flex flex-col items-center gap-1 ${currentStep === AppStep.CAPTURE ? 'text-indigo-400' : 'text-slate-400'}`}
          >
            <Camera size={20} />
            <span className="text-[10px] font-medium">Capture</span>
          </button>
          <button 
            onClick={() => onNavigate?.(AppStep.ANALYSIS)}
            disabled={!onNavigate}
            className={`flex flex-col items-center gap-1 ${currentStep === AppStep.ANALYSIS ? 'text-indigo-400' : 'text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-medium">Analysis</span>
          </button>
          <button 
            onClick={() => onNavigate?.(AppStep.REORGANIZE)}
            disabled={!onNavigate}
            className={`flex flex-col items-center gap-1 ${currentStep === AppStep.REORGANIZE ? 'text-indigo-400' : 'text-slate-400'}`}
          >
            <Sparkles size={20} />
            <span className="text-[10px] font-medium">Insights</span>
          </button>
          <button 
            onClick={() => onNavigate?.(AppStep.REPORT)}
            disabled={!onNavigate}
            className={`flex flex-col items-center gap-1 ${currentStep === AppStep.REPORT ? 'text-indigo-400' : 'text-slate-400'}`}
          >
            <PieChart size={20} />
            <span className="text-[10px] font-medium">Report</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
