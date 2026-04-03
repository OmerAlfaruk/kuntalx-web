import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n-context';
import { useTheme } from '../../lib/theme-context';

import { GlassModal } from './UI';

import { QuickActionsMenu } from './QuickActionsMenu';
import { KuntalXIconDark } from './Logo';
import { GlobalSearchBar } from '../../features/search';
import { NotificationBell } from '../../features/notifications';

export function Navbar() {
  const { logout } = useAuth();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleMobileToggle = (e: any) => {
      setIsMobileMenuOpen(e.detail.isOpen);
    };
    window.addEventListener('mobile-sidebar-toggle', handleMobileToggle);
    return () => window.removeEventListener('mobile-sidebar-toggle', handleMobileToggle);
  }, []);

  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    window.dispatchEvent(new CustomEvent('mobile-sidebar-toggle', { detail: { isOpen: nextState } }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-primary text-white z-50 px-8 border-b border-white/10 flex items-center justify-between">
      <div className={`flex items-center gap-6 group transition-all duration-300 ${isSearchOpen ? 'w-0 opacity-0 overflow-hidden md:w-auto md:opacity-100' : 'w-auto opacity-100'}`}>
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center shrink-0 border border-white/10 transition-transform duration-500">
            <KuntalXIconDark className="w-full h-full" />
          </div>
          <h1 className="text-lg font-bold tracking-tight hidden sm:block">
            Kuntal<span className="text-white/60">X</span>
          </h1>
        </div>
      </div>

      <div className={`flex-1 transition-all duration-300 ${isSearchOpen ? 'max-w-full px-0' : 'max-w-lg hidden md:block px-12'}`}>
        <div className="relative">
          <GlobalSearchBar />
          {isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white md:hidden"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isSearchOpen && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/70"
            aria-label="Toggle Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        )}
        
        <div className="transition-transform duration-300 hover:scale-105">
          <NotificationBell />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-white/70 hover:text-white"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>

        <div className="hidden sm:block border-l border-white/10 pl-4 flex items-center h-full self-stretch">
          <QuickActionsMenu onLogout={() => setShowLogoutConfirm(true)} />
        </div>
      </div>

      <GlassModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title={t('common.signOut')}
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-6 py-2 rounded-lg hover:bg-secondary-soft text-[10px] font-bold uppercase tracking-widest border border-border"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowLogoutConfirm(false);
                logout();
              }}
              className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-widest"
            >
              Confirm Exit
            </button>
          </div>
        }
      >
        <div className="flex gap-6 items-center">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 text-2xl shrink-0">
            🚪
          </div>
          <div className="space-y-1">
            <p className="text-base text-foreground font-bold">
              Terminate current session?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You will need to re-authenticate to access the regional trade network.
            </p>
          </div>
        </div>
      </GlassModal>
    </nav>
  );
}
