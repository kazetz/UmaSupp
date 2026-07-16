import { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Wallet, Star, Zap } from 'lucide-react';
import { COIN_PACKAGES } from '../data/seed';
import { useApp } from '../store/appStore';
import CoinBadge from '../components/CoinBadge';
import Modal from '../components/Modal';

const PAYMENT_METHODS = [
  { id: 'qris', name: 'QRIS', desc: 'Scan & bayar instan', icon: '📱' },
  { id: 'va-bca', name: 'VA BCA', desc: 'Virtual Account', icon: '🏦' },
  { id: 'va-mandiri', name: 'VA Mandiri', desc: 'Virtual Account', icon: '🏦' },
  { id: 'gopay', name: 'GoPay', desc: 'Dompet digital', icon: '💚' },
  { id: 'ovo', name: 'OVO', desc: 'Dompet digital', icon: '🟣' },
  { id: 'dana', name: 'DANA', desc: 'Dompet digital', icon: '🔵' },
];

export default function StorePage() {
  const { balance, topUp } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState('qris');
  const [step, setStep] = useState<'select' | 'pay' | 'done'>('select');
  const [processing, setProcessing] = useState(false);

  const pkg = COIN_PACKAGES.find((p) => p.id === selected);
  const totalCoins = pkg ? pkg.coins + pkg.bonus : 0;

  const startCheckout = (id: string) => {
    setSelected(id);
    setStep('select');
  };

  const proceedToPay = () => setStep('pay');

  const confirmPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      if (pkg) topUp(pkg.coins + pkg.bonus);
      setProcessing(false);
      setStep('done');
    }, 1800);
  };

  const closeModal = () => {
    setSelected(null);
    setStep('select');
    setProcessing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-bold text-gold-700">
          <Wallet size={16} /> Toko Jacoins
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-turf-800 md:text-5xl">
          Top-up <span className="shimmer-text">Jacoins</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sand-500">
          Jacoins (Jaran Coin) adalah mata uang digital platform. Gunakan untuk beri dukungan, berlangganan, dan belanja merchandise.
        </p>
        <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 shadow-card">
          <span className="text-sm font-semibold text-sand-500">Saldo kamu:</span>
          <CoinBadge amount={balance} size="lg" />
        </div>
      </div>

      {/* Packages */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COIN_PACKAGES.map((p) => {
          const total = p.coins + p.bonus;
          return (
            <button
              key={p.id}
              onClick={() => startCheckout(p.id)}
              className={`lift relative flex flex-col items-center overflow-hidden rounded-3xl bg-white p-6 text-center shadow-card ring-2 transition ${
                p.popular ? 'ring-gold-400' : p.bestValue ? 'ring-turf-400' : 'ring-sand-100 hover:ring-turf-300'
              }`}
            >
              {p.popular && (
                <div className="absolute right-0 top-0 rounded-bl-2xl gold-gradient px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Populer
                </div>
              )}
              {p.bestValue && (
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-turf-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Best Value
                </div>
              )}

              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                p.popular ? 'gold-gradient' : p.bestValue ? 'bg-turf-600' : 'bg-turf-100'
              }`}>
                <span className="text-3xl animate-coin-spin">🪙</span>
              </div>

              <p className="mt-4 font-display text-3xl font-extrabold text-sand-900">{p.coins.toLocaleString('id-ID')}</p>
              <p className="text-sm font-semibold text-sand-500">Jacoins</p>

              {p.bonus > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700">
                  <Sparkles size={12} /> +{p.bonus} Bonus
                </div>
              )}

              <div className="mt-4 w-full rounded-2xl bg-turf-50 py-3">
                <p className="text-xs text-sand-500">Harga</p>
                <p className="font-display text-xl font-extrabold text-turf-700">
                  Rp{p.priceRupiah.toLocaleString('id-ID')}
                </p>
              </div>

              <p className="mt-3 text-xs text-sand-400">
                {total.toLocaleString('id-ID')} Jacoins total
              </p>
            </button>
          );
        })}
      </div>

      {/* Why Jacoins info */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: 'Dukungan Instan', desc: 'Beri dukungan ke kuda favorit sekali klik' },
          { icon: Star, title: 'Buka Konten', desc: 'Berlangganan tier untuk video eksklusif' },
          { icon: ShieldCheck, title: 'Aman & Terpadu', desc: 'Pembayaran via Kasir Pintar (QRIS/VA)' },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-turf-100">
                <Icon size={20} className="text-turf-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-sand-900">{f.title}</h3>
              <p className="mt-1 text-sm text-sand-500">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-turf-50 p-4 text-center">
        <ShieldCheck size={18} className="text-turf-600" />
        <p className="text-sm font-semibold text-turf-700">
          Semua transaksi diproses melalui <strong>PT Kasir Pintar Internasional</strong> — QRIS &amp; Virtual Account resmi.
        </p>
      </div>

      {/* Checkout modal */}
      <Modal open={!!selected} onClose={closeModal} title="Checkout Jacoins">
        {pkg && (
          <div className="space-y-5">
            {/* Step: select */}
            {step === 'select' && (
              <>
                <div className="flex items-center gap-4 rounded-2xl gold-gradient p-4 text-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <span className="text-3xl">🪙</span>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-extrabold">{totalCoins.toLocaleString('id-ID')} Jacoins</p>
                    <p className="text-sm text-gold-100">
                      {pkg.coins.toLocaleString('id-ID')} + {pkg.bonus} bonus
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gold-100">Total</p>
                    <p className="font-display text-xl font-extrabold">Rp{pkg.priceRupiah.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-sand-700">Metode Pembayaran</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={`flex items-center gap-2 rounded-xl p-3 text-left transition ${
                          payMethod === m.id ? 'bg-turf-600 text-white ring-2 ring-turf-600' : 'bg-sand-50 text-sand-700 ring-1 ring-sand-200 hover:bg-sand-100'
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="text-sm font-bold">{m.name}</p>
                          <p className={`text-xs ${payMethod === m.id ? 'text-turf-100' : 'text-sand-400'}`}>{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={proceedToPay} className="w-full rounded-xl gold-gradient py-3.5 font-bold text-white shadow-gold">
                  Lanjut Bayar
                </button>
              </>
            )}

            {/* Step: pay */}
            {step === 'pay' && (
              <div className="space-y-4 text-center">
                <p className="text-sm font-semibold text-sand-600">Scan QR Code di bawah untuk membayar</p>
                <div className="mx-auto flex max-w-xs flex-col items-center rounded-2xl border-2 border-dashed border-turf-300 bg-turf-50 p-6">
                  <div className="flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
                    {/* Fake QR */}
                    <div className="grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className={`h-4 w-4 ${(i * 7 + (i % 3)) % 2 === 0 ? 'bg-sand-900' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold text-sand-900">Rp{pkg.priceRupiah.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-sand-500">via {PAYMENT_METHODS.find((m) => m.id === payMethod)?.name}</p>
                  <p className="mt-1 text-xs text-turf-600">Kasir Pintar · {pkg.coins + pkg.bonus} Jacoins</p>
                </div>
                <p className="text-xs text-sand-400">Simulasi: klik tombol di bawah untuk konfirmasi pembayaran</p>
                <button
                  onClick={confirmPayment}
                  disabled={processing}
                  className="w-full rounded-xl bg-turf-600 py-3.5 font-bold text-white shadow-card disabled:opacity-60"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Memproses...
                    </span>
                  ) : (
                    'Saya Sudah Bayar'
                  )}
                </button>
                <button onClick={() => setStep('select')} className="text-sm font-semibold text-sand-500 hover:text-sand-700">
                  Ganti metode
                </button>
              </div>
            )}

            {/* Step: done */}
            {step === 'done' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-turf-100">
                  <Check size={40} className="text-turf-600" />
                </div>
                <h3 className="font-display text-2xl font-extrabold text-turf-700">Pembayaran Berhasil!</h3>
                <p className="text-sand-500">Jacoins sudah masuk ke dompetmu.</p>
                <div className="rounded-2xl gold-gradient p-4 text-white">
                  <p className="text-sm text-gold-100">Saldo sekarang</p>
                  <p className="font-display text-3xl font-extrabold">
                    {(balance).toLocaleString('id-ID')} 🪙
                  </p>
                </div>
                <button onClick={closeModal} className="w-full rounded-xl bg-turf-600 py-3.5 font-bold text-white">
                  Selesai
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
