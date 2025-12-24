
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Star, Lock } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  rating?: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, isFavorite, toggleFavorite, rating = 0 }) => {
  return (
    <div className="group relative bg-slate-900/40 dark:bg-slate-900/60 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2 border border-slate-800 hover:border-indigo-500/50 w-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Placeholder Skeleton Background */}
        <div className="absolute inset-0 skeleton" aria-hidden="true"></div>
        
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-10"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60 z-20"></div>

        <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-30 backdrop-blur-[2px]">
          {game.isComingSoon ? (
            <div className="flex flex-col items-center gap-2 bg-slate-950/80 p-6 rounded-[2rem] border border-indigo-500/30 scale-90">
              <Lock className="text-indigo-400" size={32} />
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-white">Coming Soon</span>
            </div>
          ) : (
            <Link 
              to={`/game/${game.id}`}
              className="p-6 sm:p-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 hover:rotate-12"
              aria-label={`Play ${game.title}`}
            >
              <Play fill="white" size={32} />
            </Link>
          )}
        </div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-40">
          {game.isNew && (
            <span className="px-3 py-1.5 bg-green-500 text-white text-[0.65rem] font-black uppercase rounded-xl shadow-xl animate-pulse">
              New
            </span>
          )}
          {game.isComingSoon && (
            <span className="px-3 py-1.5 bg-indigo-600 text-white text-[0.65rem] font-black uppercase rounded-xl shadow-xl">
              Soon
            </span>
          )}
          {rating > 0 && !game.isComingSoon && (
            <span className="px-3 py-1.5 bg-yellow-400 text-slate-950 text-[0.65rem] font-black rounded-xl shadow-xl flex items-center gap-1.5 w-fit">
              <Star size={12} fill="currentColor" /> {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 sm:p-8 flex items-start justify-between relative z-40">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold truncate dark:text-white group-hover:text-indigo-400 transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[0.65rem] sm:text-xs text-slate-500 font-black uppercase tracking-widest">{game.category}</span>
            <div className="w-1.5 h-1.5 bg-slate-700 rounded-full hidden sm:block"></div>
            <span className="text-[0.65rem] sm:text-xs text-slate-500 font-bold uppercase hidden sm:inline">SECURE</span>
          </div>
        </div>
        {!game.isComingSoon && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(game.id);
            }}
            className={`p-3 sm:p-4 rounded-2xl transition-all hover:bg-slate-800 shrink-0 ${
              isFavorite ? 'text-rose-500 scale-110' : 'text-slate-600 hover:text-rose-400'
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart fill={isFavorite ? 'currentColor' : 'none'} size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default GameCard;
