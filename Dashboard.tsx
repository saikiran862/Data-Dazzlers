
import React from 'react';
import { WardrobeItem, AppView } from '../types';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  wardrobe: WardrobeItem[];
  onNavigate: (view: AppView) => void;
}

const chartData = [
  { name: 'Jan', val: 40 },
  { name: 'Feb', val: 65 },
  { name: 'Mar', val: 55 },
  { name: 'Apr', val: 80 },
  { name: 'May', val: 95 },
];

const Dashboard: React.FC<DashboardProps> = ({ wardrobe, onNavigate }) => {
  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <span className="w-8 h-[2px] bg-rose-500"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Live Insights</span>
          </div>
          <h2 className="text-7xl font-bold text-slate-900 tracking-tighter leading-none">Curated Discovery</h2>
          <p className="text-xl text-slate-400 font-medium max-w-xl">Your personal style ecosystem is evolving. Today's forecast: High High-Fashion Affinity.</p>
        </div>
        <button 
          onClick={() => onNavigate(AppView.PLANNER)}
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
        >
          New Styling Proposal
        </button>
      </header>

      {/* Stats - White Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          label="Vault Inventory" 
          value={wardrobe.length.toString()} 
          subtitle="Unique Pieces"
          icon="fa-briefcase"
        />
        <FeatureCard 
          label="Style Score" 
          value="A+" 
          subtitle="98th Percentile"
          icon="fa-award"
        />
        <FeatureCard 
          label="Market Influence" 
          value="Top 2%" 
          subtitle="Trend Setter"
          icon="fa-bolt-lightning"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
          <h3 className="text-2xl font-bold mb-10 tracking-tight">Market Resonance Path</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '20px' }}
                />
                <Area type="monotone" dataKey="val" stroke="#f43f5e" strokeWidth={5} fill="url(#pathGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-rose-50 p-12 rounded-[3.5rem] border border-rose-100 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Trending Now</h3>
              <div className="space-y-4">
                <TrendItem brand="Balenciaga" trend="Technical Gorpcore" />
                <TrendItem brand="Loewe" trend="Surrealist Textures" />
                <TrendItem brand="The Row" trend="Maximum Minimalism" />
              </div>
            </div>
            <div className="mt-12">
               <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4">Designer Tip</p>
               <p className="text-slate-600 italic leading-relaxed">"Transition from boardroom to gala by swapping tailored wool for silk jacquard textures."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ label, value, subtitle, icon }: any) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-rose-500 group-hover:text-white transition-all">
       <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{label}</h4>
    <p className="text-4xl font-bold text-slate-900 tracking-tighter">{value}</p>
    <p className="text-xs font-bold text-slate-400 mt-2">{subtitle}</p>
  </div>
);

const TrendItem = ({ brand, trend }: any) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div>
      <p className="text-sm font-black text-slate-900">{brand}</p>
      <p className="text-xs text-slate-400 font-medium">{trend}</p>
    </div>
    <i className="fa-solid fa-arrow-right text-xs text-rose-300 group-hover:translate-x-1 transition-transform"></i>
  </div>
);

export default Dashboard;
