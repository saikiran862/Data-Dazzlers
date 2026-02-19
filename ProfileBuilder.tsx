
import React, { useState, useRef } from 'react';
import { SkinProfile, BodyProfile } from '../types';
import { analyzeSkinTone } from '../services/geminiService';
import CameraScanner from './CameraScanner';

interface ProfileBuilderProps {
  onComplete: (skin: SkinProfile, body: BodyProfile) => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [skin, setSkin] = useState<SkinProfile | null>(null);
  const [bodyType, setBodyType] = useState<BodyProfile['type']>('Rectangle');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCapture = async (base64: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);
    try {
      const result = await analyzeSkinTone(base64);
      setSkin(result);
      setStep(2);
    } catch (e) {
      alert("Failed to analyze skin tone. Please try again with better lighting.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalize = () => {
    if (skin) {
      onComplete(skin, { type: bodyType, preferences: [] });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {showCamera && <CameraScanner onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
      
      {isAnalyzing ? (
        <div className="text-center space-y-8 py-20">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-[6px] border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tighter">Mapping Biological Tones</h2>
            <p className="text-slate-400 font-medium">Using HSV clusters and LAB color space to determine your unique undertone...</p>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-6xl font-black tracking-tighter leading-none">Step 01: <br/>Biological Mapping</h2>
            <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto">We need to analyze your skin tone and undertone to provide scientifically accurate color recommendations.</p>
          </div>
          
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
               <i className="fa-solid fa-face-smile text-4xl"></i>
            </div>
            <button 
              onClick={() => setShowCamera(true)}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-xl hover:bg-rose-600 transition-all shadow-2xl"
            >
              Start Skin Analysis
            </button>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Privacy Protected • Encrypted Analysis</p>
          </div>
        </div>
      ) : (
        <div className="space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-6xl font-black tracking-tighter leading-none">Step 02: <br/>Body Profiling</h2>
            <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto">Select the archetype that best represents your silhouette for optimized tailored recommendations.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['Apple', 'Pear', 'Rectangle', 'Hourglass', 'Inverted Triangle'] as BodyProfile['type'][]).map(type => (
              <button
                key={type}
                onClick={() => setBodyType(type)}
                className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all group ${bodyType === type ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <div className={`w-12 h-16 rounded-lg ${bodyType === type ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-slate-100'} transition-colors`}></div>
                <span className="text-xs font-bold uppercase tracking-widest">{type}</span>
              </button>
            ))}
          </div>

          <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white" style={{ backgroundColor: skin?.hex }}></div>
               <div className="text-left">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Detected Profile</p>
                  <p className="text-xl font-bold text-slate-900">{skin?.detectedTone} ({skin?.undertone})</p>
               </div>
            </div>
            <button 
              onClick={handleFinalize}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-xl"
            >
              Save Profile & Enter System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBuilder;
