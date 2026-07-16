export type Page = 'home' | 'profile' | 'store' | 'community' | 'marketplace';

export interface HorseStats {
  speed: number; // 0-100
  stamina: number;
  acceleration: number;
  power: number;
}

export interface HorseRecord {
  wins: number;
  places: number; // top 3
  starts: number;
  bestTime: string;
  topTitle: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number; // Jacoins / month
  color: 'rumput' | 'wortel' | 'apel';
  perks: string[];
  badge?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'report';
  tier: 'rumput' | 'wortel' | 'apel';
  thumbnail: string;
  description: string;
  date: string;
}

export interface Horse {
  id: string;
  name: string;
  stable: string; // asal peternakan
  region: string;
  image: string;
  coverImage: string;
  status: 'active' | 'retired';
  badge: string; // e.g. "Juara 1 Derby 2025"
  bio: string;
  stats: HorseStats;
  record: HorseRecord;
  tiers: MembershipTier[];
  feed: FeedItem[];
  totalDukungan: number;
  supporters: number;
  accent: 'gold' | 'silver' | 'clay';
}

export interface RescueHorse {
  id: string;
  name: string;
  image: string;
  story: string;
  need: string; // e.g. "Operasi kaki"
  raised: number; // Jacoins
  goal: number; // Jacoins
  daysLeft: number;
  urgency: 'critical' | 'high' | 'moderate';
}

export interface FanartPost {
  id: string;
  author: string;
  avatar: string;
  horseId: string;
  title: string;
  image: string;
  likes: number;
  comments: number;
  tag: 'fanart' | 'lore' | 'bloodline';
  timeAgo: string;
}

export interface ForumThread {
  id: string;
  author: string;
  avatar: string;
  title: string;
  body: string;
  horseId: string;
  replies: number;
  likes: number;
  tag: 'lore' | 'stats' | 'bloodline' | 'moefikasi';
  timeAgo: string;
}

export interface SultanEntry {
  id: string;
  name: string;
  avatar: string;
  spent: number; // Jacoins this month
  title: string; // e.g. "Sultan Wortel"
  rank: number;
}

export interface MerchItem {
  id: string;
  name: string;
  artisan: string; // UMKM name
  image: string;
  price: number; // Jacoins
  priceRupiah: number;
  category: 'apparel' | 'accessory' | 'photocard' | 'nfc';
  stock: number;
  description: string;
  badge?: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  priceRupiah: number;
  bonus: number; // extra coins
  popular?: boolean;
  bestValue?: boolean;
}
