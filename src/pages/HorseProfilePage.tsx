import { useState } from 'react';
import {
  ArrowLeft, MapPin, Trophy, Users, Heart, Lock, Play, FileText, Image as ImageIcon,
  Check, Crown, Sparkles, Star, Zap,
} from 'lucide-react';
import { getHorse } from '../data/seed';
import type { Page } from '../data/types';
import { useApp } from '../store/appStore';
import RadarChart from '../components/RadarChart';
import CoinBadge from '../components/CoinBadge';
import Modal from '../components/Modal';
import DukunganBurst from '../components/DukunganBurst';

interface Props {
  horseId: string;
  navigate: (page: Page, horseId?: string) => void;
}

const TIER_STYLES = {
  rumput: { ring: 'ring-turf-300', bg: 'bg-turf-100', text: 'text-turf-700', btn: 'bg-turf-600 hover:bg-turf-700', icon: Sparkles },
  wortel: { ring: 'ring-clay-300', bg: 'bg-clay-50', text: 'text-clay-700', btn: 'bg-clay-500 hover:bg-clay-600', icon: Zap },
  apel: { ring: 'ring-gold-400', bg: 'bg-gold-50', text: 'text-gold-700', btn: 'bg-gold-500 hover:bg-gold-600', icon: Crown },
};

const TIER_ORDER = ['rumput', 'wortel', 'apel'];

