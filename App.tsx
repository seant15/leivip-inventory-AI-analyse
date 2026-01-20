
import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, CapturedPhoto, InventoryItem, MerchandisingSuggestion } from './types';
import Layout from './components/Layout';
import CaptureScreen from './screens/CaptureScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import ReorganizeScreen from './screens/ReorganizeScreen';
import ReportScreen from './screens/ReportScreen';
import { analyzeInventory } from './services/geminiService';
import { Key, AlertCircle, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.CAPTURE);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<MerchandisingSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  // Check for API Key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } else {
          // If not in aistudio environment, check if process.env.API_KEY is present
          setHasKey(!!process.env.API_KEY && process.env.API_KEY !== 'undefined');
        }
      } catch (err) {
        console.error("Error checking API key status:", err);
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Assume success as per SDK rules to avoid race conditions
        setHasKey(true);
      }
    } catch (err) {
      console.error("Error opening key selection:", err);
    }
  };

  const handleAddPhoto = (photo: CapturedPhoto) => {
    setPhotos(prev => [...prev, photo]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const startAnalysis = async () => {
    if (photos.length === 0) return;
    
    setCurrentStep(AppStep.PROCESSING);
    setError(null);

    try {
      const result = await analyzeInventory(photos);
      setItems(result.items);
      setSuggestions(result.suggestions);
      setCurrentStep(AppStep.ANALYSIS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      // If the error suggests a missing key, prompt for it again
      if (msg.includes("Missing Gemini API Key") || msg.includes("entity was not found")) {
        setHasKey(false);
      }
      setCurrentStep(AppStep.CAPTURE);
    }
  };

  const navigateTo = (step: AppStep) => {
    if (step === AppStep.ANALYSIS && items.length === 0) return;
    if (step === AppStep.REORGANIZE && suggestions.length === 0) return;
    if (step === AppStep.REPORT && items.length === 0) return;
    setCurrentStep(step);
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-900/40">
            <Key size={40} className="text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Connect to Gemini</h1>
            <p className="text-slate-400">LEIVIP Intelligence requires a valid Gemini API Key to analyze your inventory images and generate merchandising insights.</p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex gap-3 text-left">
            <div className="text-amber-400 shrink-0 mt-0.5">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please select a key from a paid GCP project. You can manage your keys at 
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 hover:underline ml-1">billing documentation</a>.
            </p>
          </div>

          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
          >
            <span>Select API Key</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentStep) {
      case AppStep.CAPTURE:
        return (
          <CaptureScreen 
            photos={photos} 
            onAddPhoto={handleAddPhoto} 
            onRemovePhoto={handleRemovePhoto}
            onAnalyze={startAnalysis}
          />
        );
      case AppStep.PROCESSING:
        return <ProcessingScreen />;
      case AppStep.ANALYSIS:
        return (
          <AnalysisScreen 
            items={items} 
            onContinue={() => setCurrentStep(AppStep.REORGANIZE)} 
          />
        );
      case AppStep.REORGANIZE:
        return (
          <ReorganizeScreen 
            suggestions={suggestions} 
            onComplete={() => setCurrentStep(AppStep.REPORT)} 
          />
        );
      case AppStep.REPORT:
        return <ReportScreen items={items} suggestions={suggestions} />;
      default:
        return null;
    }
  };

  return (
    <Layout currentStep={currentStep} onNavigate={navigateTo}>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm animate-in slide-in-from-top duration-300">
          <div className="flex gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      {renderScreen()}
    </Layout>
  );
};

export default App;
