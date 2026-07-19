interface Props {
  value: number;
  max: number;
  label?: string;
  color?: 'gold' | 'turf' | 'clay';
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const COLORS = {
  gold: 'bg-gold-500',
  turf: 'bg-turf-600',
  clay: 'bg-clay-500',
};

export default function ProgressBar({
  value,
  max,
  label,
  color = 'gold',
  height = 'md',
  animated = true,
}: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const h = height === 'sm' ? 'h-2' : height === 'lg' ? 'h-5' : 'h-3.5';

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          <span className="font-semibold text-sand-700">{label}</span>
          <span className="font-display font-bold text-sand-900">
            {value.toLocaleString('id-ID')} <span className="text-sand-500 font-sans text-xs">/ {max.toLocaleString('id-ID')}</span>
          </span>
        </div>
      )}
      <div className={`relative ${h} w-full rounded-full bg-sand-200 overflow-hidden`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${COLORS[color]} ${animated ? 'animate-grow-bar' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