export default function HorseProfilePage({ horseId, navigate }: Props) {
  const horse = getHorse(horseId);
  const { balance, dukungan, subscribe, isSubscribed, getHighestTier } = useApp();
  const [dukunganAmt, setDukunganAmt] = useState(50);
  const [showDukunganModal, setShowDukunganModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [error, setError] = useState('');
  const [activeFeed, setActiveFeed] = useState(0);

  if (!horse) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-sand-500">Kuda tidak ditemukan.</p>
        <button onClick={() => navigate('home')} className="mt-4 rounded-xl bg-turf-600 px-5 py-2 text-white">Kembali</button>
      </div>
    );
  }

  const highestTier = getHighestTier(horse.id);
  const tierIndex = highestTier ? TIER_ORDER.indexOf(highestTier) : -1;

  const canAccess = (feedTier: string) => {
    const fi = TIER_ORDER.indexOf(feedTier);
    return tierIndex >= fi;
  };

  const handleDukungan = () => {
    if (balance < dukunganAmt) {
      setError('Jacoins tidak cukup. Top-up dulu di Toko Jacoins!');
      return;
    }
    if (dukungan(horse.id, dukunganAmt)) {
      setShowDukunganModal(false);
      setShowBurst(true);
      setError('');
    }
  };

  const handleSubscribe = (tierId: string, price: number) => {
    if (price > 0 && balance < price) {
      setError('Jacoins tidak cukup untuk berlangganan. Top-up dulu!');
      return;
    }
    if (subscribe(horse.id, tierId, price)) {
      setShowSubModal(null);
      setShowBurst(true);
      setError('');
    }
  };

  const accentColor = horse.accent === 'gold' ? '#f59e0b' : horse.accent === 'silver' ? '#78716c' : '#ea580c';

  return (
    <div className="pb-8">
      {/* Cover */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <img src={horse.coverImage} alt={horse.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-turf-950/30" />
        <button
          onClick={() => navigate('home')}
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-turf-800 backdrop-blur transition hover:bg-white"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      {/* Profile header */}
      <div className="mx-auto -mt-24 max-w-6xl px-4 sm:px-6">
        <div className="relative rounded-3xl bg-white p-6 shadow-pop md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* horse portrait popping out */}
            <div className="relative -mt-32 shrink-0 self-start md:-mt-40">
              <div className="relative h-44 w-44 overflow-hidden rounded-full ring-4 ring-white shadow-lg md:h-52 md:w-52">
                <img src={horse.image} alt={horse.name} className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-turf-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                {horse.status === 'active' ? 'Aktif' : 'Pensiun'}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="font-display text-3xl font-extrabold text-sand-900 md:text-4xl">{horse.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-sand-500">
                <MapPin size={14} /> {horse.stable} · {horse.region}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5">
                <Trophy size={15} className="text-gold-600" />
                <span className="text-sm font-bold text-gold-800">{horse.badge}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-sand-600">{horse.bio}</p>

              <div className="mt-4 flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5 text-sm text-sand-600">
                  <Users size={15} className="text-turf-600" />
                  <strong className="font-display text-lg text-sand-900">{horse.supporters.toLocaleString('id-ID')}</strong> pendukung
                </span>
                <CoinBadge amount={horse.totalDukungan} size="lg" />
                {highestTier && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-turf-600 px-3 py-1.5 text-sm font-bold text-white">
                    <Crown size={14} /> Tier {highestTier === 'apel' ? 'Apel Emas' : highestTier === 'wortel' ? 'Wortel' : 'Rumput'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick record stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Kemenangan', value: horse.record.wins },
              { label: 'Podium', value: horse.record.places },
              { label: 'Start', value: horse.record.starts },
              { label: 'Waktu Terbaik', value: horse.record.bestTime },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-turf-50 p-3 text-center">
                <p className="font-display text-2xl font-extrabold text-turf-700">{s.value}</p>
                <p className="text-xs font-semibold text-sand-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid: stats + dukungan */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar stats */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-extrabold text-sand-900">
              <Zap size={18} className="text-gold-500" /> Statistik Lengkap
            </h2>
            <p className="mb-4 text-sm text-sand-500">Grafik radar performa asli kuda</p>
            <div className="flex items-center justify-center">
              <RadarChart stats={horse.stats} accent={accentColor} size={260} />
            </div>
          </div>

          {/* Dukungan panel */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-extrabold text-sand-900">
              <Heart size={18} className="text-clay-500" /> Dukungan Jacoins
            </h2>
            <p className="mb-4 text-sm text-sand-500">Beri dukungan sekali klik. Nama kamu muncul di ticker publik!</p>

            <div className="rounded-2xl bg-clay-50 p-4">
              <p className="text-xs font-semibold text-sand-600">Saldo kamu</p>
              <CoinBadge amount={balance} size="lg" className="mt-1" />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-sand-700">Pilih nominal dukungan</p>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 250, 500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setDukunganAmt(amt); setError(''); }}
                    className={`rounded-xl py-2.5 text-sm font-bold transition ${
                      dukunganAmt === amt ? 'bg-clay-500 text-white shadow-sm' : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mt-3 rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>}

            <button
              onClick={() => { setShowDukunganModal(true); setError(''); }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-clay-500 py-3.5 font-bold text-white shadow-sm transition hover:bg-clay-600"
            >
              <Heart size={18} /> Dukung {dukunganAmt.toLocaleString('id-ID')} Jacoins
            </button>
          </div>
        </div>
      </div>

      {/* Membership tiers */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-extrabold text-sand-900">
          <Lock size={20} className="text-turf-600" /> Membership Tier
        </h2>
        <p className="mb-5 text-sm text-sand-500">Buka konten eksklusif dengan berlangganan</p>

        <div className="grid gap-4 md:grid-cols-3">
          {horse.tiers.map((tier) => {
            const s = TIER_STYLES[tier.color];
            const Icon = s.icon;
            const subscribed = isSubscribed(horse.id, tier.id);
            const isHighest = highestTier === tier.id;
            const isLocked = tier.price > 0 && !subscribed;

            return (
              <div key={tier.id} className={`relative overflow-hidden rounded-3xl bg-white p-5 shadow-card ring-2 ${s.ring} ${isHighest ? 'ring-4' : ''}`}>
                {tier.badge && (
                  <div className={`absolute right-0 top-0 rounded-bl-2xl px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white ${s.btn}`}>
                    {tier.badge}
                  </div>
                )}
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${s.bg}`}>
                  <Icon size={20} className={s.text} />
                </div>
                <h3 className="font-display text-xl font-extrabold text-sand-900">Tier {tier.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  {tier.price === 0 ? (
                    <span className="font-display text-2xl font-extrabold text-turf-600">Gratis</span>
                  ) : (
                    <>
                      <CoinBadge amount={tier.price} size="md" />
                      <span className="text-sm text-sand-500">/bulan</span>
                    </>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-sand-600">
                      <Check size={15} className={`mt-0.5 shrink-0 ${s.text}`} />
                      {perk}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (subscribed) return;
                    setShowSubModal(tier.id);
                    setError('');
                  }}
                  disabled={subscribed}
                  className={`mt-5 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                    subscribed ? 'bg-turf-100 text-turf-700' : `${s.btn} text-white shadow-sm`
                  }`}
                >
                  {subscribed ? '✓ Berlangganan' : isLocked ? `Berlangganan ${tier.price}` : 'Aktif'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exclusive feed */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-extrabold text-sand-900">
          <Play size={20} className="text-clay-500" /> Konten Eksklusif
        </h2>
        <p className="mb-5 text-sm text-sand-500">Feed video & foto. Buka dengan berlangganan tier lebih tinggi.</p>

        {/* feed tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {horse.feed.map((f, i) => {
            const locked = !canAccess(f.tier);
            const tierName = f.tier === 'rumput' ? 'Rumput' : f.tier === 'wortel' ? 'Wortel' : 'Apel Emas';
            return (
              <button
                key={f.id}
                onClick={() => setActiveFeed(i)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  activeFeed === i ? 'bg-turf-600 text-white' : 'bg-white text-sand-600 ring-1 ring-sand-200'
                }`}
              >
                {locked && <Lock size={11} />}
                {tierName}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {horse.feed.map((f, i) => {
            const locked = !canAccess(f.tier);
            const Icon = f.type === 'video' ? Play : f.type === 'report' ? FileText : ImageIcon;
            const tierStyle = TIER_STYLES[f.tier as keyof typeof TIER_STYLES];
            return (
              <div
                key={f.id}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-sand-100 transition ${i === activeFeed ? 'ring-2 ring-turf-400' : ''}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={f.thumbnail}
                    alt={f.title}
                    className={`h-full w-full object-cover transition group-hover:scale-105 ${locked ? 'locked-blur' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-turf-950/50" />
                  <div className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${tierStyle.bg} ${tierStyle.text}`}>
                    <Icon size={11} /> {f.type === 'video' ? 'Video' : f.type === 'report' ? 'Laporan' : 'Foto'}
                  </div>
                  {locked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-turf-950/30">
                      <Lock size={28} className="text-white" />
                      <span className="rounded-full bg-white/90 px-3 py-0.5 text-xs font-bold text-turf-700">Tier {f.tier}</span>
                    </div>
                  )}
                  {!locked && f.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
                        <Play size={20} className="ml-0.5 text-clay-500" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold leading-snug text-sand-900 line-clamp-2">{f.title}</h3>
                  <p className="mt-1 text-xs text-sand-500 line-clamp-2">{f.description}</p>
                  <p className="mt-2 text-[11px] font-semibold text-turf-500">{f.date}</p>
                </div>
              </div>
            );
          })}
        </div>

        {tierIndex < 2 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-gold-500" />
              <p className="text-sm font-semibold text-gold-800">Buka lebih banyak konten dengan upgrade tier!</p>
            </div>
            <button
              onClick={() => setShowSubModal(tierIndex < 1 ? 'wortel' : 'apel')}
              className="rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gold-600"
            >
              Upgrade Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Dukungan confirm modal */}
      <Modal open={showDukunganModal} onClose={() => setShowDukunganModal(false)} title={`Dukung ${horse.name}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={horse.image} alt={horse.name} className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p className="text-sm text-sand-500">Kamu akan memberi dukungan</p>
              <CoinBadge amount={dukunganAmt} size="lg" />
            </div>
          </div>
          <div className="rounded-2xl bg-turf-50 p-3">
            <p className="text-xs font-semibold text-sand-600">Saldo setelah dukungan</p>
            <p className="font-display text-xl font-bold text-sand-900">{(balance - dukunganAmt).toLocaleString('id-ID')} Jacoins</p>
          </div>
          {error && <div className="rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>}
          <div className="flex gap-2">
            <button onClick={() => setShowDukunganModal(false)} className="flex-1 rounded-xl bg-sand-100 py-3 text-sm font-bold text-sand-700 hover:bg-sand-200">Batal</button>
            <button onClick={handleDukungan} className="flex-1 rounded-xl bg-clay-500 py-3 text-sm font-bold text-white hover:bg-clay-600">Dukung Sekarang</button>
          </div>
        </div>
      </Modal>

      {/* Subscribe confirm modal */}
      <Modal open={!!showSubModal} onClose={() => setShowSubModal(null)} title="Konfirmasi Langganan">
        {showSubModal && (() => {
          const tier = horse.tiers.find((t) => t.id === showSubModal);
          if (!tier) return null;
          const s = TIER_STYLES[tier.color];
          return (
            <div className="space-y-4">
              <div className={`rounded-2xl ${s.bg} p-4`}>
                <h4 className={`font-display text-lg font-extrabold ${s.text}`}>Tier {tier.name}</h4>
                {tier.price > 0 ? (
                  <p className="text-sm text-sand-600"><CoinBadge amount={tier.price} size="sm" /> /bulan</p>
                ) : <p className="text-sm text-sand-600">Gratis</p>}
              </div>
              <ul className="space-y-2">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-sand-600">
                    <Check size={15} className={`mt-0.5 ${s.text}`} /> {p}
                  </li>
                ))}
              </ul>
              {tier.price > 0 && (
                <div className="rounded-2xl bg-turf-50 p-3">
                  <p className="text-xs font-semibold text-sand-600">Saldo setelah berlangganan</p>
                  <p className="font-display text-xl font-bold text-sand-900">{(balance - tier.price).toLocaleString('id-ID')} Jacoins</p>
                </div>
              )}
              {error && <div className="rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>}
              <div className="flex gap-2">
                <button onClick={() => setShowSubModal(null)} className="flex-1 rounded-xl bg-sand-100 py-3 text-sm font-bold text-sand-700 hover:bg-sand-200">Batal</button>
                <button onClick={() => handleSubscribe(tier.id, tier.price)} className={`flex-1 rounded-xl py-3 text-sm font-bold text-white ${s.btn}`}>
                  {tier.price === 0 ? 'Aktifkan Gratis' : `Langganan ${tier.price}`}
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <DukunganBurst show={showBurst} amount={dukunganAmt} onDone={() => setShowBurst(false)} />
    </div>
  );
}
