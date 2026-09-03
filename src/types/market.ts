export type TabType = 'watchlist' | 'chart' | 'markets' | 'community' | 'menu';

export type CategoryFilter = 
  | 'Indices' 
  | 'Futures' 
  | 'Forex' 
  | 'Government bonds' 
  | 'Crypto' 
  | 'US stocks';

export type TrendSegment = 'Most active' | 'Gainers' | 'Losers' | 'Volatile';

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  category: CategoryFilter;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  marketCap?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: string;
  iconType?: 'sp500' | 'nasdaq' | 'dow' | 'flag' | 'nvidia' | 'apple' | 'microsoft' | 'crypto' | 'forex' | 'generic';
  rangeLow?: number;
  rangeHigh?: number;
  sparklineData: number[]; // relative price points
  volume?: string;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  peRatio?: number;
  dividendYield?: string;
  week52High?: number;
  week52Low?: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorBadge?: string;
  symbol: string;
  symbolName: string;
  title: string;
  content: string;
  timeAgo: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  timeframe: string;
}
