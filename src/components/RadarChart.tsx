import type { HorseStats } from '../data/types';

interface Props {
  stats: HorseStats;
  size?: number;
  accent?: string;
}

const LABELS: { key: keyof HorseStats; label: string }[] = [
  { key: 'speed', label: 'Kecepatan' },
  { key: 'stamina', label: 'Stamina' },
  { key: 'acceleration', label: 'Akselerasi' },
  { key: 'power', label: 'Tenaga' },
];

export default function RadarChart({ stats, size = 240, accent = '#f59e0b' }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const n = LABELS.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, value: number) => {
    const r = (value / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const dataPoints = LABELS.map((l, i) => point(i, stats[l.key]));
  const polygon = dataPoints.map(([x, y]) => `${x},${y}`).join(' ');

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* rings */}
      {rings.map((r, ri) => (
        <polygon
          key={ri}
          points={LABELS.map((_, i) => {
            const rr = r * radius;
            return `${cx + rr * Math.cos(angle(i))},${cy + rr * Math.sin(angle(i))}`;
          }).join(' ')}
          fill="none"
          stroke="#86efac"
          strokeWidth="1"
          className="radar-grid"
          opacity={0.5}
        />
      ))}

      {/* axes */}
      {LABELS.map((_, i) => {
        const [x, y] = [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#86efac" strokeWidth="1" opacity="0.4" />;
      })}

      {/* data polygon */}
      <polygon points={polygon} fill="url(#radarFill)" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />

      {/* data points */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={accent} stroke="white" strokeWidth="1.5" />
      ))}

      {/* labels */}
      {LABELS.map((l, i) => {
        const lx = cx + (radius + 18) * Math.cos(angle(i));
        const ly = cy + (radius + 18) * Math.sin(angle(i));
        return (
          <g key={l.key}>
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display"
              fontSize="13"
              fontWeight="700"
              fill="#15803d"
            >
              {l.label}
            </text>
            <text
              x={lx}
              y={ly + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="700"
              fill={accent}
            >
              {stats[l.key]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
