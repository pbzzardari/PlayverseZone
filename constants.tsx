
import { Game, Achievement } from './types';

export const GAMES: Game[] = [
  {
    id: 'idle-startup-tycoon',
    title: 'Idle Startup Tycoon',
    description: 'Build your tech empire from a humble startup to a global unicorn in this addictive idle business simulator.',
    thumbnail: 'https://i.ibb.co/KcRmJXT2/image.png',
    category: 'Idle',
    iframeUrl: 'https://html5.gamedistribution.com/c3a9f519b4ae4896b34025486dc2ed13/?gd_sdk_referrer_url=https://www.example.com/games/idle-startup',
    isFeatured: true,
    isTrending: true,
    tags: ['business', 'tycoon', 'clicker'],
    dateAdded: '2024-01-15',
    baseRating: 4.8,
    basePlays: 1250430
  },
  {
    id: 'cinema-business',
    title: 'Cinema Business',
    description: 'Manage popcorn stands, screen the latest blockbusters, and grow your theater chain to dominate the box office.',
    thumbnail: 'https://i.ibb.co/KpkSJjj1/image.png',
    category: 'Idle',
    iframeUrl: 'https://html5.gamedistribution.com/7cc0378d15b34bcea94a051b0aab0de9/?gd_sdk_referrer_url=https://www.example.com/games/cinema-business',
    isFeatured: false,
    isTrending: true,
    isNew: true,
    tags: ['management', 'cinema', 'money'],
    dateAdded: '2024-02-10',
    baseRating: 4.5,
    basePlays: 843200
  },
  {
    id: 'fast-ball-jump',
    title: 'Fast Ball Jump',
    description: 'Test your reflexes in this high-speed arcade jumper. Dodge obstacles and aim for the high score.',
    thumbnail: 'https://i.ibb.co/JjThNHWB/image.png',
    category: 'Arcade',
    iframeUrl: 'https://html5.gamedistribution.com/7c9845af6bdb42ab8796a339a47da6a4/?gd_sdk_referrer_url=https://www.example.com/games/fast-ball-jump',
    isFeatured: true,
    isTrending: false,
    isNew: false,
    tags: ['reflex', 'bounce', 'score'],
    dateAdded: '2023-11-05',
    baseRating: 4.2,
    basePlays: 2105400
  },
  {
    id: 'idle-factory-domination',
    title: 'Idle Factory Domination',
    description: 'Optimize supply chains and automate massive production lines to achieve industrial supremacy.',
    thumbnail: 'https://i.ibb.co/TDX2xYPS/image.png',
    category: 'Idle',
    iframeUrl: 'https://html5.gamedistribution.com/7d900e290aa649859e4780e429323fbc/?gd_sdk_referrer_url=https://www.example.com/games/idle-factory',
    isFeatured: false,
    isTrending: true,
    isNew: true,
    tags: ['factory', 'automation', 'strategy'],
    dateAdded: '2024-02-01',
    baseRating: 4.7,
    basePlays: 532000
  },
  {
    id: 'zero-to-millionaire',
    title: 'Zero to Millionaire',
    description: 'Make smart choices and solve puzzles to climb the social ladder from rags to riches.',
    thumbnail: 'https://i.ibb.co/C3z0ST87/image.png',
    category: 'Puzzle',
    iframeUrl: 'https://html5.gamedistribution.com/a3b05c8c36084707be9c6f58c6723c9a/?gd_sdk_referrer_url=https://www.example.com/games/zero-millionaire',
    isFeatured: true,
    isTrending: false,
    isNew: true,
    tags: ['life-sim', 'choices', 'rich'],
    dateAdded: '2024-02-15',
    baseRating: 4.6,
    basePlays: 3205000
  },
  {
    id: 'pubg-native-beta',
    title: 'PUBG Mobile Native',
    description: 'Experience the full Battle Royale intensity directly in your browser with zero latency technology. (Coming Soon)',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400',
    category: 'Action',
    iframeUrl: '',
    isComingSoon: true,
    tags: ['pubg', 'battle-royale', 'fps', 'survival'],
    dateAdded: '2026-01-01',
    baseRating: 5.0,
    basePlays: 0
  },
  {
    id: 'hoverboard-racers-vr',
    title: 'Hoverboard Pro VR',
    description: 'Cybernetic racing in a neon-lit future. Defy gravity on flying boards. (Coming Soon)',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=400',
    category: 'Racing',
    iframeUrl: '',
    isComingSoon: true,
    tags: ['hoverboard', 'racing', 'cyberpunk', 'vr'],
    dateAdded: '2025-11-20',
    baseRating: 4.9,
    basePlays: 0
  }
];

export const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'All', icon: '🎮' },
  { name: 'Idle', icon: '⏳' },
  { name: 'Arcade', icon: '🕹️' },
  { name: 'Puzzle', icon: '🧩' },
  { name: 'Action', icon: '💥' },
  { name: 'Racing', icon: '🏎️' }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'rookie-gamer',
    title: 'Rookie Gamer',
    description: 'Play your first 3 games',
    icon: '🎯',
    requirement: { type: 'play_count', value: 3 }
  },
  {
    id: 'idle-master',
    title: 'Idle Master',
    description: 'Play 3 different Idle games',
    icon: '⏳',
    requirement: { type: 'category_count', value: 3, category: 'Idle' }
  },
  {
    id: 'collector',
    title: 'Curator',
    description: 'Add 3 games to your favorites',
    icon: '⭐',
    requirement: { type: 'favorite_count', value: 3 }
  }
];
