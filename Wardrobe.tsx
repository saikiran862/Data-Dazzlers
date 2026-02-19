
import React, { useState } from 'react';
import { WardrobeItem } from '../types';
import { analyzeGarment } from '../services/geminiService';
import CameraScanner from './CameraScanner';

interface WardrobeProps {
  items: WardrobeItem[];
  onAddItem: (item: WardrobeItem) => void;
}

const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setShowCamera(false);
    setPreview(base64);
    setIsScanning(true);
    
    try {
      const analysis = await analyzeGarment(base64);
      const newItem: WardrobeItem = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: base64,
        category: analysis.category || 'Garment',
        color: analysis.color || 'Unknown',
        style: analysis.style || 'Custom',
        brand: analysis.brand || 'Bespoke',
        isEthnic: analysis.isEthnic || false,
        region: analysis.region || 'Western',
        tags: analysis.tags || [],
        confidenceScore: 90
      };
      onAddItem(newItem);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsScanning(false);
      setPreview(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleCapture(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-12">
      {showCamera && <CameraScanner onCapture={handleCapture} onClose={() => setShowCamera(false)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-bold text-slate-900 tracking-tighter">Your <span className="text-rose-500">Vault</span></h2>
          <p className="text-slate-400 mt-2 font-medium">Digital curation with specialized heritage & ethnic wear detection.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-200"
          >
            <i className="fa-solid fa-camera"></i>
            Heritage Scan
          </button>
          <label className="flex items-center gap-3 px-6 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
            <i className="fa-solid fa-upload"></i>
            Upload Piece
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {isScanning && (
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-rose-100 flex flex-col md:flex-row items-center gap-8 animate-pulse">
          <div className="w-32 h-44 bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
            {preview && <img src={preview} className="w-full h-full object-cover" alt="Scanning" />}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-rose-500">Heritage Analysis in Progress...</h3>
            <p className="text-slate-400 mt-1">Identifying weave patterns, embroidery styles, and regional fabric origin.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(item => (
          <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {item.isEthnic && (
                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Heritage piece
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                 <button className="w-full py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Examine Details</button>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-1">{item.region || 'Global'}</p>
              <h4 className="text-xl font-bold text-slate-900">{item.category}</h4>
              <p className="text-sm text-slate-400 mt-1">{item.style} • {item.color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
