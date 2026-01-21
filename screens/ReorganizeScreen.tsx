
import React, { useState } from 'react';
import { MerchandisingSuggestion } from '../types';
import { Sparkles, ArrowRight, TrendingUp, Layout, Loader2, Eye, X } from 'lucide-react';
import { generateMockup } from '../services/geminiService';

interface ReorganizeScreenProps {
  suggestions: MerchandisingSuggestion[];
  onComplete: () => void;
  apiKey: string;
}

const ReorganizeScreen: React.FC<ReorganizeScreenProps> = ({ suggestions: initialSuggestions, onComplete, apiKey }) => {
  const [suggestions, setSuggestions] = useState<MerchandisingSuggestion[]>(initialSuggestions);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleApply = async (suggestion: MerchandisingSuggestion) => {
    if (suggestion.mockupImage) return;

    setLoadingIds(prev => new Set(prev).add(suggestion.id));
    try {
      const mockupUrl = await generateMockup(suggestion, apiKey);
      setSuggestions(prev => prev.map(s =>
        s.id === suggestion.id ? { ...s, mockupImage: mockupUrl, isApplied: true } : s
      ));
    } catch (error) {
      console.error("Mockup generation failed", error);
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(suggestion.id);
        return next;
      });
    }
  };

  const handleSkip = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={24} />
          Merchandising Intelligence
        </h2>
        <p className="text-slate-400 text-sm">AI-driven layout and display optimizations for your inventory.</p>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const isLoading = loadingIds.has(suggestion.id);

          return (
            <div key={suggestion.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors" />

              <div className="flex justify-between items-start">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Layout size={20} />
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${suggestion.impact === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                    {suggestion.impact} Impact
                  </span>
                  {suggestion.isApplied && (
                    <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Applied</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100">{suggestion.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{suggestion.description}</p>
              </div>

              {suggestion.mockupImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-indigo-500/30 animate-in fade-in zoom-in duration-500">
                  <div className="bg-indigo-600/20 px-3 py-1 text-[10px] font-bold text-indigo-300 flex items-center gap-2">
                    <Eye size={12} />
                    AI VISUAL MOCKUP
                  </div>
                  <img src={suggestion.mockupImage} alt="Merchandising Preview" className="w-full aspect-video object-cover" />
                </div>
              )}

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <TrendingUp size={10} />
                  Strategic Reasoning
                </h4>
                <p className="text-xs text-slate-300">{suggestion.reasoning}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApply(suggestion)}
                  disabled={isLoading || !!suggestion.mockupImage}
                  className="flex-1 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : suggestion.mockupImage ? (
                    'Strategy Applied'
                  ) : (
                    'Apply Strategy'
                  )}
                </button>
                {!suggestion.mockupImage && (
                  <button
                    onClick={() => handleSkip(suggestion.id)}
                    className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <X size={14} />
                    Skip
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {suggestions.length === 0 && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
              <X size={32} />
            </div>
            <p className="text-slate-400">All suggestions reviewed.</p>
          </div>
        )}
      </div>

      <button
        onClick={onComplete}
        className="w-full py-4 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
      >
        <span>Generate Intelligence Report</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default ReorganizeScreen;
