
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Modern White Theme */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-10">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
            STYLE<span className="text-rose-500">SENSE</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] font-light text-slate-400 mt-1">AI Fashion Architect</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-6 space-y-1">
          <NavItem 
            icon="fa-compass" 
            label="Discovery" 
            active={activeView === AppView.DASHBOARD} 
            onClick={() => onViewChange(AppView.DASHBOARD)} 
          />
          <NavItem 
            icon="fa-folder-open" 
            label="Vault" 
            active={activeView === AppView.WARDROBE} 
            onClick={() => onViewChange(AppView.WARDROBE)} 
          />
          <NavItem 
            icon="fa-wand-magic-sparkles" 
            label="Style Engine" 
            active={activeView === AppView.PLANNER} 
            onClick={() => onViewChange(AppView.PLANNER)} 
          />
        </nav>

        <div className="p-8 space-y-4">
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Trending Brand</p>
            <p className="text-xs font-semibold text-slate-700">Miu Miu Ballets are back</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
               <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Jane D.</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tight">Elite Stylist</p>
            </div>
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 flex justify-around p-4 z-50 shadow-2xl">
        <button onClick={() => onViewChange(AppView.DASHBOARD)} className={`${activeView === AppView.DASHBOARD ? 'text-rose-500 scale-110' : 'text-slate-400'} transition-all`}>
          <i className="fa-solid fa-compass text-xl"></i>
        </button>
        <button onClick={() => onViewChange(AppView.WARDROBE)} className={`${activeView === AppView.WARDROBE ? 'text-rose-500 scale-110' : 'text-slate-400'} transition-all`}>
          <i className="fa-solid fa-folder-open text-xl"></i>
        </button>
        <button onClick={() => onViewChange(AppView.PLANNER)} className={`${activeView === AppView.PLANNER ? 'text-rose-500 scale-110' : 'text-slate-400'} transition-all`}>
          <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
  >
    <i className={`fa-solid ${icon} ${active ? 'text-rose-400' : 'group-hover:text-rose-400'} transition-colors`}></i>
    <span className="font-semibold text-sm tracking-tight">{label}</span>
  </button>
);

export default Layout;
