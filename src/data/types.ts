export type Page = 'home' | 'profile' | 'store' | 'community' | 'marketplace' | 'wisata';

export interface HorseStats {
  speed: number;
  stamina: number;
  acceleration: number;
  power: number;
}

export interface HorseRecord {
  wins: number;
  places: number;
  starts: number;
  bestTime: string;
  topTitle: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
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
  stable: string;
  region: string;
  image: string;
  coverImage: string;
  status: 'active' | 'retired';
  badge: string;
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
  need: string;
  raised: number;
  goal: number;
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
  spent: number;
  title: string;
  rank: number;
}

export interface MerchItem {
  id: string;
  name: string;
  artisan: string;
  image: string;
  price: number;
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
  bonus: number;
  popular?: boolean;
  bestValue?: boolean;
}

export interface User {
  name: string;
  loggedInAt: string;
}

export interface TicketPackage {
  id: string;
  name: string;
  stable: string;
  region: string;
  price: number;
  duration: string;
  includes: string[];
  image: string;
  available: number;
}

export interface StableLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  type: 'active' | 'retired' | 'rescue';
  description: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  region: string;
  description: string;
  attendees: number;
  image: string;
}
