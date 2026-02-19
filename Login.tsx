
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated auth
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Fashion Enthusiast',
      email: email,
      profileComplete: false
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100 rounded-full blur-[120px] opacity-60"></div>
      
      <div className="w-full max-w-md space-y-12 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">
            STYLE<span className="text-rose-500">SENSE</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">The Future of Fashion Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.08)] space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">{isRegister ? 'Create Architect Account' : 'Welcome to the Vault'}</h2>
          
          {isRegister && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
              <input 
                type="text" required
                value={name} onChange={e => setName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
                placeholder="Christian Dior"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
              placeholder="vogue@stylesense.ai"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Password</label>
            <input 
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-slate-200"
          >
            {isRegister ? 'Initiate System' : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
