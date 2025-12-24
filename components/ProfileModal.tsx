
import React from 'react';
import { X, Trophy, Heart, Clock, Gamepad2, Medal } from 'lucide-react';
import { Achievement, UserStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  earnedAchievements: string[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, stats, earnedAchievements }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Player Profile
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
              <Gamepad2 className="mx-auto mb-2 text-indigo-500" />
              <div className="text-2xl font-bold dark:text-white">{stats.gamesPlayed}</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Games Played</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
              <Heart className="mx-auto mb-2 text-rose-500" />
              <div className="text-2xl font-bold dark:text-white">{stats.totalFavorites}</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Favorites</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
              <Medal className="mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold dark:text-white">{earnedAchievements.length}</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Achievements</div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
               Badges & Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(ach => {
                const isEarned = earnedAchievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      isEarned 
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 opacity-100' 
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 grayscale opacity-40'
                    }`}
                  >
                    <div className="text-3xl">{ach.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm dark:text-white">{ach.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 italic">
          Progress is saved automatically to your browser.
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
