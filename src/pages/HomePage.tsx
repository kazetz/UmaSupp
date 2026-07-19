import { useState, useMemo } from 'react';
import { AlertTriangle, Heart, Clock, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { HORSES, RESCUE_HORSES } from '../data/seed';
import type { Page, RescueHorse } from '../data/types';
import { useApp } from '../store/appStore';
import HorseCard from '../components/HorseCard';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import DukunganBurst from '../components/DukunganBurst';
import CoinBadge from '../components/CoinBadge';

interface Props {
  navigate: (page: Page, horseId?: string) => void;
}

const URGENCY_STYLES = {
  critical: { ring: 'ring-clay-400', bg: 'bg-clay-500', label: 'KRITIS', text: 'text-clay-600' },
  high: { ring: 'ring-gold-400', bg: 'bg-gold-500', label: 'TINGGI', text: 'text-gold-600' },
  moderate: { ring: 'ring-turf-400', bg: 'bg-turf-500', label: 'SEDANG', text: 'text-turf-600' },
};

export default function HomePage({ navigate }: Props) {
  const { balance, dukungan, user, rescueDonations, dukunganFeed } = useApp();
  const [rescueTarget, setRescueTarget] = useState<RescueHorse | null>(null);
  const [donateAmt, setDonateAmt] = useState(1000);
  const [showBurst, setShowBurst] = useState(false);
  const [error, setError] = useState('');

  const handleDonate = () => {
    if (balance < donateAmt) {
      setError('Jacoins kamu tidak cukup. Yuk top-up dulu di Toko Jacoins!');
      return;
    }
    if (dukungan(`rescue-${rescueTarget?.id}`, donateAmt)) {
      setShowBurst(true);
      setError('');
    }
  };

  // Compute current raised amounts (seed + user donations)
  const rescueRaised = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of RESCUE_HORSES) {
      map[r.id] = r.raised + (rescueDonations[r.id] || 0);
    }
    return map;
  }, [rescueDonations]);

  // Dynamic ticker: seed items + real user donations
  const tickerItems = useMemo(() => {
    const base = [
      'Raja Kudus memberi dukungan Bing Chiling 500 Jacoins',
      'Jokonotoboto berlangganan Tier Wortel Ryo si Bogor Glazer',
      'lempuyangan enjoyer memberi dukungan Golden Experience 1000 Jacoins',
      'BingChilingFan_01 berlangganan Tier Apel Emas Bing Chiling',
      'SakuraFan memberi dukungan Sakura Bakushin O 250 Jacoins',
      'LegacyKeeper memberi dukungan Golden Experience 2000 Jacoins',
    ];
    const userItems = dukunganFeed
      .filter((d) => d.userName)
      .slice(0, 10)
      .map((d) => {
        const horseName = d.horseId.startsWith('rescue-')
          ? RESCUE_HORSES.find((r) => r.id === d.horseId.replace('rescue-', ''))?.name ?? 'Kuda Rescue'
          : HORSES.find((h) => h.id === d.horseId)?.name ?? 'Kuda';
        return `${d.userName} memberi dukungan ${horseName} ${d.amount} Jacoins`;
      });
    return [...userItems, ...base];
  }, [dukunganFeed]);

  return (
    <div className="space-y-12 pb-8">
      {/* Dukungan ticker */}
      <div className="overflow-hidden bg-turf-900 py-2">
        <div className="flex w-max animate-ticker-scroll gap-8 px-4">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-turf-100">
              <Sparkles size={14} className="text-gold-400" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Urgent Rescue Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-clay-500" size={22} />
          <h2 className="font-display text-2xl font-extrabold text-clay-700">Kuda Terlantar</h2>
          <span className="rounded-full bg-clay-100 px-3 py-0.5 text-xs font-bold text-clay-600">RESCUE FUND</span>
        </div>

        <div className="grid gap-5 md:grid-cols-3 stagger">
          {RESCUE_HORSES.map((r) => {
            const s = URGENCY_STYLES[r.urgency];
            const raised = rescueRaised[r.id] || r.raised;
            return (
              <div
                key={r.id}
                className={`lift relative overflow-hidden rounded-3xl bg-white shadow-card ring-2 ${s.ring}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-turf-950/40" />
                  <div className={`absolute right-3 top-3 rounded-full ${s.bg} px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md`}>
                    {s.label}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-display text-2xl font-extrabold text-white">{r.name}</h3>
                    <p className="text-xs font-semibold text-turf-100">{r.need}</p>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <p className="text-sm leading-relaxed text-sand-600 line-clamp-2">{r.story}</p>
                  <ProgressBar value={raised} max={r.goal} color="clay" label="Terkumpul" />
                  <div className="flex items-center justify-between text-xs text-sand-500">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {r.daysLeft} hari lagi
                    </span>
                    <span className="font-bold text-clay-600">{Math.round((raised / r.goal) * 100)}%</span>
                  </div>
                  <button
                    onClick={() => { setRescueTarget(r); setDonateAmt(1000); setError(''); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay-500 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-clay-600"
                  >
                    <Heart size={16} />
                    Donasi Jacoins
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Idols */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="text-gold-500" size={22} />
              <h2 className="font-display text-2xl font-extrabold text-turf-800">Top Idols</h2>
            </div>
            <p className="mt-1 text-sm text-sand-500">Kuda balap populer yang aktif atau baru pensiun</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {HORSES.map((h) => (
            <HorseCard key={h.id} horse={h} onClick={() => navigate('profile', h.id)} />
          ))}
        </div>
      </section>

      {/* Sustainable innovation callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-turf-700 p-8 text-white md:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} /> Inovasi Berkelanjutan
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              Setiap dukungan kuda balap, <span className="text-gold-300">menyelamatkan kuda terlantar.</span>
            </h2>
            <p className="mt-3 text-turf-100">
              Model bisnis UmaSupp mengalihkan traffic dari fandom kuda balap Pordasi untuk mensubsidi
              program penyelamatan kuda terlantar. Dua kategori bisnis sekaligus: sosial &amp; retail UMKM.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white/15 px-5 py-3">
                <p className="font-display text-2xl font-extrabold text-gold-300">2</p>
                <p className="text-xs text-turf-100">Kategori bisnis</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3">
                <p className="font-display text-2xl font-extrabold text-gold-300">3</p>
                <p className="text-xs text-turf-100">Kuda rescue bulan ini</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3">
                <p className="font-display text-2xl font-extrabold text-gold-300">100%</p>
                <p className="text-xs text-turf-100">Dana rescue murni</p>
              </div>
            </div>
            <button
              onClick={() => navigate('community')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-turf-700 transition hover:bg-gold-100"
            >
              Gabung Komunitas Uma Community
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 right-20 h-64 w-64 rounded-full bg-gold-400/20" />
        </div>
      </section>

      {/* Donate modal */}
      <Modal open={!!rescueTarget} onClose={() => setRescueTarget(null)} title={`Donasi untuk ${rescueTarget?.name ?? ''}`}>
        {rescueTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={rescueTarget.image} alt={rescueTarget.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <h4 className="font-display text-lg font-bold text-sand-900">{rescueTarget.name}</h4>
                <p className="text-sm text-sand-500">{rescueTarget.need}</p>
                <p className="text-xs text-clay-600">Sisa {rescueTarget.daysLeft} hari</p>
              </div>
            </div>

            <div className="rounded-2xl bg-turf-50 p-4">
              <p className="text-xs font-semibold text-sand-600">Saldo Jacoins kamu</p>
              <CoinBadge amount={balance} size="lg" className="mt-1" />
            </div>

            {!user && (
              <div className="rounded-xl bg-gold-50 px-4 py-2.5 text-sm font-semibold text-gold-700">
                Login dulu agar nama kamu muncul di ticker donasi.
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold text-sand-700">Pilih nominal donasi</p>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setDonateAmt(amt); setError(''); }}
                    className={`rounded-xl py-2.5 text-sm font-bold transition ${
                      donateAmt === amt ? 'bg-clay-500 text-white shadow-sm' : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                    }`}
                  >
                    {amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setRescueTarget(null)} className="flex-1 rounded-xl bg-sand-100 py-3 text-sm font-bold text-sand-700 hover:bg-sand-200">Batal</button>
              <button onClick={handleDonate} className="flex-1 rounded-xl bg-clay-500 py-3 text-sm font-bold text-white shadow-sm hover:bg-clay-600">
                Donasi {donateAmt.toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <DukunganBurst show={showBurst} amount={donateAmt} onDone={() => { setShowBurst(false); setRescueTarget(null); }} />
    </div>
  );
}
