import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

const WALLET_KEY = 'umasupp_wallet';
const SUBS_KEY = 'umasupp_subscriptions';
const SUPPORTED_KEY = 'umasupp_supported';
const DUKUNGAN_FEED_KEY = 'umasupp_dukungan_feed';
const CART_KEY = 'umasupp_cart';
const RESCUE_KEY = 'umasupp_rescue_donations';
const MERCH_STOCK_KEY = 'umasupp_merch_stock';
const TICKETS_KEY = 'umasupp_tickets';

// Session-only keys (sessionStorage — cleared on tab close)
const USER_KEY = 'umasupp_user';
const SESSION_DUKUNGAN_KEY = 'umasupp_session_dukungan';
const SESSION_LIKES_KEY = 'umasupp_session_likes';
const SESSION_TICKETS_KEY = 'umasupp_session_tickets';

export interface Subscription {
  horseId: string;
  tierId: string;
  subscribedAt: string;
}

export interface DukunganRecord {
  horseId: string;
  amount: number;
  time: string;
  userName?: string;
}

export interface CartItem {
  merchId: string;
  qty: number;
}

export interface User {
  name: string;
  loggedInAt: string;
}

interface AppContextValue {
  balance: number;
  subscriptions: Subscription[];
  supportedHorses: string[];
  dukunganFeed: DukunganRecord[];
  cart: CartItem[];
  rescueDonations: Record<string, number>;
  merchStock: Record<string, number>;
  ticketPurchases: string[];
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
  buyMerch: (items: CartItem[], useJacoins: boolean, totalJacoins: number) => boolean;
  buyTicket: (ticketId: string, price: number) => boolean;
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  sessionDukungan: number;
  sessionLikes: string[];
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  sessionTickets: string[];
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

function saveSession<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(() => load<number>(WALLET_KEY, 0));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => load<Subscription[]>(SUBS_KEY, []));
  const [supportedHorses, setSupportedHorses] = useState<string[]>(() => load<string[]>(SUPPORTED_KEY, []));
  const [dukunganFeed, setDukunganFeed] = useState<DukunganRecord[]>(() => load<DukunganRecord[]>(DUKUNGAN_FEED_KEY, []));
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>(CART_KEY, []));
  const [rescueDonations, setRescueDonations] = useState<Record<string, number>>(() => load<Record<string, number>>(RESCUE_KEY, {}));
  const [merchStock, setMerchStock] = useState<Record<string, number>>(() => load<Record<string, number>>(MERCH_STOCK_KEY, {}));
  const [ticketPurchases, setTicketPurchases] = useState<string[]>(() => load<string[]>(TICKETS_KEY, []));

  const [user, setUser] = useState<User | null>(() => loadSession<User | null>(USER_KEY, null));
  const [sessionDukungan, setSessionDukungan] = useState<number>(() => loadSession<number>(SESSION_DUKUNGAN_KEY, 0));
  const [sessionLikes, setSessionLikes] = useState<string[]>(() => loadSession<string[]>(SESSION_LIKES_KEY, []));
  const [sessionTickets, setSessionTickets] = useState<string[]>(() => loadSession<string[]>(SESSION_TICKETS_KEY, []));

  useEffect(() => save(WALLET_KEY, balance), [balance]);
  useEffect(() => save(SUBS_KEY, subscriptions), [subscriptions]);
  useEffect(() => save(SUPPORTED_KEY, supportedHorses), [supportedHorses]);
  useEffect(() => save(DUKUNGAN_FEED_KEY, dukunganFeed), [dukunganFeed]);
  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => save(RESCUE_KEY, rescueDonations), [rescueDonations]);
  useEffect(() => save(MERCH_STOCK_KEY, merchStock), [merchStock]);
  useEffect(() => save(TICKETS_KEY, ticketPurchases), [ticketPurchases]);

  useEffect(() => { user ? saveSession(USER_KEY, user) : sessionStorage.removeItem(USER_KEY); }, [user]);
  useEffect(() => saveSession(SESSION_DUKUNGAN_KEY, sessionDukungan), [sessionDukungan]);
  useEffect(() => saveSession(SESSION_LIKES_KEY, sessionLikes), [sessionLikes]);
  useEffect(() => saveSession(SESSION_TICKETS_KEY, sessionTickets), [sessionTickets]);

  const topUp = useCallback((coins: number) => {
    setBalance((b) => b + coins);
  }, []);

  const spend = useCallback((amount: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= amount) { ok = true; return b - amount; }
      return b;
    });
    return ok;
  }, []);

  const dukungan = useCallback((horseId: string, amount: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= amount) { ok = true; return b - amount; }
      return b;
    });
    if (ok) {
      const record: DukunganRecord = { horseId, amount, time: new Date().toISOString(), userName: user?.name };
      setDukunganFeed((f) => [record, ...f].slice(0, 50));
      setSupportedHorses((h) => (h.includes(horseId) ? h : [...h, horseId]));
      if (horseId.startsWith('rescue-')) {
        const rescueId = horseId.replace('rescue-', '');
        setRescueDonations((d) => ({ ...d, [rescueId]: (d[rescueId] || 0) + amount }));
      }
      setSessionDukungan((s) => s + amount);
    }
    return ok;
  }, [user]);

  const subscribe = useCallback((horseId: string, tierId: string, price: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= price) { ok = true; return b - price; }
      return b;
    });
    if (ok) {
      setSubscriptions((subs) => {
        const filtered = subs.filter((s) => !(s.horseId === horseId));
        return [...filtered, { horseId, tierId, subscribedAt: new Date().toISOString() }];
      });
      setSupportedHorses((h) => (h.includes(horseId) ? h : [...h, horseId]));
      setSessionDukungan((s) => s + price);
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
      if (existing) return c.map((i) => (i.merchId === merchId ? { ...i, qty: i.qty + qty } : i));
      return [...c, { merchId, qty }];
    });
  }, []);

  const removeFromCart = useCallback((merchId: string) => {
    setCart((c) => c.filter((i) => i.merchId !== merchId));
  }, []);

  const updateCartQty = useCallback((merchId: string, qty: number) => {
    if (qty <= 0) { setCart((c) => c.filter((i) => i.merchId !== merchId)); }
    else { setCart((c) => c.map((i) => (i.merchId === merchId ? { ...i, qty } : i))); }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const buyMerch = useCallback((items: CartItem[], useJacoins: boolean, totalJacoins: number): boolean => {
    if (useJacoins) {
      let ok = false;
      setBalance((b) => {
        if (b >= totalJacoins) { ok = true; return b - totalJacoins; }
        return b;
      });
      if (!ok) return false;
    }
    setMerchStock((s) => {
      const next = { ...s };
      for (const item of items) {
        next[item.merchId] = (next[item.merchId] ?? 0) - item.qty;
      }
      return next;
    });
    setSessionDukungan((sd) => sd + (useJacoins ? totalJacoins : 0));
    return true;
  }, []);

  const buyTicket = useCallback((ticketId: string, price: number): boolean => {
    let ok = false;
    setBalance((b) => {
      if (b >= price) { ok = true; return b - price; }
      return b;
    });
    if (ok) {
      setTicketPurchases((t) => [...t, ticketId]);
      setSessionTickets((t) => [...t, ticketId]);
      setSessionDukungan((sd) => sd + price);
    }
    return ok;
  }, []);

  const login = useCallback((name: string) => {
    setUser({ name, loggedInAt: new Date().toISOString() });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSessionDukungan(0);
    setSessionLikes([]);
    setSessionTickets([]);
  }, []);

  const toggleLike = useCallback((postId: string) => {
    setSessionLikes((prev) => prev.includes(postId) ? prev.filter((p) => p !== postId) : [...prev, postId]);
  }, []);

  const isLiked = useCallback((postId: string) => sessionLikes.includes(postId), [sessionLikes]);

  const value: AppContextValue = {
    balance, subscriptions, supportedHorses, dukunganFeed, cart,
    rescueDonations, merchStock, ticketPurchases,
    topUp, spend, dukungan, subscribe, isSubscribed, getHighestTier,
    addToCart, removeFromCart, updateCartQty, clearCart, buyMerch, buyTicket,
    user, login, logout,
    sessionDukungan, sessionLikes, toggleLike, isLiked, sessionTickets,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
