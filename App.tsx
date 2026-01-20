
import React, { useState, useCallback } from 'react';
import { AppStep, CapturedPhoto, InventoryItem, MerchandisingSuggestion } from './types';
import Layout from './components/Layout';
import CaptureScreen from './screens/CaptureScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import ReorganizeScreen from './screens/ReorganizeScreen';
import ReportScreen from './screens/ReportScreen';
import { analyzeInventory } from './services/geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.CAPTURE);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suggestions, setSuggestions] = useState<MerchandisingSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setCurrentStep(AppStep.CAPTURE);
    }
  };

  const navigateTo = (step: AppStep) => {
    // Only allow navigating forward if we have data
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
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {renderScreen()}
    </Layout>
  );
};

export default App;
