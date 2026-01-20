
import React, { useState } from 'react';
import { AppStep, CapturedPhoto, InventoryItem, MerchandisingSuggestion } from './types';
import Layout from './components/Layout';
import CaptureScreen from './screens/CaptureScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import ReorganizeScreen from './screens/ReorganizeScreen';
import ReportScreen from './screens/ReportScreen';
import { analyzeInventory } from './services/geminiService';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.CAPTURE);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<MerchandisingSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddPhoto = (photo: CapturedPhoto) => {
    setPhotos(prev => [...prev, photo]);
    setError(null);
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
      console.error("Analysis Error:", msg);
      setError(msg);
      setCurrentStep(AppStep.CAPTURE);
    }
  };

  const navigateTo = (step: AppStep) => {
    if (step === AppStep.ANALYSIS && items.length === 0) return;
    if (step === AppStep.REORGANIZE && suggestions.length === 0) return;
    if (step === AppStep.REPORT && items.length === 0) return;
    setCurrentStep(step);
  };

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
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium">{error}</p>
              {error.includes("trigger a new 'Redeploy'") && (
                <div className="flex flex-col gap-2 mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-xs text-slate-300">
                    <strong>Note:</strong> On Vercel, adding an environment variable does not automatically update your live app. You must go to your Project Dashboard, click 'Deployments', and select 'Redeploy' on your latest version.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-colors w-fit"
                  >
                    <RefreshCw size={12} />
                    Refresh App
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {renderScreen()}
    </Layout>
  );
};

export default App;
