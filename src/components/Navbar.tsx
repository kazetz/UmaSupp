import { Coins, Home, Store, Users, ShoppingBag, Menu, X, UserCircle, LogOut, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../store/appStore';
import type { Page } from '../data/types';
import CoinBadge from './CoinBadge';
import Modal from './Modal';

interface Props {
  page: Page;
  navigate: (page: Page, horseId?: string) => void;
}

const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'store', label: 'Toko Jacoins', icon: Store },
  { id: 'community', label: 'Uma Community', icon: Users },
  { id: 'wisata', label: 'Wisata', icon: MapPin },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
];

export default function Navbar({ page, navigate }: Props) {
  const { balance, cart, user, login, logout, sessionDukungan } = useApp();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const go = (p: Page) => {
    navigate(p);
    setOpen(false);
  };

  const handleLogin = () => {
    if (nameInput.trim()) {
      login(nameInput.trim());
      setLoginOpen(false);
      setNameInput('');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-turf-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <button onClick={() => go('home')} className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm">
              <img src="/LOGO_PNG.png" alt="UmaSupp Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-extrabold text-turf-700">
                Uma<span className="gold-text">Supp</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-turf-500">Uma Community</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = page === n.id || (n.id === 'home' && page === 'profile');
              return (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    active ? 'bg-turf-600 text-white shadow-card' : 'text-turf-800 hover:bg-turf-100'
                  }`}
                >
                  <Icon size={16} />
                  {n.label}
                </button>
              );
            })}
          </nav>

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

            {/* Login button — next to cart */}
            {user ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-turf-600 px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-turf-700"
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline max-w-24 truncate">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-turf-200 transition hover:ring-turf-400"
                aria-label="Login"
              >
                <UserCircle size={18} className="text-turf-700" />
              </button>
            )}

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

      {/* Login / Profile modal */}
      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} title={user ? 'Profil Saya' : 'Login Sementara'}>
        {user ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-turf-100">
              <UserCircle size={36} className="text-turf-600" />
            </div>
            <div>
              <p className="text-sm text-sand-500">Login sebagai</p>
              <h3 className="font-display text-xl font-extrabold text-sand-900">{user.name}</h3>
            </div>
            <div className="rounded-2xl bg-turf-50 p-3 text-left text-sm">
              <p className="font-semibold text-sand-700">Dukungan sesi ini: {sessionDukungan.toLocaleString('id-ID')} Jacoins</p>
              <p className="text-xs text-sand-500">Data sesi akan hilang saat tab ditutup.</p>
            </div>
            <button
              onClick={() => { logout(); setLoginOpen(false); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay-500 py-3 font-bold text-white hover:bg-clay-600"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-turf-100">
                <UserCircle size={36} className="text-turf-600" />
              </div>
              <p className="text-sm text-sand-500">Masukkan nama kamu untuk mulai berinteraksi</p>
            </div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Nama kamu"
              className="w-full rounded-xl border-2 border-turf-200 px-4 py-3 text-sand-900 outline-none focus:border-turf-500"
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={!nameInput.trim()}
              className="w-full rounded-xl bg-turf-600 py-3 font-bold text-white shadow-sm hover:bg-turf-700 disabled:opacity-50"
            >
              Masuk
            </button>
            <p className="text-center text-xs text-sand-400">Login tanpa password. Data hilang saat tab ditutup.</p>
          </div>
        )}
      </Modal>
    </header>
  );
}
