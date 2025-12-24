
export type Category = 'All' | 'Action' | 'Puzzle' | 'Racing' | 'Idle' | 'Arcade';

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  iframeUrl: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isComingSoon?: boolean;
  tags: string[];
  dateAdded: string;
  baseRating: number;
  basePlays: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'play_count' | 'category_count' | 'favorite_count';
    value: number;
    category?: Category;
  };
}

export interface UserStats {
  gamesPlayed: number;
  categoryStats: Record<string, number>;
  totalFavorites: number;
}

export interface User {
  username: string;
  email: string;
  avatar?: string;
}
