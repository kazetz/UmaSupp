import { useState, useEffect } from 'react';
import { AppProvider } from './store/appStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HorseProfilePage from './pages/HorseProfilePage';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import MarketplacePage from './pages/MarketplacePage';
import type { Page } from './data/types';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [horseId, setHorseId] = useState<string | null>(null);

  const navigate = (p: Page, hId?: string) => {
    if (hId) setHorseId(hId);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // update document title per page
  useEffect(() => {
    const titles: Record<Page, string> = {
      home: 'UmaSupp — Beranda',
      profile: 'UmaSupp — Profil Kuda',
      store: 'UmaSupp — Toko Jacoins',
      community: 'UmaSupp — Uma Community',
      marketplace: 'UmaSupp — Marketplace',
    };
    document.title = titles[page];
  }, [page]);

  return (
    <div className="flex min-h-screen flex-col bg-turf-50">
      <Navbar page={page} navigate={navigate} />

      <main className="flex-1">
        {page === 'home' && <HomePage navigate={navigate} />}
        {page === 'profile' && horseId && <HorseProfilePage horseId={horseId} navigate={navigate} />}
        {page === 'store' && <StorePage />}
        {page === 'community' && <CommunityPage navigate={navigate} />}
        {page === 'marketplace' && <MarketplacePage />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
