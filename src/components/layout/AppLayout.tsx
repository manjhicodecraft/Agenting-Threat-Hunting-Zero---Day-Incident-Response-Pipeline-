import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-soc-bg">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <div className="lg:pl-72">
        <TopBar onOpenNavigation={() => setNavOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
