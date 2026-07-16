interface Props {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

export default function CoinBadge({ amount, size = 'md', className = '' }: Props) {
  return (
    <span className={`coin-chip inline-flex items-center rounded-full font-bold text-gold-800 ${SIZES[size]} ${className}`}>
      <span className={size === 'sm' ? 'text-sm' : 'text-base'}>🪙</span>
      {amount.toLocaleString('id-ID')}
    </span>
  );
}
