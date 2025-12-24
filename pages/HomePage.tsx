
import React, { useState, useMemo } from 'react';
import { Game, Category } from '../types';
import { GAMES, CATEGORIES } from '../constants';
import GameCard from '../components/GameCard';
import AuthLock from '../components/AuthLock';
import { ChevronRight, Flame, Sparkles, Trophy, Clock, Filter, ArrowUpDown, ShieldCheck, Zap, Lock, Eye, Target } from 'lucide-react';

interface HomePageProps {
  favorites: string[];
  recent: string[];
  toggleFavorite: (id: string) => void;
  searchTerm: string;
  ratings: Record<string, number>;
  playCounts: Record<string, number>;
  isLoggedIn: boolean;
}

type SortOption = 'Newest' | 'Oldest' | 'Rating' | 'Alphabetical';

const HomePage: React.FC<HomePageProps> = ({ favorites, recent, toggleFavorite, searchTerm, ratings, playCounts, isLoggedIn }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Newest');

  const processedGames = useMemo(() => {
    let list = GAMES.filter(g => !g.isComingSoon);
    list = list.filter(game => {
      const s = searchTerm.toLowerCase();
      const matchesSearch = 
        game.title.toLowerCase().includes(s) ||
        game.category.toLowerCase().includes(s) ||
        game.description.toLowerCase().includes(s) ||
        game.tags.some(tag => tag.toLowerCase().includes(s));
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'Alphabetical': return a.title.localeCompare(b.title);
        case 'Rating': return (b.baseRating + (ratings[b.id] || 0) / 10) - (a.baseRating + (ratings[a.id] || 0) / 10);
        case 'Oldest': return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });
    return list;
  }, [searchTerm, activeCategory, sortBy, ratings]);

  const rankingGames = useMemo(() => {
    return GAMES.filter(g => !g.isComingSoon).sort((a, b) => {
      const aPlays = (playCounts[a.id] || 0) + a.basePlays;
      const bPlays = (playCounts[b.id] || 0) + b.basePlays;
      return bPlays - aPlays;
    });
  }, [playCounts]);

  const comingSoonGames = useMemo(() => GAMES.filter(g => g.isComingSoon), []);
  const mysteryGame = useMemo(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) hash = today.charCodeAt(i) + ((hash << 5) - hash);
    const playable = GAMES.filter(g => !g.isComingSoon);
    return playable[Math.abs(hash) % playable.length];
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 pb-12">
      {/* Hero Section */}
      {!searchTerm && activeCategory === 'All' && (
        <section className="relative h-[400px] xs:h-[500px] lg:h-[600px] tv:h-[700px] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden group shadow-2xl border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Hero Banner"
            loading="eager"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-12 lg:p-20 max-w-[1200px] space-y-6 sm:space-y-10">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-indigo-600/30 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/30">
                <ShieldCheck className="text-indigo-400" size={16} />
                <span className="text-[0.6rem] sm:text-xs font-black text-white uppercase tracking-widest">Secure Handshake v4</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/30">
                <Zap className="text-green-400" size={16} />
                <span className="text-[0.6rem] sm:text-xs font-black text-white uppercase tracking-widest">Instant Sync</span>
              </div>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl tv:text-9xl font-black text-white leading-none tracking-tighter uppercase">
              The Vault <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">Is Open.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-xl lg:text-2xl max-w-2xl font-medium leading-relaxed">
              High-performance cloud gaming architecture. Strictly verified for all displays.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-indigo-600 text-white hover:bg-indigo-500 px-8 sm:px-12 py-3 sm:py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[0.65rem] sm:text-sm transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                Initialize Stream <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Category Navigation */}
      <section className="sticky top-16 xs:top-20 z-[40] py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 shadow-xl overflow-hidden">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar flex-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name as Category)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 border border-transparent ${
                  activeCategory === cat.name
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-500 scale-105'
                    : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300 border-slate-800'
                }`}
              >
                <span className="text-lg sm:text-xl">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 shrink-0 justify-end">
            <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
              <ArrowUpDown size={14} className="text-slate-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[0.65rem] font-black uppercase tracking-widest text-white outline-none cursor-pointer"
              >
                <option value="Newest">Arrival Priority</option>
                <option value="Oldest">Legacy Core</option>
                <option value="Rating">Verified Score</option>
                <option value="Alphabetical">Index A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Mystery Daily Unlock */}
      {!searchTerm && activeCategory === 'All' && (
        <section className="animate-in fade-in zoom-in-95 duration-1000 max-w-[1920px] mx-auto w-full">
           <div className="relative p-6 sm:p-12 lg:p-20 rounded-[3rem] sm:rounded-[5rem] overflow-hidden border border-indigo-500/20 shadow-2xl bg-slate-900/50 group">
              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <Sparkles size={220} className="text-indigo-400" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 sm:gap-16">
                <div className="w-full md:w-[350px] lg:w-[450px] aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5 relative bg-black">
                   <img src={mysteryGame.thumbnail} className="w-full h-full object-cover mystery-reveal blur-3xl group-hover:blur-md" alt="Mystery" loading="lazy" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xl group-hover:bg-slate-950/30 transition-all duration-700">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
                        <Lock className="text-indigo-400" size={40} />
                      </div>
                      <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-[0.4em] text-white/50">Locked Stream Protocol</span>
                   </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-6 sm:space-y-10">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Zap className="text-indigo-400" size={28} />
                    <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Random Daily Protocol</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl tv:text-8xl font-black text-white tracking-tighter uppercase leading-none">Mystery Unlock of the Day</h2>
                  <p className="text-slate-400 max-w-2xl font-medium text-base sm:text-2xl leading-relaxed">
                    A dynamic selection from the deep vault. Reveal to initialize instant playback across your network.
                  </p>
                  <button 
                    onClick={() => window.location.hash = `#/game/${mysteryGame.id}`}
                    className="px-10 sm:px-14 py-4 sm:py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs sm:text-base rounded-[2.5rem] transition-all shadow-xl active:scale-95 group-hover:scale-105"
                  >
                    Initialize Reveal
                  </button>
                </div>
              </div>
           </div>
        </section>
      )}

      {/* Rankings Section */}
      {!searchTerm && activeCategory === 'All' && (
        <section className="space-y-10 sm:space-y-16 max-w-[2560px] mx-auto w-full">
           <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-4 sm:gap-6 tracking-tighter uppercase">
              <Trophy className="text-yellow-500 badge-glow" size={36} /> Ranked Performance
            </h2>
            <div className="h-px flex-1 bg-slate-900 ml-10 hidden lg:block"></div>
          </div>
          <AuthLock isLoggedIn={isLoggedIn} title="Identity Required to Access Ranks">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 tv:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
              {rankingGames.slice(0, 3).map((game, idx) => {
                const badge = idx === 0 ? "🥇 TOP VAULT" : idx === 1 ? "🥈 ELITE NODE" : "🥉 PRO SECTOR";
                const badgeColor = idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-600";
                return (
                  <div key={game.id} className="relative group">
                    <div className={`absolute -top-4 -left-4 z-20 ${badgeColor} text-slate-950 px-6 py-2.5 rounded-2xl font-black shadow-2xl text-[0.6rem] sm:text-xs uppercase tracking-widest transform -rotate-12 border-2 border-white/20 transition-transform group-hover:rotate-0`}>
                      {badge}
                    </div>
                    <GameCard 
                      game={game} 
                      isFavorite={favorites.includes(game.id)}
                      toggleFavorite={toggleFavorite}
                      rating={game.baseRating + (ratings[game.id] || 0) / 10}
                    />
                    <div className="mt-6 flex items-center justify-center gap-6 text-[0.65rem] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                       <div className="flex items-center gap-2"><Eye size={16} /> {(game.basePlays + (playCounts[game.id] || 0)).toLocaleString()}</div>
                       <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                       <span>SECURE STREAM</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AuthLock>
        </section>
      )}

      {/* Main Grid */}
      <section className="space-y-10 sm:space-y-16 max-w-[2560px] mx-auto w-full">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-6 tracking-tighter uppercase">
          <ShieldCheck className="text-indigo-500" size={40} /> 
          {searchTerm ? `Scanned Records (${processedGames.length})` : 'Full Game Vault'}
        </h2>
        
        {processedGames.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 tv:grid-cols-7 gap-6 sm:gap-10 lg:gap-12">
            {processedGames.map(game => (
              <GameCard 
                key={game.id} 
                game={game} 
                isFavorite={favorites.includes(game.id)}
                toggleFavorite={toggleFavorite}
                rating={game.baseRating + (ratings[game.id] || 0) / 10}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 sm:py-48 bg-slate-900/30 rounded-[3rem] sm:rounded-[5rem] border border-slate-800 shadow-inner">
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-slate-800 rounded-full flex items-center justify-center mb-10 text-slate-600">
              <Filter size={64} />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">Zero Records Found</h3>
            <p className="text-slate-500 mt-4 text-sm sm:text-2xl font-medium">Verify your search syntax and scan again.</p>
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      {!searchTerm && activeCategory === 'All' && (
        <section className="space-y-10 sm:space-y-16 max-w-[2560px] mx-auto w-full">
          <div className="flex items-center gap-4 sm:gap-6">
             <Target className="text-violet-500 badge-glow" size={40} />
             <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">Upcoming Prototypes</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {comingSoonGames.map(game => (
               <div key={game.id} className="relative p-8 sm:p-16 rounded-[3rem] sm:rounded-[5rem] bg-slate-900/60 border border-slate-800 overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 z-0">
                    <img src={game.thumbnail} className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-1000" alt="" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-transparent"></div>
                  </div>
                  <div className="relative z-10 space-y-6 sm:space-y-10">
                    <div className="flex items-center gap-3 px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-2xl w-fit">
                      <Lock size={20} />
                      <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-widest">Protocol Syncing</span>
                    </div>
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">{game.title}</h3>
                    <p className="text-slate-400 font-medium text-base sm:text-2xl leading-relaxed">{game.description}</p>
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[0.6rem] sm:text-[0.8rem] font-black text-slate-600 uppercase tracking-[0.3em]">Temporal Slot: {game.dateAdded}</span>
                       <div className="flex items-center gap-3">
                         <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                         <span className="text-[0.6rem] sm:text-[0.8rem] font-black text-indigo-400 uppercase tracking-widest">Compiling Assets</span>
                       </div>
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
