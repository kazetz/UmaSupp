import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Store, Tag, ShieldCheck, Check, Package } from 'lucide-react';
import { MERCH } from '../data/seed';
import { useApp } from '../store/appStore';
import CoinBadge from '../components/CoinBadge';
import Modal from '../components/Modal';

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'apparel', label: 'Pakaian' },
  { id: 'accessory', label: 'Aksesori' },
  { id: 'photocard', label: 'Photocard' },
  { id: 'nfc', label: 'NFC Tech' },
];

export default function MarketplacePage() {
  const { cart, addToCart, removeFromCart, updateCartQty, clearCart, balance, spend } = useApp();
  const [cat, setCat] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pay' | 'done'>('cart');
  const [payMethod, setPayMethod] = useState<'jacoins' | 'rupiah'>('jacoins');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const filtered = cat === 'all' ? MERCH : MERCH.filter((m) => m.category === cat);

  const cartItems = cart
    .map((c) => {
      const item = MERCH.find((m) => m.id === c.merchId);
      return item ? { ...item, qty: c.qty } : null;
    })
    .filter(Boolean) as (typeof MERCH[number] & { qty: number })[];

  const totalJacoins = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalRupiah = cartItems.reduce((s, i) => s + i.priceRupiah * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const openCart = () => {
    setCheckoutStep('cart');
    setCartOpen(true);
    setError('');
  };

  const handleCheckout = () => {
    setProcessing(true);
    setError('');
    setTimeout(() => {
      if (payMethod === 'jacoins') {
        if (balance < totalJacoins) {
          setError('Jacoins tidak cukup. Top-up dulu atau bayar dengan Rupiah.');
          setProcessing(false);
          return;
        }
        spend(totalJacoins);
      }
      setProcessing(false);
      setCheckoutStep('done');
      clearCart();
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-clay-100 px-4 py-1.5 text-sm font-bold text-clay-700">
          <Store size={16} /> Creative Marketplace UMKM
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-turf-800 md:text-5xl">Toko Merchandise</h1>
        <p className="mx-auto mt-3 max-w-xl text-sand-500">
          Souvenir fisik buatan seniman & UMKM lokal. Bayar pakai Jacoins atau Rupiah via Kasir Pintar.
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              cat === c.id ? 'bg-turf-600 text-white shadow-card' : 'bg-white text-sand-600 ring-1 ring-sand-200 hover:bg-sand-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {filtered.map((m) => (
          <div key={m.id} className="lift group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-sand-100">
            <div className="relative h-52 overflow-hidden">
              <img src={m.image} alt={m.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-turf-950/30 to-transparent" />
              {m.badge && (
                <span className="absolute left-3 top-3 rounded-full gold-gradient px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow">
                  {m.badge}
                </span>
              )}
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-sand-600">
                Stok: {m.stock}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-base font-bold leading-snug text-sand-900">{m.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-clay-600">
                <Tag size={11} /> {m.artisan}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-sand-500 line-clamp-2">{m.description}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <CoinBadge amount={m.price} size="sm" />
                  <p className="mt-1 text-xs font-semibold text-sand-500">atau Rp{m.priceRupiah.toLocaleString('id-ID')}</p>
                </div>
                <button
                  onClick={() => addToCart(m.id)}
                  className="flex items-center gap-1 rounded-xl bg-turf-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-turf-700"
                >
                  <Plus size={16} /> Keranjang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UMKM info */}
      <div className="mt-10 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-clay-600" />
          <h2 className="font-display text-xl font-extrabold text-sand-900">Mitra UMKM Kami</h2>
        </div>
        <p className="mt-2 text-sm text-sand-500">
          Setiap pembelian mendukung seniman dan pengrajin lokal Indonesia. Platform ini menjalankan dua kategori bisnis: sosial (rescue) & retail (UMKM).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Konveksi Karya Tangan', 'Kriya Digital Nusantara', 'Studio Lensa Kreatif', 'Illustra Studio'].map((u) => (
            <span key={u} className="rounded-full bg-turf-50 px-3 py-1.5 text-xs font-semibold text-turf-700 ring-1 ring-turf-200">{u}</span>
          ))}
        </div>
      </div>

      {/* Floating cart button (mobile) */}
      {cartCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-clay-500 px-5 py-3 font-bold text-white shadow-pop transition hover:bg-clay-600"
        >
          <ShoppingCart size={20} />
          {cartCount}
        </button>
      )}

      {/* Cart / Checkout modal */}
      <Modal open={cartOpen} onClose={() => setCartOpen(false)} title={checkoutStep === 'done' ? '' : 'Keranjang Belanja'} size="lg">
        {/* Cart view */}
        {checkoutStep === 'cart' && (
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingCart size={48} className="mx-auto text-sand-300" />
                <p className="mt-3 text-sand-500">Keranjang masih kosong.</p>
              </div>
            ) : (
              <>
                {cartItems.map((i) => (
                  <div key={i.id} className="flex gap-3 rounded-2xl bg-sand-50 p-3">
                    <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col">
                      <h4 className="font-display text-sm font-bold text-sand-900">{i.name}</h4>
                      <p className="text-xs text-sand-500">{i.artisan}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQty(i.id, i.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sand-600 ring-1 ring-sand-200">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{i.qty}</span>
                          <button onClick={() => updateCartQty(i.id, i.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sand-600 ring-1 ring-sand-200">
                            <Plus size={14} />
                          </button>
                        </div>
                        <CoinBadge amount={i.price * i.qty} size="sm" />
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(i.id)} className="self-start text-sand-400 hover:text-clay-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="rounded-2xl bg-turf-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-sand-600">Total ({cartCount} item)</span>
                    <div className="text-right">
                      <CoinBadge amount={totalJacoins} size="md" />
                      <p className="mt-1 text-xs font-semibold text-sand-500">atau Rp{totalRupiah.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setCheckoutStep('pay')} className="w-full rounded-xl bg-turf-600 py-3.5 font-bold text-white shadow-card">
                  Lanjut ke Pembayaran
                </button>
              </>
            )}
          </div>
        )}

        {/* Payment view */}
        {checkoutStep === 'pay' && (
          <div className="space-y-5">
            <h3 className="font-display text-lg font-extrabold text-sand-900">Pilih Metode Pembayaran</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPayMethod('jacoins')}
                className={`flex items-center gap-3 rounded-2xl p-4 text-left ring-2 transition ${
                  payMethod === 'jacoins' ? 'bg-gold-50 ring-gold-400' : 'bg-sand-50 ring-sand-200'
                }`}
              >
                <span className="text-2xl">🪙</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-sand-900">Bayar Jacoins</p>
                  <CoinBadge amount={totalJacoins} size="sm" />
                </div>
                {payMethod === 'jacoins' && <Check size={20} className="text-gold-600" />}
              </button>

              <button
                onClick={() => setPayMethod('rupiah')}
                className={`flex items-center gap-3 rounded-2xl p-4 text-left ring-2 transition ${
                  payMethod === 'rupiah' ? 'bg-turf-50 ring-turf-400' : 'bg-sand-50 ring-sand-200'
                }`}
              >
                <span className="text-2xl">💳</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-sand-900">Bayar Rupiah</p>
                  <p className="text-sm font-semibold text-sand-600">Rp{totalRupiah.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-sand-400">via Kasir Pintar (QRIS/VA)</p>
                </div>
                {payMethod === 'rupiah' && <Check size={20} className="text-turf-600" />}
              </button>
            </div>

            {payMethod === 'jacoins' && (
              <div className="rounded-2xl bg-turf-50 p-3 text-sm">
                <p className="text-xs font-semibold text-sand-600">Saldo Jacoins: {balance.toLocaleString('id-ID')}</p>
                <p className={`font-display text-lg font-bold ${balance < totalJacoins ? 'text-clay-600' : 'text-sand-900'}`}>
                  Sisa: {(balance - totalJacoins).toLocaleString('id-ID')} 🪙
                </p>
              </div>
            )}

            {error && <div className="rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>}

            <div className="flex gap-2">
              <button onClick={() => setCheckoutStep('cart')} className="flex-1 rounded-xl bg-sand-100 py-3.5 font-bold text-sand-700 hover:bg-sand-200">
                Kembali
              </button>
              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`flex-1 rounded-xl py-3.5 font-bold text-white shadow-sm disabled:opacity-60 ${payMethod === 'jacoins' ? 'gold-gradient' : 'bg-turf-600'}`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  `Bayar ${payMethod === 'jacoins' ? `${totalJacoins} 🪙` : `Rp${totalRupiah.toLocaleString('id-ID')}`}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Done view */}
        {checkoutStep === 'done' && (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-turf-100">
              <Check size={40} className="text-turf-600" />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-turf-700">Pesanan Berhasil!</h3>
            <p className="text-sand-500">Pesananmu akan diproses oleh mitra UMKM dan dikirim segera.</p>
            <div className="mx-auto max-w-xs rounded-2xl bg-sand-50 p-4 text-left">
              <p className="flex items-center gap-2 text-sm text-sand-600">
                <Package size={16} className="text-clay-500" /> {cartCount} item dipesan
              </p>
              <p className="flex items-center gap-2 text-sm text-sand-600">
                <ShieldCheck size={16} className="text-turf-600" /> Dibayar via {payMethod === 'jacoins' ? 'Jacoins' : 'Kasir Pintar'}
              </p>
            </div>
            <button onClick={() => setCartOpen(false)} className="w-full rounded-xl bg-turf-600 py-3.5 font-bold text-white">
              Selesai
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
