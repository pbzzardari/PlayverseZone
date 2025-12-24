
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Loader2, ArrowLeft, Github, Chrome, Twitter, Facebook, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [socialError, setSocialError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Password Validation
  const [pStrength, setPStrength] = useState({ label: 'None', color: 'bg-slate-700', score: 0 });
  
  useEffect(() => {
    if (!form.password) {
      setPStrength({ label: 'None', color: 'bg-slate-700', score: 0 });
      return;
    }
    let score = 0;
    const hasNum = /\d/.test(form.password);
    const hasSym = /[._\-#@!]/.test(form.password);
    const matchesEmail = form.email && form.password.toLowerCase() === form.email.toLowerCase();
    
    if (form.password.length > 7) score++;
    if (hasNum) score++;
    if (hasSym) score++;
    if (matchesEmail) score = -1;

    if (score === -1) setPStrength({ label: 'Matches Email (UNSAFE)', color: 'bg-rose-600', score: 100 });
    else if (score < 2) setPStrength({ label: 'Weak Protocol', color: 'bg-amber-600', score: 33 });
    else if (score === 2) setPStrength({ label: 'Medium Protocol', color: 'bg-indigo-500', score: 66 });
    else if (score === 3) setPStrength({ label: 'Strong Protocol', color: 'bg-green-600', score: 100 });
  }, [form.password, form.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && (pStrength.label.includes('Matches Email') || pStrength.score < 66)) {
      setSocialError('Password security level too low for vault access.');
      return;
    }
    
    setIsLoading(true);
    setStatus('Initializing secure uplink...');

    setTimeout(() => {
      setStatus('Identity verified. Welcome to the Vault.');
      setTimeout(() => {
        const user: UserType = {
          username: form.username || form.email.split('@')[0],
          email: form.email || 'player@playverse.zone',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || form.email}`
        };
        onLogin(user);
        navigate('/');
      }, 1000);
    }, 2500);
  };

  const handleSocialLogin = (platform: string) => {
    setSocialError(`Login via ${platform} is currently unavailable. Please use email/password protocol.`);
    setTimeout(() => setSocialError(null), 4000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl relative">
            <ShieldCheck size={40} />
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
          </div>
          <h2 className="text-4xl font-black dark:text-white tracking-tighter uppercase">
            {isLogin ? 'Establish Uplink' : 'Create Identity'}
          </h2>
          <p className="text-slate-500 font-medium tracking-tight">
            One secure account for all cloud-native titles.
          </p>
        </div>

        {socialError && (
          <div className="p-5 bg-rose-600/10 border border-rose-500/30 rounded-2xl flex items-center gap-4 text-rose-500 animate-in slide-in-from-top-6 duration-300">
            <AlertCircle size={24} className="shrink-0" />
            <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{socialError}</p>
          </div>
        )}

        <div className="bg-slate-900/60 p-10 rounded-[3rem] shadow-3xl border border-slate-800 backdrop-blur-xl relative overflow-hidden">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-8">
              <Loader2 className="animate-spin text-indigo-500" size={64} strokeWidth={3} />
              <div className="space-y-3 text-center">
                <p className="font-black dark:text-white text-xl uppercase tracking-tighter animate-pulse">{status}</p>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">End-to-End Encryption Enabled</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="GamerIdentity"
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Email Protocol</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="name@sector.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Key</label>
                    {isLogin && <a href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">Recover?</a>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white text-sm"
                    />
                  </div>
                  
                  {!isLogin && form.password && (
                    <div className="mt-4 space-y-2 px-1">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-600">Calibration:</span>
                        <span className={pStrength.color.replace('bg-', 'text-')}>{pStrength.label}</span>
                      </div>
                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-700 ${pStrength.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                          style={{ width: `${pStrength.score}%` }}
                        ></div>
                      </div>
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Requirement: 8+ chars, numbers & symbols (._-#@!)</p>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!isLogin && (pStrength.label.includes('Matches') || pStrength.score < 66)}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLogin ? 'Authorize Uplink' : 'Initialize Identity'}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <div className="relative flex justify-center"><span className="px-4 bg-slate-900 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Social Override</span></div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button onClick={() => handleSocialLogin('Google')} className="p-4 bg-slate-950 rounded-2xl hover:bg-slate-800 transition-all flex justify-center border border-slate-800 text-slate-400 hover:text-white active:scale-90"><Chrome size={20} /></button>
                <button onClick={() => handleSocialLogin('X')} className="p-4 bg-slate-950 rounded-2xl hover:bg-slate-800 transition-all flex justify-center border border-slate-800 text-slate-400 hover:text-white active:scale-90"><Twitter size={20} /></button>
                <button onClick={() => handleSocialLogin('Facebook')} className="p-4 bg-slate-950 rounded-2xl hover:bg-slate-800 transition-all flex justify-center border border-slate-800 text-slate-400 hover:text-white active:scale-90"><Facebook size={20} /></button>
                <button onClick={() => handleSocialLogin('GitHub')} className="p-4 bg-slate-950 rounded-2xl hover:bg-slate-800 transition-all flex justify-center border border-slate-800 text-slate-400 hover:text-white active:scale-90"><Github size={20} /></button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-6">
          <p className="text-slate-500 text-sm font-medium">
            {isLogin ? "No valid credentials?" : "Identity already synchronized?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-3 font-black uppercase text-xs tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {isLogin ? 'Register' : 'Authenticate'}
            </button>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mx-auto text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
          >
            <ArrowLeft size={14} /> Escape to Core
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
