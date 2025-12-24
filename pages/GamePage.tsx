
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Maximize2, 
  RotateCcw, 
  Heart, 
  Share2, 
  Info,
  Loader2,
  Tv,
  Star,
  Gamepad2,
  ShieldCheck,
  Users,
  Eye,
  Zap,
  Lock,
  Activity
} from 'lucide-react';
import { GAMES } from '../constants';

interface GamePageProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addToRecent: (id: string) => void;
  ratings: Record<string, number>;
  setUserRating: (gameId: string, rating: number) => void;
  playCounts: Record<string, number>;
}

const loadingMessages = [
  "Initializing secure handshake...",
  "Allocating neural buffers...",
  "Encrypting game stream (AES-256)...",
  "Compiling low-latency shaders...",
  "Verifying content safety rating...",
  "Establishing V4.0 cloud link...",
  "Handshake successful. Launching..."
];

const GamePage: React.FC<GamePageProps> = ({ favorites, toggleFavorite, addToRecent, ratings, setUserRating, playCounts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [livePlayers, setLivePlayers] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (game && !game.isComingSoon) {
      setLivePlayers(Math.floor(Math.random() * 800) + 1400);
      const playerInterval = setInterval(() => {
        setLivePlayers(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
      }, 4000);
      return () => clearInterval(playerInterval);
    }
  }, [game]);

  const currentRating = useMemo(() => {
    if (!game) return 0;
    return game.baseRating + (ratings[game.id] || 0) / 10;
  }, [game, ratings]);

  const totalPlays = useMemo(() => {
    if (!game) return 0;
    return game.basePlays + (playCounts[game.id] || 0);
  }, [game, playCounts]);

  useEffect(() => {
    if (game && !game.isComingSoon) {
      addToRecent(game.id);
      window.scrollTo(0, 0);
      
      let msgIdx = 0;
      let progress = 0;
      const interval = setInterval(() => {
        msgIdx = (msgIdx + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[msgIdx]);
        progress = Math.min(progress + 15, 95);
        setLoadingProgress(progress);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [game, addToRecent]);

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-10 min-h-[70vh]">
        <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-slate-700 border border-slate-800 shadow-2xl">
          <Gamepad2 size={56} />
        </div>
        <div className="text-center space-y-3 px-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase">Record Not Found</h2>
          <p className="text-slate-500 text-base sm:text-xl font-medium">This sector of the vault is empty or offline.</p>
        </div>
        <Link to="/" className="bg-indigo-600 text-white px-10 py-4 sm:px-14 sm:py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-[0.65rem] sm:text-sm hover:bg-indigo-500 transition-all shadow-2xl">
          <ArrowLeft size={20} className="inline mr-3" /> Return to Hub
        </Link>
      </div>
    );
  }

  if (game.isComingSoon) {
     return (
        <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-12 max-w-5xl mx-auto text-center px-4">
            <div className="p-10 bg-indigo-600/20 border border-indigo-500/30 rounded-[4rem] relative shadow-3xl">
              <Lock size={80} className="text-indigo-400" />
              <div className="absolute inset-0 animate-ping opacity-10 bg-indigo-600 rounded-[4rem]"></div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Zap className="text-violet-500 badge-glow" size={24} />
                <span className="text-[0.6rem] sm:text-xs font-black uppercase tracking-[0.5em] text-violet-500">Access Restricted</span>
              </div>
              <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none">{game.title}</h2>
              <p className="text-slate-400 text-lg sm:text-3xl font-medium leading-relaxed max-w-3xl mx-auto">{game.description}</p>
            </div>
            <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] w-full max-w-2xl space-y-6">
               <div className="flex justify-between items-center text-[0.6rem] sm:text-xs font-black text-slate-500 uppercase tracking-widest">
                  <span>Protocol Synchronization</span>
                  <span className="text-indigo-400">12.5% Complete</span>
               </div>
               <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full w-[12.5%] bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
               </div>
            </div>
            <Link to="/" className="text-slate-500 hover:text-indigo-400 font-black uppercase tracking-widest text-xs sm:text-base transition-colors flex items-center gap-4">
              <ArrowLeft size={24} /> Back to Catalog
            </Link>
        </div>
     );
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLoadingProgress(0);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-700 pb-20 max-w-[2560px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="flex items-start gap-6 sm:gap-10">
          <button 
            onClick={() => navigate(-1)} 
            className="p-5 sm:p-8 rounded-3xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-2xl active:scale-95 group shrink-0"
            aria-label="Go Back"
          >
            <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
          </button>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <ShieldCheck size={24} className="text-green-500 badge-glow" strokeWidth={3} />
               <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.4em] text-slate-500">Verified Secure Node v4.0</span>
            </div>
            <h1 className="text-3xl sm:text-6xl lg:text-7xl tv:text-8xl font-black text-white tracking-tighter leading-none uppercase">{game.title}</h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-6">
              <span className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-widest shadow-2xl">{game.category}</span>
              <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-lg sm:text-2xl font-black text-white">{currentRating.toFixed(1)}</span>
                <span className="text-[0.6rem] sm:text-[0.7rem] text-slate-600 font-bold uppercase tracking-tight ml-2 hidden xs:inline">({(totalPlays/15).toFixed(0)} Audited)</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-2.5 bg-green-950/20 text-green-500 rounded-2xl border border-green-500/20">
                <Activity size={20} className="animate-pulse" />
                <span className="text-[0.65rem] sm:text-[0.7rem] font-black uppercase tracking-widest">{livePlayers.toLocaleString()} Online Streams</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 justify-center sm:justify-start">
           <button 
            onClick={() => toggleFavorite(game.id)}
            className={`px-8 py-5 sm:px-12 sm:py-8 rounded-[2.5rem] transition-all shadow-3xl flex items-center gap-4 font-black text-[0.65rem] sm:text-xs uppercase tracking-[0.2em] border-2 ${
              favorites.includes(game.id) 
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20' 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-rose-500 hover:border-rose-500/50'
            }`}
          >
            <Heart fill={favorites.includes(game.id) ? 'white' : 'none'} size={24} />
            {favorites.includes(game.id) ? 'Vaulted' : 'Save to Vault'}
          </button>
          <button className="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-3xl" aria-label="Share">
            <Share2 size={32} />
          </button>
        </div>
      </div>

      {/* Responsive Iframe Container */}
      <div className={`transition-all duration-1000 ease-in-out ${isTheater ? 'max-w-none px-0' : 'max-w-[1920px] mx-auto px-0 xs:px-4 sm:px-8'}`}>
        <div className="relative w-full aspect-video xs:aspect-[16/9] bg-black rounded-none sm:rounded-[4rem] lg:rounded-[5rem] overflow-hidden shadow-[0_50px_200px_rgba(0,0,0,0.9)] border border-slate-800/50 group">
          {isLoading && (
            <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950 px-6 sm:px-10">
              <div className="relative mb-12">
                <div className="w-24 h-24 sm:w-40 sm:h-40 border-[6px] border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Zap size={48} className="text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-6 max-w-2xl w-full">
                <p className="text-xl sm:text-4xl font-black text-white uppercase tracking-tighter">{loadingMsg}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-[0.65rem] sm:text-xs font-black text-slate-600 uppercase tracking-widest">
                    <span>Synchronization Status</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${loadingProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <iframe 
            ref={iframeRef}
            src={game.iframeUrl}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            allow="autoplay; fullscreen; keyboard"
            title={game.title}
            loading="lazy"
          />

          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 flex items-center gap-4 sm:gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0 z-[70]">
            <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-3xl">
               <button onClick={handleRefresh} className="p-3 text-slate-400 hover:text-indigo-400 transition-colors" title="Reload Vault Interface"><RotateCcw size={28} /></button>
               <button onClick={() => setIsTheater(!isTheater)} className="p-3 text-slate-400 hover:text-indigo-400 transition-colors" title="Toggle Theater Mode"><Tv size={28} /></button>
               <button onClick={handleFullscreen} className="p-5 sm:p-7 bg-indigo-600 text-white rounded-2xl sm:rounded-3xl hover:bg-indigo-500 transition-all shadow-2xl hover:scale-110 active:scale-95"><Maximize2 size={28} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-20 px-4 sm:px-8">
        <div className="lg:col-span-2 space-y-12 sm:space-y-20">
          <div className="p-8 sm:p-16 bg-slate-900/50 rounded-[3rem] sm:rounded-[5rem] shadow-3xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
              <h2 className="text-3xl sm:text-5xl font-black text-white flex items-center gap-5 sm:gap-8 tracking-tighter uppercase">
                <Info size={40} className="text-indigo-500" /> Operational Data
              </h2>
              <div className="flex items-center gap-4 text-slate-500 text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.4em] bg-slate-950/60 px-6 py-3 rounded-2xl border border-slate-800 shadow-inner">
                <Eye size={20} /> {(totalPlays).toLocaleString()} INSTANCES
              </div>
            </div>
            <p className="text-slate-400 text-lg sm:text-3xl font-medium leading-relaxed mb-12">
              {game.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {game.tags.map(tag => (
                <span key={tag} className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-950 text-slate-500 rounded-3xl text-[0.6rem] sm:text-xs font-black uppercase tracking-[0.2em] border border-slate-800 hover:text-indigo-400 hover:border-indigo-400/40 transition-all cursor-default">#{tag}</span>
              ))}
            </div>
          </div>
          
          <div className="p-8 sm:p-16 bg-slate-900/50 rounded-[3rem] sm:rounded-[5rem] shadow-3xl border border-slate-800">
             <h2 className="text-3xl sm:text-5xl font-black text-white mb-12 tracking-tighter uppercase">Calibration Profile</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div className="flex items-center gap-8 bg-slate-950/60 p-8 sm:p-12 rounded-[3rem] border border-slate-800 shadow-inner group hover:border-indigo-500/40 transition-all">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-indigo-600 text-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl font-black text-3xl group-hover:rotate-12 transition-transform">M1</div>
                  <div className="space-y-2">
                    <div className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">Kinetic Key</div>
                    <div className="text-[0.65rem] sm:text-xs text-slate-600 font-black uppercase tracking-[0.2em]">Primary Trigger</div>
                  </div>
                </div>
                <div className="flex items-center gap-8 bg-slate-950/60 p-8 sm:p-12 rounded-[3rem] border border-slate-800 shadow-inner group hover:border-indigo-500/40 transition-all">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-slate-800 text-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl font-black text-3xl group-hover:-rotate-12 transition-transform">Esc</div>
                  <div className="space-y-2">
                    <div className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">System Out</div>
                    <div className="text-[0.65rem] sm:text-xs text-slate-600 font-black uppercase tracking-[0.2em]">Context Break</div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-12 sm:space-y-20">
          <div className="p-10 sm:p-16 bg-gradient-to-br from-indigo-600 via-indigo-950 to-slate-950 text-white rounded-[4rem] sm:rounded-[5.5rem] shadow-3xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
              <ShieldCheck size={300} fill="white" />
            </div>
            <h3 className="font-black text-4xl sm:text-5xl mb-6 relative tracking-tighter uppercase leading-none">Feedback Node</h3>
            <p className="text-indigo-100 text-base sm:text-2xl mb-12 opacity-80 relative font-medium leading-relaxed">Your data points help us calibrate the Playverse Cloud library for all displays.</p>
            
            <div className="flex flex-col gap-10 relative">
              <div className="flex items-center justify-center bg-white/5 backdrop-blur-3xl p-8 sm:p-12 rounded-[3rem] border border-white/10 shadow-inner">
                 <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button 
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(game.id, star)}
                      className="transition-all hover:scale-[1.5] sm:hover:scale-[1.8] hover:-translate-y-3 active:scale-125 shrink-0"
                     >
                       <Star 
                        size={48} 
                        className={star <= (hoverRating || (ratings[game.id] || 0)) ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" : "text-white/10"} 
                       />
                     </button>
                   ))}
                 </div>
              </div>
              <div className="text-center font-black text-2xl sm:text-4xl uppercase tracking-[0.4em] bg-indigo-500/20 py-6 sm:py-8 rounded-[2.5rem] border border-white/10">
                 {currentRating.toFixed(1)} <span className="text-indigo-400">/ 5.0</span>
              </div>
            </div>
          </div>

          <div className="p-10 sm:p-16 bg-slate-900/50 rounded-[3rem] sm:rounded-[5rem] shadow-3xl border border-slate-800">
            <h3 className="font-black text-xl sm:text-3xl text-white mb-10 uppercase tracking-tighter">Vault Metadata</h3>
            <div className="space-y-10">
              <div className="flex justify-between items-center text-[0.65rem] sm:text-xs font-black uppercase tracking-widest">
                <span className="text-slate-600">Sync Date</span>
                <span className="text-slate-300">{game.dateAdded}</span>
              </div>
              <div className="h-px bg-slate-800/60"></div>
              <div className="flex justify-between items-center text-[0.65rem] sm:text-xs font-black uppercase tracking-widest">
                <span className="text-slate-600">Asset Health</span>
                <span className="text-green-500 badge-glow">STABLE</span>
              </div>
              <div className="h-px bg-slate-800/60"></div>
              <div className="flex justify-between items-center text-[0.65rem] sm:text-xs font-black uppercase tracking-widest">
                <span className="text-slate-600">Platform Core</span>
                <span className="text-indigo-400">V4.0 CLOUD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
