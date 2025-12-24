
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface VerificationPageProps {
  onVerified: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onVerified }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState('Verify you are human');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsChecking(true);
    setStatus('Checking your browser...');
    
    setTimeout(() => {
      setStatus('Verifying secure connection...');
    }, 1500);

    setTimeout(() => {
      setIsVerified(true);
      setStatus('Success! Redirecting...');
      setTimeout(onVerified, 1000);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-2xl font-black dark:text-white">PlayverseZone</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">One more step before accessing our secure game library.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            {!isChecking && !isVerified ? (
              <button 
                onClick={handleVerify}
                className="w-8 h-8 rounded-md border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 transition-colors bg-transparent flex items-center justify-center group-hover:bg-slate-50 dark:group-hover:bg-slate-700"
              >
                <div className="w-0 h-0 bg-indigo-600 rounded-sm transition-all duration-300 group-active:w-4 group-active:h-4"></div>
              </button>
            ) : isVerified ? (
              <div className="text-green-500">
                 <ShieldCheck size={32} />
              </div>
            ) : (
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            )}
            <span className="font-medium text-slate-700 dark:text-slate-200">{status}</span>
          </div>
          <div className="hidden sm:flex flex-col items-end opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SecureCheck</span>
            <div className="w-8 h-1 bg-indigo-600 rounded-full mt-1"></div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-xs text-slate-400">This process is automatic. Your browser will redirect shortly after verification is complete. We use this to protect our site from cyber attacks.</p>
          <div className="pt-4 flex items-center justify-center gap-4 text-slate-400">
             <div className="flex items-center gap-1">
               <ShieldCheck size={12} />
               <span className="text-[10px] uppercase font-bold tracking-tighter">Safe & Verified</span>
             </div>
             <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
             <div className="flex items-center gap-1">
               <ShieldCheck size={12} />
               <span className="text-[10px] uppercase font-bold tracking-tighter">Secure Connection</span>
             </div>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em]">
        Protected by Playverse Security Protocol v2.4
      </footer>
    </div>
  );
};

export default VerificationPage;
