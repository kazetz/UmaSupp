interface Props {
  value: number;
  max: number;
  label?: string;
  color?: 'gold' | 'turf' | 'clay';
  showShine?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const COLORS = {
  gold: 'gold-gradient',
  turf: 'bg-gradient-to-r from-turf-500 to-turf-700',
  clay: 'bg-gradient-to-r from-clay-400 to-clay-600',
};

export default function ProgressBar({
  value,
  max,
  label,
  color = 'gold',
  showShine = true,
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
          className={`absolute inset-y-0 left-0 rounded-full ${COLORS[color]} ${showShine ? 'bar-shine' : ''} ${animated ? 'animate-grow-bar' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
