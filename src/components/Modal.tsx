import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export default function Modal({ open, onClose, children, title, size = 'md' }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-turf-950/50 backdrop-blur-sm animate-pop-in" onClick={onClose} />
      <div className={`relative w-full ${SIZES[size]} animate-pop-in rounded-3xl bg-white shadow-pop max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand-100 bg-white/95 px-6 py-4 backdrop-blur">
            <h3 className="font-display text-lg font-extrabold text-sand-900">{title}</h3>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-sand-600 hover:bg-sand-200">
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sand-600 hover:bg-white">
            <X size={18} />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
