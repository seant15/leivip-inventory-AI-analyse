
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Filter, ChevronRight, Edit2, Check, Tag } from 'lucide-react';

interface AnalysisScreenProps {
  items: InventoryItem[];
  onContinue: () => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ items, onContinue }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === filter.toLowerCase());

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Analysis</h2>
          <p className="text-slate-400 text-sm">{items.length} unique items detected</p>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">
          AI Verified
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filter === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-colors">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
               <div className="w-8 h-8 rounded-full border-2 border-slate-700" style={{ backgroundColor: item.color.toLowerCase().replace(' ', '') || '#334155' }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold truncate text-slate-100">{item.category}</h4>
                <span className="text-xs font-mono text-indigo-400">Qty: {item.quantity}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-wider">{item.pattern}</span>
                {item.styleTags.map(tag => (
                  <span key={tag} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Tag size={8} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
              className="p-2 text-slate-500 hover:text-slate-300 self-center"
            >
              {editingId === item.id ? <Check size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={onContinue}
        className="w-full py-4 bg-slate-100 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
      >
        <span>Continue to Reorganize</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default AnalysisScreen;
