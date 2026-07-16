import { useState } from 'react';
import { MessageCircle, Heart, Image as ImageIcon, Crown, TrendingUp, Palette, ScrollText, Sparkles } from 'lucide-react';
import { FANARTS, FORUM_THREADS, SULTANS, getHorse } from '../data/seed';
import type { Page } from '../data/types';
import CoinBadge from '../components/CoinBadge';

interface Props {
  navigate: (page: Page, horseId?: string) => void;
}

const TAG_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  fanart: { bg: 'bg-clay-100', text: 'text-clay-700', label: 'Fanart' },
  lore: { bg: 'bg-turf-100', text: 'text-turf-700', label: 'Lore' },
  bloodline: { bg: 'bg-gold-100', text: 'text-gold-700', label: 'Bloodline' },
  stats: { bg: 'bg-sand-200', text: 'text-sand-700', label: 'Statistik' },
  moefikasi: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Moefikasi' },
};

const RANK_STYLES = [
  { ring: 'ring-gold-400', badge: 'gold-gradient', crown: true },
  { ring: 'ring-sand-300', badge: 'bg-sand-400', crown: false },
  { ring: 'ring-clay-400', badge: 'bg-clay-600', crown: false },
];

export default function CommunityPage({ navigate }: Props) {
  const [tab, setTab] = useState<'fanart' | 'forum' | 'leaderboard'>('fanart');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-turf-100 px-4 py-1.5 text-sm font-bold text-turf-700">
          <MessageCircle size={16} /> Komunitas Fandom
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-turf-800 md:text-5xl">Uma Community</h1>
        <p className="mx-auto mt-3 max-w-xl text-sand-500">
          Ruang komunitas murni konten pengguna. Bagikan fanart, bahas lore & statistik, dan lihat papan Sultan bulan ini.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex justify-center gap-2">
        {[
          { id: 'fanart' as const, label: 'Galeri Fanart', icon: Palette },
          { id: 'forum' as const, label: 'Diskusi', icon: ScrollText },
          { id: 'leaderboard' as const, label: 'Leaderboard Sultan', icon: Crown },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t.id ? 'bg-turf-600 text-white shadow-card' : 'bg-white text-sand-600 ring-1 ring-sand-200 hover:bg-sand-50'
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Fanart Gallery */}
      {tab === 'fanart' && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-sand-500">
            <ImageIcon size={15} /> Karya dari komunitas — fanart, moefikasi, & bloodline chart
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {FANARTS.map((fa) => {
              const horse = getHorse(fa.horseId);
              const tag = TAG_STYLES[fa.tag];
              const isLiked = liked.has(fa.id);
              return (
                <div key={fa.id} className="break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-sand-100">
                  <div className="relative">
                    <img src={fa.image} alt={fa.title} className="w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-turf-950/60 to-transparent" />
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tag.bg} ${tag.text}`}>
                      {tag.label}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold leading-snug text-sand-900">{fa.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <img src={fa.avatar} alt={fa.author} className="h-7 w-7 rounded-full bg-sand-100" />
                      <div>
                        <p className="text-xs font-semibold text-sand-700">{fa.author}</p>
                        <p className="text-[10px] text-sand-400">{fa.timeAgo}</p>
                      </div>
                    </div>
                    {horse && (
                      <button
                        onClick={() => navigate('profile', horse.id)}
                        className="mt-2 text-xs font-semibold text-turf-600 hover:underline"
                      >
                        Kuda: {horse.name} →
                      </button>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-sand-500">
                      <button
                        onClick={() => toggleLike(fa.id)}
                        className={`flex items-center gap-1 font-semibold transition ${isLiked ? 'text-clay-500' : 'hover:text-clay-500'}`}
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        {(fa.likes + (isLiked ? 1 : 0)).toLocaleString('id-ID')}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {fa.comments}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Forum / Discussion */}
      {tab === 'forum' && (
        <div className="mt-8 space-y-4">
          {FORUM_THREADS.map((t) => {
            const horse = getHorse(t.horseId);
            const tag = TAG_STYLES[t.tag];
            return (
              <div key={t.id} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-sand-100 transition hover:ring-turf-200">
                <div className="flex gap-4">
                  <img src={t.avatar} alt={t.author} className="h-12 w-12 shrink-0 rounded-full bg-sand-100" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tag.bg} ${tag.text}`}>{tag.label}</span>
                      <span className="text-xs font-semibold text-sand-700">{t.author}</span>
                      <span className="text-xs text-sand-400">· {t.timeAgo}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug text-sand-900">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-sand-600 line-clamp-2">{t.body}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-sand-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} /> {t.replies} balasan
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} /> {t.likes}
                      </span>
                      {horse && (
                        <button onClick={() => navigate('profile', horse.id)} className="ml-auto font-semibold text-turf-600 hover:underline">
                          {horse.name} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Sultan */}
      {tab === 'leaderboard' && (
        <div className="mt-8">
          {/* Podium top 3 */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[1, 0, 2].map((idx) => {
              const s = SULTANS[idx];
              if (!s) return null;
              const style = RANK_STYLES[s.rank - 1];
              const heightClass = s.rank === 1 ? 'sm:order-2 sm:-mt-6' : s.rank === 2 ? 'sm:order-1' : 'sm:order-3';
              return (
                <div key={s.id} className={`relative rounded-3xl bg-white p-6 text-center shadow-card ring-2 ${style.ring} ${heightClass}`}>
                  {style.crown && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full gold-gradient shadow-gold">
                        <Crown size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold text-white ${style.badge}`}>
                    #{s.rank}
                  </div>
                  <img src={s.avatar} alt={s.name} className="mx-auto mt-3 h-14 w-14 rounded-full ring-2 ring-white shadow" />
                  <h3 className="mt-2 font-display text-lg font-bold text-sand-900">{s.name}</h3>
                  <p className="text-xs text-sand-500">{s.title}</p>
                  <div className="mt-3 flex justify-center">
                    <CoinBadge amount={s.spent} size="md" />
                  </div>
                  <p className="mt-1 text-xs text-sand-400">Jacoins bulan ini</p>
                </div>
              );
            })}
          </div>

          {/* Full table */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-sand-100">
            <div className="flex items-center gap-2 border-b border-sand-100 px-5 py-4">
              <TrendingUp size={18} className="text-turf-600" />
              <h3 className="font-display text-lg font-bold text-sand-900">Papan Peringkat Sultan Bulan Ini</h3>
            </div>
            <div className="divide-y divide-sand-100">
              {SULTANS.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3 transition hover:bg-turf-50">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    s.rank <= 3 ? 'gold-gradient text-white' : 'bg-sand-100 text-sand-600'
                  }`}>
                    {s.rank}
                  </span>
                  <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full bg-sand-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-sand-900">{s.name}</p>
                    <p className="text-xs text-sand-500">{s.title}</p>
                  </div>
                  <CoinBadge amount={s.spent} size="md" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-gold-500" />
            <p className="text-sm text-gold-800">
              <strong>Kompetisi status sosial:</strong> Sultan dengan pengeluaran Jacoins terbanyak mendapat
              pengakuan publik. Strategi yang efektif untuk mendorong partisipasi aktif Gen-Z.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
