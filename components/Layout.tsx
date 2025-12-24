
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Moon, 
  Sun, 
  Gamepad2, 
  User, 
  Menu, 
  X,
  Star,
  Clock,
  Trophy,
  ShieldCheck,
  LogOut,
  UserCircle,
  Calendar,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import ProfileModal from './ProfileModal';
import { UserStats, User as UserType } from '../types';
import { GAMES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSearch: (term: string) => void;
  userStats: UserStats;
  earnedAchievements: string[];
  currentUser: UserType | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, toggleTheme, onSearch, userStats, earnedAchievements, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
    setShowSuggestions(val.length > 0);
  };

  const filteredSuggestions = GAMES.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const isCountdownSecret = searchTerm.toLowerCase() === '2026' || searchTerm.toLowerCase() === 'countdown';
  const isPubgSecret = searchTerm.toLowerCase() === 'pubg' || searchTerm.toLowerCase() === 'battle';
  const isHoverSecret = searchTerm.toLowerCase() === 'hover' || searchTerm.toLowerCase() === 'future';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        stats={userStats} 
        earnedAchievements={earnedAchievements}
      />

      <div className="bg-indigo-600 py-2 px-4 text-white text-center">
        <p className="text-[0.65rem] xs:text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <ShieldCheck size={14} strokeWidth={3} /> <span className="hidden xs:inline">Secure Browser Protocol v4.0 Active</span><span className="xs:hidden">SECURE VAULT v4.0</span>
        </p>
      </div>

      <nav className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 xs:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
              <Gamepad2 size={24} />
            </div>
            <span className="text-xl xs:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 hidden xs:block tracking-tighter">
              PLAYVERSE
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl relative" ref={suggestionsRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Scan for secure data..." 
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="p-3 space-y-1">
                  {isCountdownSecret && (
                    <button 
                      onClick={() => { navigate('/countdown'); setShowSuggestions(false); setSearchTerm(''); }}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg"
                    >
                      <Calendar size={20} />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Timeline Access</p>
                        <p className="text-sm font-black">2026 Countdown Secret</p>
                      </div>
                    </button>
                  )}
                  {filteredSuggestions.map(game => (
                    <button 
                      key={game.id}
                      onClick={() => { 
                        if (game.isComingSoon) return;
                        navigate(`/game/${game.id}`); 
                        setShowSuggestions(false); 
                        setSearchTerm(''); 
                      }}
                      className={`w-full flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-800 transition-all group ${game.isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <img src={game.thumbnail} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="" loading="lazy" />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-white group-hover:text-indigo-400 truncate">{game.title}</p>
                          {game.isComingSoon && <span className="text-[8px] font-black bg-indigo-600 px-1 rounded">LOCKED</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{game.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 xs:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-2xl transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-8 w-px bg-slate-800 mx-1 hidden xs:block"></div>
            
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 p-1.5 pr-4 bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all border border-slate-800"
                >
                  <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 xs:w-10 xs:h-10 rounded-full border border-indigo-500 shadow-lg" loading="lazy" />
                  <span className="text-sm font-black text-white hidden lg:block tracking-tight">{currentUser.username}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2.5 text-slate-500 hover:text-rose-500 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 px-4 xs:px-6 py-2 xs:py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[0.7rem] xs:text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <UserCircle size={18} /> <span className="hidden xs:inline">Join Vault</span><span className="xs:hidden">JOIN</span>
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-slate-400 hover:text-white rounded-2xl transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 xs:top-20 z-[100] bg-slate-950/95 backdrop-blur-2xl p-6 animate-in slide-in-from-right duration-500 md:hidden overflow-y-auto">
          <div className="flex flex-col gap-6 max-w-lg mx-auto">
             <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search secure games..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
              />
            </div>
            <div className="space-y-4">
              <button onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }} className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-900 text-white border border-slate-800">
                <div className="flex items-center gap-4">
                  <Trophy size={24} className="text-yellow-500" />
                  <span className="font-black uppercase tracking-widest text-xs">Rank Leaderboards</span>
                </div>
                <Target size={18} className="text-slate-700" />
              </button>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-between p-5 rounded-3xl bg-slate-900 text-white border border-slate-800">
                <div className="flex items-center gap-4">
                  <Star size={24} className="text-rose-500" />
                  <span className="font-black uppercase tracking-widest text-xs">Secure Favorites</span>
                </div>
                <Target size={18} className="text-slate-700" />
              </Link>
              {!currentUser && (
                 <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-4 p-6 rounded-[2.5rem] bg-indigo-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl text-center justify-center">
                   <UserCircle size={24} /> Create Identity
                 </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[2560px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {children}
      </main>

      <footer className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="flex items-center gap-2">
                <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/10">
                  <Gamepad2 size={28} />
                </div>
                <span className="text-2xl xs:text-3xl font-black text-white tracking-tighter uppercase">PLAYVERSE</span>
              </div>
              <p className="text-slate-500 text-sm xs:text-base max-w-sm leading-relaxed">
                Hardware-accelerated cloud gaming vault. Resilient architecture for all displays.
              </p>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-8 md:gap-12 lg:gap-20">
               <div className="flex flex-col items-center gap-3">
                 <ShieldCheck size={36} className="text-green-500 opacity-80" />
                 <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500 text-center">AES-256</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                 <Zap size={36} className="text-indigo-500 opacity-80" />
                 <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500 text-center">NEURAL</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                 <Trophy size={36} className="text-yellow-500 opacity-80" />
                 <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500 text-center">RANKED</span>
               </div>
               <div className="flex flex-col items-center gap-3">
                 <Sparkles size={36} className="text-violet-500 opacity-80" />
                 <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-500 text-center">SECURE</span>
               </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-900 text-center space-y-8">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-slate-500 text-[0.65rem] xs:text-xs font-black uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-indigo-400 transition-colors">Safety Hub</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Compliance</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Status</a>
            </div>
            <p className="text-slate-600 text-[0.6rem] xs:text-[0.7rem] font-medium tracking-wide">
              © {new Date().getFullYear()} PLAYVERSE ZONE. ALL STREAMS ENCRYPTED. PROTECTING PLAYER INTEGRITY.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
