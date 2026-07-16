import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

const WALLET_KEY = 'umasupp_wallet';
const SUBS_KEY = 'umasupp_subscriptions';
const SUPPORTED_KEY = 'umasupp_supported';
const DUKUNGAN_FEED_KEY = 'umasupp_dukungan_feed';
const CART_KEY = 'umasupp_cart';

export interface WalletState {
  balance: number;
}

export interface Subscription {
  horseId: string;
  tierId: string;
  subscribedAt: string;
}

export interface DukunganRecord {
  horseId: string;
  amount: number;
  time: string;
}

export interface CartItem {
  merchId: string;
  qty: number;
}

interface AppContextValue {
  balance: number;
  subscriptions: Subscription[];
  supportedHorses: string[];
  dukunganFeed: DukunganRecord[];
  cart: CartItem[];
  topUp: (coins: number) => void;
  spend: (amount: number) => boolean;
  dukungan: (horseId: string, amount: number) => boolean;
  subscribe: (horseId: string, tierId: string, price: number) => boolean;
  isSubscribed: (horseId: string, tierId: string) => boolean;
  getHighestTier: (horseId: string) => string | null;
  addToCart: (merchId: string, qty?: number) => void;
  removeFromCart: (merchId: string) => void;
  updateCartQty: (merchId: string, qty: number) => void;
  clearCart: () => void;
  checkoutCart: () => boolean;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(() => load<number>(WALLET_KEY, 0));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => load<Subscription[]>(SUBS_KEY, []));
  const [supportedHorses, setSupportedHorses] = useState<string[]>(() => load<string[]>(SUPPORTED_KEY, []));
  const [dukunganFeed, setDukunganFeed] = useState<DukunganRecord[]>(() => load<DukunganRecord[]>(DUKUNGAN_FEED_KEY, []));
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>(CART_KEY, []));

  useEffect(() => save(WALLET_KEY, balance), [balance]);
  useEffect(() => save(SUBS_KEY, subscriptions), [subscriptions]);
  useEffect(() => save(SUPPORTED_KEY, supportedHorses), [supportedHorses]);
  useEffect(() => save(DUKUNGAN_FEED_KEY, dukunganFeed), [dukunganFeed]);
  useEffect(() => save(CART_KEY, cart), [cart]);

  const topUp = useCallback((coins: number) => {
    setBalance((b) => b + coins);
  }, []);

  const spend = useCallback((amount: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= amount) {
        ok = true;
        return b - amount;
      }
      return b;
    });
    return ok;
  }, []);

  const dukungan = useCallback((horseId: string, amount: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= amount) {
        ok = true;
        return b - amount;
      }
      return b;
    });
    if (ok) {
      setDukunganFeed((f) => [{ horseId, amount, time: new Date().toISOString() }, ...f].slice(0, 30));
      setSupportedHorses((h) => (h.includes(horseId) ? h : [...h, horseId]));
    }
    return ok;
  }, []);

  const subscribe = useCallback((horseId: string, tierId: string, price: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= price) {
        ok = true;
        return b - price;
      }
      return b;
    });
    if (ok) {
      setSubscriptions((subs) => {
        const filtered = subs.filter((s) => !(s.horseId === horseId));
        return [...filtered, { horseId, tierId, subscribedAt: new Date().toISOString() }];
      });
      setSupportedHorses((h) => (h.includes(horseId) ? h : [...h, horseId]));
    }
    return ok;
  }, []);

  const isSubscribed = useCallback(
    (horseId: string, tierId: string) => subscriptions.some((s) => s.horseId === horseId && s.tierId === tierId),
    [subscriptions]
  );

  const getHighestTier = useCallback(
    (horseId: string): string | null => {
      const order = ['apel', 'wortel', 'rumput'];
      const sub = subscriptions.find((s) => s.horseId === horseId);
      if (!sub) return null;
      return order.includes(sub.tierId) ? sub.tierId : null;
    },
    [subscriptions]
  );

  const addToCart = useCallback((merchId: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.merchId === merchId);
      if (existing) {
        return c.map((i) => (i.merchId === merchId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...c, { merchId, qty }];
    });
  }, []);

  const removeFromCart = useCallback((merchId: string) => {
    setCart((c) => c.filter((i) => i.merchId !== merchId));
  }, []);

  const updateCartQty = useCallback((merchId: string, qty: number) => {
    if (qty <= 0) {
      setCart((c) => c.filter((i) => i.merchId !== merchId));
    } else {
      setCart((c) => c.map((i) => (i.merchId === merchId ? { ...i, qty } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkoutCart = useCallback((): boolean => {
    return true;
  }, []);

  const value: AppContextValue = {
    balance,
    subscriptions,
    supportedHorses,
    dukunganFeed,
    cart,
    topUp,
    spend,
    dukungan,
    subscribe,
    isSubscribed,
    getHighestTier,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    checkoutCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
