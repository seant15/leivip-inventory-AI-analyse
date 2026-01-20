
import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';
import { CapturedPhoto } from '../types';
import { resizeImage } from '../utils/imageUtils';

interface CaptureScreenProps {
  photos: CapturedPhoto[];
  onAddPhoto: (photo: CapturedPhoto) => void;
  onRemovePhoto: (id: string) => void;
  onAnalyze: () => void;
}

const CaptureScreen: React.FC<CaptureScreenProps> = ({ photos, onAddPhoto, onRemovePhoto, onAnalyze }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizing(true);
    
    try {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
        reader.readAsDataURL(file);
        
        const rawBase64 = await base64Promise;
        const optimizedBase64 = await resizeImage(rawBase64);
        
        onAddPhoto({
          id: Math.random().toString(36).substr(2, 9),
          url: optimizedBase64, // Using the optimized base64 for preview too
          base64: optimizedBase64
        });
      }
    } catch (err) {
      console.error("Image optimization failed", err);
    } finally {
      setIsOptimizing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Capture Inventory</h2>
        <p className="text-slate-400 text-sm">Snap photos of your shelves, racks, or displays to analyze current stock.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative aspect-square bg-slate-800 rounded-xl overflow-hidden group">
            <img src={photo.url} alt="Inventory" className="w-full h-full object-cover" />
            <button 
              onClick={() => onRemovePhoto(photo.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-sm rounded-full text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        
        {photos.length < 10 && (
          <button 
            disabled={isOptimizing}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group disabled:opacity-50"
          >
            <div className="p-3 bg-slate-800 rounded-full group-hover:bg-indigo-600 transition-colors">
              {isOptimizing ? <Loader2 size={24} className="text-indigo-400 animate-spin" /> : <Camera size={24} className="text-slate-400 group-hover:text-white" />}
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-400">
              {isOptimizing ? 'Optimizing...' : 'Add Photo'}
            </span>
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept="image/*" 
        className="hidden" 
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3">
        <div className="text-amber-400 shrink-0">
          <Lightbulb size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Pro Tip</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Images are automatically compressed to ensure lightning-fast AI analysis.</p>
        </div>
      </div>

      <button 
        disabled={photos.length === 0 || isOptimizing}
        onClick={onAnalyze}
        className="w-full py-4 bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
      >
        <span>Analyze Inventory</span>
        <ArrowRight size={18} />
      </button>

      {photos.length > 0 && (
        <p className="text-center text-xs text-slate-500">{photos.length} of 10 photos captured</p>
      )}
    </div>
  );
};

export default CaptureScreen;
