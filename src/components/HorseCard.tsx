import { MapPin, Trophy, Users } from 'lucide-react';
import type { Horse } from '../data/types';
import { useApp } from '../store/appStore';
import CoinBadge from './CoinBadge';

interface Props {
  horse: Horse;
  onClick: () => void;
  rank?: number;
}

const ACCENT_RING: Record<string, string> = {
  gold: 'ring-gold-400',
  silver: 'ring-sand-300',
  clay: 'ring-clay-400',
};

const ACCENT_BAR: Record<string, string> = {
  gold: 'gold-gradient',
  silver: 'bg-gradient-to-r from-sand-300 to-sand-500',
  clay: 'bg-gradient-to-r from-clay-400 to-clay-600',
};

export default function HorseCard({ horse, onClick, rank }: Props) {
  const { getHighestTier } = useApp();
  const tier = getHighestTier(horse.id);
  const tierLabel = tier === 'apel' ? 'Apel Emas' : tier === 'wortel' ? 'Wortel' : null;

  return (
    <button
      onClick={onClick}
      className={`lift group relative flex flex-col overflow-hidden rounded-3xl bg-white text-left shadow-card ring-2 ${ACCENT_RING[horse.accent]} focus:outline-none focus:ring-4`}
    >
      {/* rank badge */}
      {rank && (
        <div className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full font-display text-lg font-extrabold text-white shadow-md gold-gradient">
          {rank}
        </div>
      )}

      {/* tier badge */}
      {tierLabel && (
        <div className="absolute right-3 top-3 z-20 rounded-full bg-turf-700/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
          {tierLabel}
        </div>
      )}

      {/* image with overlap effect */}
      <div className="relative h-56 overflow-hidden">
        <div className={`absolute inset-0 ${ACCENT_BAR[horse.accent]} opacity-90`} />
        <div className="absolute inset-0 turf-pattern opacity-30" />
        {/* horse popping out */}
        <img
          src={horse.image}
          alt={horse.name}
          loading="lazy"
          className="absolute -bottom-2 left-1/2 h-64 w-64 -translate-x-1/2 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
          style={{ clipPath: 'ellipse(45% 55% at 50% 45%)' }}
        />
        {/* status badge */}
        <div className="absolute bottom-2 left-3 z-10">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              horse.status === 'active' ? 'bg-white text-turf-700' : 'bg-sand-800 text-gold-300'
            }`}
          >
            {horse.status === 'active' ? 'Aktif' : 'Pensiun'}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-display text-xl font-extrabold leading-tight text-sand-900">{horse.name}</h3>
          <p className="flex items-center gap-1 text-xs text-sand-500">
            <MapPin size={12} />
            {horse.stable} · {horse.region}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-gold-50 px-2.5 py-1.5">
          <Trophy size={14} className="shrink-0 text-gold-600" />
          <span className="text-xs font-semibold text-gold-800 line-clamp-1">{horse.badge}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-sand-500">
            <Users size={13} />
            {horse.supporters.toLocaleString('id-ID')} pendukung
          </span>
          <CoinBadge amount={horse.totalDukungan} size="sm" />
        </div>
      </div>
    </button>
  );
}
