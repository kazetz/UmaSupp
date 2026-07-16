import type { Page } from '../data/types';

interface Props {
  navigate: (page: Page) => void;
}

export default function Footer({ navigate }: Props) {
  return (
    <footer className="mt-20 turf-pattern text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient">
                <span className="text-xl">🐴</span>
              </div>
              <span className="font-display text-2xl font-extrabold">
                Uma<span className="text-gold-300">Supp</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-turf-100">
              Platform fandom kuda balap pertama di Indonesia. Sponsor idolamu, nikmati konten
              eksklusif, dan bantu menyelamatkan kuda terlantar lewat kekuatan komunitas.
            </p>
            <p className="mt-3 text-xs text-turf-200">
              Inovasi berkelanjutan: traffic dari kuda balap Pordasi mensubsidi kuda terlantar.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold-300">Jelajahi</h4>
            <ul className="mt-3 space-y-2 text-sm text-turf-100">
              <li><button onClick={() => navigate('home')} className="hover:text-white">Beranda</button></li>
              <li><button onClick={() => navigate('store')} className="hover:text-white">Toko Jacoins</button></li>
              <li><button onClick={() => navigate('community')} className="hover:text-white">Uma Community</button></li>
              <li><button onClick={() => navigate('marketplace')} className="hover:text-white">Marketplace UMKM</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-gold-300">Mitra Pembayaran</h4>
            <div className="mt-3 rounded-xl bg-white/10 p-3">
              <p className="font-display text-sm font-bold text-white">Kasir Pintar</p>
              <p className="text-xs text-turf-100">QRIS & Virtual Account</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['QRIS', 'VA BCA', 'VA Mandiri', 'GoPay', 'OVO', 'DANA'].map((m) => (
                  <span key={m} className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-turf-200">
          <p>UmaSupp &copy; 2025 · Semua nama dan beberapa istilah yang digunakan hanyalah fiksi.</p>
          <p className="mt-1">Jacoins (Jaran Coin) adalah mata uang digital platform. Bukan token kripto.</p>
        </div>
      </div>
    </footer>
  );
}
