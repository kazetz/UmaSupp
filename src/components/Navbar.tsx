import { Coins, Home, Store, Users, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/appStore';
import type { Page } from '../data/types';
import CoinBadge from './CoinBadge';

interface Props {
  page: Page;
  navigate: (page: Page, horseId?: string) => void;
}

const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'store', label: 'Toko Jacoins', icon: Store },
  { id: 'community', label: 'Uma Community', icon: Users },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
];

export default function Navbar({ page, navigate }: Props) {
  const { balance, cart } = useApp();
  const [open, setOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const go = (p: Page) => {
    navigate(p);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-turf-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient shadow-gold">
              <span className="text-xl">🐴</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-extrabold text-turf-700">
                Uma<span className="gold-text">Supp</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-turf-500">Uma Community</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id || (n.id === 'home' && page === 'profile') || (n.id === 'community' && page === 'community');
              return (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-turf-600 text-white shadow-card'
                      : 'text-turf-800 hover:bg-turf-100'
                  }`}
                >
                  <Icon size={16} />
                  {n.label}
                </button>
              );
            })}
          </nav>

          {/* Right: balance + cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => go('store')}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-gold-200 transition hover:ring-gold-400"
            >
              <Coins size={18} className="text-gold-600" />
              <span className="font-display text-sm font-bold text-sand-900">{balance.toLocaleString('id-ID')}</span>
            </button>

            <button
              onClick={() => go('marketplace')}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-turf-200 transition hover:ring-turf-400"
              aria-label="Keranjang"
            >
              <ShoppingBag size={18} className="text-turf-700" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-turf-200"
              aria-label="Menu"
            >
              {open ? <X size={18} className="text-turf-700" /> : <Menu size={18} className="text-turf-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-turf-200 bg-white/95 px-4 py-3 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  active ? 'bg-turf-600 text-white' : 'text-turf-800 hover:bg-turf-100'
                }`}
              >
                <Icon size={18} />
                {n.label}
              </button>
            );
          })}
          <div className="pt-2">
            <CoinBadge amount={balance} size="lg" className="w-full justify-center" />
          </div>
        </nav>
      )}
    </header>
  );
}
