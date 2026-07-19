import { useState } from 'react';
import { MapPin, Clock, Ticket, Calendar, Users, Check, Navigation, Star } from 'lucide-react';
import { TICKET_PACKAGES, STABLE_LOCATIONS, COMMUNITY_EVENTS } from '../data/seed';
import { useApp } from '../store/appStore';
import CoinBadge from '../components/CoinBadge';
import Modal from '../components/Modal';

const TYPE_STYLES = {
  active: { bg: 'bg-turf-100', text: 'text-turf-700', label: 'Kandang Aktif' },
  retired: { bg: 'bg-gold-100', text: 'text-gold-700', label: 'Kandang Pensiun' },
  rescue: { bg: 'bg-clay-100', text: 'text-clay-700', label: 'Pusat Rescue' },
};

export default function WisataPage() {
  const { balance, buyTicket, user, sessionTickets } = useApp();
  const [ticketModal, setTicketModal] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showBurst, setShowBurst] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

  const pkg = TICKET_PACKAGES.find((t) => t.id === ticketModal);

  const handleBuyTicket = (id: string, price: number) => {
    if (balance < price) {
      setError('Jacoins tidak cukup. Top-up dulu di Toko Jacoins!');
      return;
    }
    if (buyTicket(id, price)) {
      setError('');
      setTicketModal(null);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-turf-100 px-4 py-1.5 text-sm font-bold text-turf-700">
          <MapPin size={16} /> Pariwisata & Komunitas
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-turf-800 md:text-5xl">Wisata Kuda & Agrowisata</h1>
        <p className="mx-auto mt-3 max-w-xl text-sand-500">
          Tukar Jacoins untuk tiket agrowisata, jelajahi peta peternakan kuda, dan hadiri acara komunitas luring.
        </p>
      </div>

      {/* Section 1: Agrotourism Tickets */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Ticket size={22} className="text-gold-500" />
          <h2 className="font-display text-2xl font-extrabold text-sand-900">Pemesanan Tiket Agrowisata</h2>
        </div>
        <p className="mb-5 text-sm text-sand-500">
          Kunjungan wisata edukasi & interaksi langsung dengan kuda di peternakan lokal. Bayar pakai Jacoins.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 stagger">
          {TICKET_PACKAGES.map((t) => {
            const purchased = sessionTickets.includes(t.id);
            return (
              <div key={t.id} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-sand-100">
                <div className="relative h-40 overflow-hidden">
                  <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-turf-950/30" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-display text-xl font-extrabold text-white">{t.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-turf-100">
                      <MapPin size={12} /> {t.stable} · {t.region}
                    </p>
                  </div>
                  {purchased && (
                    <div className="absolute right-3 top-3 rounded-full bg-turf-600 px-3 py-1 text-[10px] font-bold text-white">
                      Tiket Aktif
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs text-sand-500">
                    <span className="flex items-center gap-1"><Clock size={13} /> {t.duration}</span>
                    <span className="flex items-center gap-1"><Users size={13} /> {t.available} slot tersisa</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {t.includes.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-sm text-sand-600">
                        <Check size={14} className="mt-0.5 shrink-0 text-turf-600" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <CoinBadge amount={t.price} size="md" />
                    <button
                      onClick={() => { setTicketModal(t.id); setError(''); }}
                      disabled={purchased}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                        purchased ? 'bg-turf-100 text-turf-700' : 'bg-turf-600 text-white hover:bg-turf-700'
                      }`}
                    >
                      {purchased ? '✓ Dimiliki' : 'Beli Tiket'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Stable Map */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Navigation size={22} className="text-turf-600" />
          <h2 className="font-display text-2xl font-extrabold text-sand-900">Peta Wisata Kandang</h2>
        </div>
        <p className="mb-5 text-sm text-sand-500">
          Rencanakan rute liburan ke kandang kuda pensiun & aktif. Klik lokasi untuk detail.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Visual map */}
          <div className="relative overflow-hidden rounded-3xl bg-turf-100 p-6 shadow-card ring-1 ring-turf-200">
            <div className="relative aspect-square w-full">
              {/* Simple grid map */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
                {/* Grid lines */}
                {[0, 100, 200, 300, 400].map((p) => (
                  <g key={p}>
                    <line x1={p} y1="0" x2={p} y2="400" stroke="#bbf7d0" strokeWidth="1" />
                    <line x1="0" y1={p} x2="400" y2={p} stroke="#bbf7d0" strokeWidth="1" />
                  </g>
                ))}
                {/* Indonesia-ish landmass blobs */}
                <ellipse cx="120" cy="150" rx="60" ry="40" fill="#86efac" opacity="0.5" />
                <ellipse cx="200" cy="180" rx="50" ry="35" fill="#86efac" opacity="0.5" />
                <ellipse cx="280" cy="220" rx="55" ry="38" fill="#86efac" opacity="0.5" />
                <ellipse cx="180" cy="280" rx="45" ry="30" fill="#86efac" opacity="0.5" />
                <ellipse cx="320" cy="120" rx="40" ry="28" fill="#86efac" opacity="0.5" />
              </svg>

              {/* Location pins */}
              {STABLE_LOCATIONS.map((loc) => {
                const x = ((loc.lng - 95) / 20) * 100;
                const y = ((-loc.lat + 8) / 14) * 100;
                const style = TYPE_STYLES[loc.type];
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc.id)}
                    className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${style.bg} ring-2 ring-white shadow-md transition hover:scale-125 ${selectedLoc === loc.id ? 'scale-125 ring-turf-600' : ''}`}
                    style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                    title={loc.name}
                  >
                    <MapPin size={14} className={style.text} />
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {Object.entries(TYPE_STYLES).map(([key, val]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-full ${val.bg}`} />
                  <span className="font-semibold text-sand-600">{val.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Location list */}
          <div className="space-y-3">
            {STABLE_LOCATIONS.map((loc) => {
              const style = TYPE_STYLES[loc.type];
              return (
                <div
                  key={loc.id}
                  className={`rounded-2xl bg-white p-4 shadow-card ring-1 transition ${selectedLoc === loc.id ? 'ring-2 ring-turf-500' : 'ring-sand-100'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                      <MapPin size={18} className={style.text} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-base font-bold text-sand-900">{loc.name}</h3>
                      <p className="text-xs text-sand-500">{loc.region}</p>
                      <p className="mt-1 text-sm text-sand-600">{loc.description}</p>
                      <span className={`mt-2 inline-block rounded-full ${style.bg} ${style.text} px-2.5 py-0.5 text-[10px] font-bold`}>
                        {style.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Community Events */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={22} className="text-clay-500" />
          <h2 className="font-display text-2xl font-extrabold text-sand-900">Acara Komunitas Luring</h2>
        </div>
        <p className="mb-5 text-sm text-sand-500">
          Jadwal kumpul penggemar di arena balap resmi Pordasi & Sarga. Hadir untuk menaikkan kunjungan wisatawan!
        </p>

        <div className="grid gap-5 sm:grid-cols-2 stagger">
          {COMMUNITY_EVENTS.map((ev) => (
            <div key={ev.id} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-sand-100">
              <div className="relative h-36 overflow-hidden">
                <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-turf-950/40" />
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full bg-clay-500 px-3 py-1 text-xs font-bold text-white">{ev.date}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-sand-900">{ev.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-sand-500">
                  <MapPin size={12} /> {ev.location} · {ev.region}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">{ev.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-sand-500">
                    <Users size={13} /> {ev.attendees} pendaftar
                  </span>
                  <button className="rounded-xl bg-turf-600 px-4 py-2 text-xs font-bold text-white hover:bg-turf-700">
                    Daftar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-2xl bg-turf-50 p-4 ring-1 ring-turf-200">
          <Star size={18} className="mt-0.5 shrink-0 text-turf-600" />
          <p className="text-sm text-turf-800">
            <strong>Tujuan wisata:</strong> Acara luring ini dirancang untuk menaikkan kunjungan wisatawan
            ke arena balap resmi Pordasi dan Sarga, sekaligus mempererat komunitas penggemar kuda.
          </p>
        </div>
      </section>

      {/* Ticket purchase modal */}
      <Modal open={!!ticketModal} onClose={() => setTicketModal(null)} title="Beli Tiket Agrowisata">
        {pkg && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={pkg.image} alt={pkg.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <h4 className="font-display text-lg font-bold text-sand-900">{pkg.name}</h4>
                <p className="text-sm text-sand-500">{pkg.stable} · {pkg.region}</p>
                <p className="text-xs text-sand-400">{pkg.duration} · {pkg.available} slot tersisa</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              {pkg.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-sm text-sand-600">
                  <Check size={14} className="mt-0.5 text-turf-600" /> {inc}
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-turf-50 p-3">
              <p className="text-xs font-semibold text-sand-600">Harga Tiket</p>
              <CoinBadge amount={pkg.price} size="lg" className="mt-1" />
              <p className="mt-2 text-xs font-semibold text-sand-600">Saldo: {balance.toLocaleString('id-ID')} Jacoins</p>
              <p className="font-display text-lg font-bold text-sand-900">Sisa: {(balance - pkg.price).toLocaleString('id-ID')} 🪙</p>
            </div>

            {!user && (
              <div className="rounded-xl bg-gold-50 px-4 py-2.5 text-sm font-semibold text-gold-700">
                Login dulu agar tiket masuk ke akunmu.
              </div>
            )}

            {error && <div className="rounded-xl bg-clay-50 px-4 py-2.5 text-sm font-semibold text-clay-700">{error}</div>}

            <div className="flex gap-2">
              <button onClick={() => setTicketModal(null)} className="flex-1 rounded-xl bg-sand-100 py-3 text-sm font-bold text-sand-700 hover:bg-sand-200">Batal</button>
              <button onClick={() => handleBuyTicket(pkg.id, pkg.price)} className="flex-1 rounded-xl bg-turf-600 py-3 text-sm font-bold text-white hover:bg-turf-700">
                Beli {pkg.price} Jacoins
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success burst */}
      {showBurst && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-turf-950/40" />
          <div className="relative animate-pop-in text-center">
            <div className="inline-flex flex-col items-center gap-3 rounded-3xl bg-white px-10 py-8 shadow-pop">
              <div className="text-6xl animate-gallop">🎫</div>
              <p className="font-display text-2xl font-extrabold text-turf-700">Tiket Berhasil!</p>
              <p className="text-sand-600">Tiket agrowisatamu sudah aktif.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
