
import React, { useState } from 'react';
import { EventDetails, OutfitSuggestion, WardrobeItem, SkinProfile, BodyProfile, FeedbackRecord } from '../types';
import { planPersonalizedOutfit, generateOutfitVisual } from '../services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarLine } from 'recharts';

const INDIAN_STATES = [
  "National / Fusion", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface StylePlannerProps {
  wardrobe: WardrobeItem[];
  skin: SkinProfile;
  body: BodyProfile;
  onFeedback: (feedback: FeedbackRecord) => void;
}

const StylePlanner: React.FC<StylePlannerProps> = ({ wardrobe, skin, body, onFeedback }) => {
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState<EventDetails>({
    title: '',
    type: 'Indian Ethnic',
    gender: 'Female',
    moodGoal: 'Regal & Traditional',
    description: '',
    stateContext: 'National / Fusion'
  });
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handlePlan = async () => {
    setIsLoading(true);
    setStep(2);
    const suggested = await planPersonalizedOutfit(event, wardrobe, skin, body, []);
    setSuggestions(suggested);
    setActiveIdx(0);
    setIsLoading(false);
    if (suggested.length > 0) triggerVisual(0);
  };

  const triggerVisual = async (idx: number) => {
    const s = suggestions[idx];
    const visual = await generateOutfitVisual(
      `${event.gender} ${s.designerInspiration} ${event.type} look for ${event.stateContext}. Detailed ${s.footwear} and accessories: ${s.accessories.join(', ')}. ${s.reasoning.substring(0, 100)}`
    );
    if (visual) {
      const copy = [...suggestions];
      copy[idx].visualPreviews = [visual];
      setSuggestions(copy);
    }
  };

  const active = activeIdx !== null ? suggestions[activeIdx] : null;

  return (
    <div className="space-y-12">
      {step === 1 ? (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
             <h2 className="text-7xl font-black tracking-tighter text-slate-900 leading-tight">Heritage <span className="text-rose-500">Architect</span></h2>
             <p className="text-xl text-slate-400 font-medium">Generative AI transformation for India's 28 states and global designer systems.</p>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.08)] space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Persona</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                  {(['Male', 'Female', 'Non-binary'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setEvent({...event, gender: g})}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${event.gender === g ? 'bg-white shadow-sm text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dressing Context</label>
                <select 
                  className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-medium text-lg"
                  value={event.type}
                  onChange={e => setEvent({...event, type: e.target.value as any})}
                >
                  <option value="Indian Ethnic">Indian Ethnic Heritage</option>
                  <option value="Indo-Western">Modern Indo-Western</option>
                  <option value="Designer Couture">Global High-Fashion</option>
                  <option value="Western">Western Elite</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Event Essence</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-medium text-lg"
                  placeholder="Royal Jodhpur Sangeet"
                  value={event.title}
                  onChange={e => setEvent({...event, title: e.target.value})}
                />
              </div>
              {event.type.includes('Indian') && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Regional State Heritage</label>
                  <select 
                    className="w-full px-6 py-4.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-medium text-lg"
                    value={event.stateContext}
                    onChange={e => setEvent({...event, stateContext: e.target.value})}
                  >
                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Atmospheric Mood</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Regal', 'Minimalist', 'Avant-Garde', 'Bohemian'].map(mood => (
                  <button
                    key={mood}
                    onClick={() => setEvent({...event, moodGoal: mood})}
                    className={`px-6 py-5 rounded-2xl border-2 transition-all font-bold text-sm tracking-tight ${event.moodGoal === mood ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handlePlan}
              className="w-full py-6 bg-rose-500 text-white rounded-[2rem] font-bold text-xl hover:bg-rose-600 transition-all shadow-2xl shadow-rose-200"
            >
              Consult the AI Designer
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-900 font-bold flex items-center gap-2 transition-colors">
                <i className="fa-solid fa-arrow-left"></i>
                New Styling brief
              </button>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biological Persona</p>
                    <p className="text-sm font-bold text-slate-900">{skin.detectedTone} • {skin.undertone}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: skin.hex }}></div>
              </div>
           </div>

           {isLoading ? (
             <div className="py-32 text-center space-y-8">
               <div className="w-20 h-20 border-[6px] border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
               <h3 className="text-4xl font-black tracking-tighter">Crafting {event.gender} Couture...</h3>
               <p className="text-slate-400 font-medium max-w-md mx-auto">Sourcing state-specific artisan textures and global designer footwear.</p>
             </div>
           ) : (
             <div className="grid lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8 space-y-8">
                 {active && (
                   <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100 group">
                     <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                        {active.visualPreviews[0] ? (
                          <div className="relative w-full h-full">
                            <img src={active.visualPreviews[0]} className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-105" alt="AI Couture Generation" />
                            
                            {/* Couture Details Overlay */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none">
                              <div className="flex justify-between items-start">
                                <div className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-4 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Heritage Origin</span>
                                    <span className="text-xs font-bold">{event.stateContext}</span>
                                  </div>
                                </div>
                                <div className="bg-rose-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-[2rem] text-[10px] font-black shadow-xl animate-in fade-in slide-in-from-right-4 duration-500 uppercase tracking-widest">
                                  {active.suitabilityScore}% Harmony
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-200">
                             <div className="w-16 h-16 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Designing Piece...</p>
                          </div>
                        )}

                        <div className="absolute bottom-10 left-10 right-10 p-10 bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-2xl pointer-events-auto transition-transform duration-500 group-hover:-translate-y-2">
                          <div className="flex gap-2 mb-4">
                            {active.colorPalette.map(c => <div key={c} className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>)}
                          </div>
                          <h3 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">{active.designerInspiration}</h3>
                          <p className="text-slate-600 text-lg leading-relaxed line-clamp-3 mb-6">{active.reasoning}</p>
                          
                          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-900/10">
                            <div>
                              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Footwear Coordination</p>
                              <p className="text-sm font-bold text-slate-800">{active.footwear}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Accents & Accessories</p>
                              <p className="text-sm font-bold text-slate-800">{active.accessories.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                     </div>
                     
                     <div className="p-12 border-t border-slate-50 bg-slate-50/30">
                        <div className="flex justify-between items-center mb-8">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Architected Recommendations</h4>
                          <div className="flex gap-4">
                             <button onClick={() => onFeedback({ suggestionId: active.id, rating: 'like', timestamp: Date.now() })} className="w-12 h-12 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <i className="fa-solid fa-heart"></i>
                             </button>
                             <button className="w-12 h-12 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <i className="fa-solid fa-share-nodes"></i>
                             </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {active.recommendedBrands.map((brand, bidx) => (
                             <a key={bidx} href={brand.link} target="_blank" className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-rose-200 transition-all group shadow-sm">
                               <p className="text-lg font-bold text-slate-900 group-hover:text-rose-500 transition-colors">{brand.name}</p>
                               <p className="text-xs font-bold text-slate-400 mt-1">{brand.price}</p>
                               <div className="mt-4 flex items-center justify-between opacity-40 group-hover:opacity-100">
                                  <span className="text-[10px] font-black uppercase tracking-widest">Explore Piece</span>
                                  <i className="fa-solid fa-arrow-right-long text-[10px] transition-transform group-hover:translate-x-1"></i>
                               </div>
                             </a>
                           ))}
                        </div>
                     </div>
                   </div>
                 )}
               </div>

               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Design Integrity</h4>
                    {active && (
                      <div className="space-y-8">
                        <MetricBar label="Dermatological Resonance" value={active.metrics.skinResonance} color="bg-rose-500" />
                        <MetricBar label="Confidence Quotient" value={active.metrics.confidence} color="bg-slate-900" />
                        <MetricBar label="Heritage Accuracy" value={active.suitabilityScore} color="bg-amber-500" />
                        
                        <div className="h-[280px] w-full mt-10">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={[
                              { subject: 'Skin', A: active.metrics.skinResonance },
                              { subject: 'Confidence', A: active.metrics.confidence },
                              { subject: 'Heritage', A: active.suitabilityScore },
                              { subject: 'Impact', A: active.metrics.socialImpact },
                              { subject: 'Comfort', A: active.metrics.comfort },
                            ]}>
                              <PolarGrid stroke="#f1f5f9" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                              <RadarLine name="Couture" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.12} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">Designer Iterations</p>
                     {suggestions.map((s, sidx) => (
                       <button
                         key={s.id}
                         onClick={() => {
                           setActiveIdx(sidx);
                           if (!s.visualPreviews[0]) triggerVisual(sidx);
                         }}
                         className={`w-full p-8 rounded-[2.5rem] border-2 text-left transition-all group ${activeIdx === sidx ? 'bg-white border-rose-500 shadow-2xl' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                       >
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture 0{sidx + 1}</p>
                         <h5 className="text-xl font-bold text-slate-900 group-hover:text-rose-500 transition-colors truncate">{s.designerInspiration}</h5>
                         <p className="text-xs text-slate-400 mt-1">{s.footwear}</p>
                       </button>
                     ))}
                  </div>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const MetricBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} transition-all duration-1500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default StylePlanner;
