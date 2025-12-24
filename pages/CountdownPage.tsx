
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';

const CountdownPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
          <Calendar size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black dark:text-white tracking-tighter uppercase">Mission 2026</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em]">Temporal Countdown Sequence</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Minutes', val: timeLeft.mins },
          { label: 'Seconds', val: timeLeft.secs }
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-2">
            <div className="text-4xl md:text-6xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
              {String(item.val).padStart(2, '0')}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600/5 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-200 dark:border-indigo-800 max-w-lg">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles size={20} />
          <span className="font-black uppercase tracking-widest text-sm">Secret Data Stream</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "The future belongs to those who play hard. 2026 will bring the next evolution of Playverse. Stay sharp, gamer."
        </p>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 font-black uppercase tracking-widest text-xs transition-colors"
      >
        <ArrowLeft size={16} /> Return to Present
      </button>
    </div>
  );
};

export default CountdownPage;
