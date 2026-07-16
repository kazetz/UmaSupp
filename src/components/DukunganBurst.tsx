import { useEffect, useState } from 'react';

interface Props {
  show: boolean;
  amount: number;
  onDone: () => void;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  emoji: string;
  drift: number;
}

const EMOJIS = ['🥕', '🍎', '🪙', '🌟', '🥕', '🍎'];

export default function DukunganBurst({ show, amount, onDone }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const p: Particle[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.3,
        emoji: EMOJIS[i % EMOJIS.length],
        drift: (Math.random() - 0.5) * 60,
      }));
      setParticles(p);
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="dukungan-burst flex items-center justify-center">
      <div className="absolute inset-0 bg-turf-950/40 animate-pop-in" />

      {/* floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-3xl animate-float-up"
          style={{
            left: `${p.x}%`,
            bottom: '30%',
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* center pop */}
      <div className="relative animate-pop-in text-center">
        <div className="inline-flex flex-col items-center gap-3 rounded-3xl bg-white px-10 py-8 shadow-pop">
          <div className="text-6xl animate-gallop">🐴</div>
          <p className="font-display text-2xl font-extrabold text-turf-700">Terima Kasih!</p>
          <p className="text-sand-600">Kamu memberi dukungan</p>
          <div className="coin-chip inline-flex items-center gap-2 rounded-full px-5 py-2 text-lg font-bold text-gold-800">
            🪙 {amount.toLocaleString('id-ID')} Jacoins
          </div>
          <p className="text-sm text-turf-600 font-semibold">Nama kamu muncul di ticker publik!</p>
        </div>
      </div>
    </div>
  );
}
