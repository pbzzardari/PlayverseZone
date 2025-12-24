
import React from 'react';
import { Lock, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLockProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
  title?: string;
}

const AuthLock: React.FC<AuthLockProps> = ({ isLoggedIn, children, title = "Login Required to View" }) => {
  const navigate = useNavigate();

  if (isLoggedIn) return <>{children}</>;

  return (
    <div className="relative group">
      <div className="blur-md select-none pointer-events-none opacity-40">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
            <Lock size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Unlock rankings, trending charts, and favorites by joining our community.</p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <UserCircle size={20} /> Login / Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthLock;
