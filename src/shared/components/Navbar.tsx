import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';

import { QuickActionsMenu } from './QuickActionsMenu';
import { KuntalXIconDark } from './Logo';
import { GlobalSearchBar } from '../../features/search';
import { NotificationBell } from '../../features/notifications';

export function Navbar() {
  const { logout } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md text-foreground px-8 border-b border-border z-50 flex items-center justify-between">
      <div className={`flex items-center gap-6 group transition-all duration-300 ${isSearchOpen ? 'w-0 opacity-0 overflow-hidden md:w-auto md:opacity-100' : 'w-auto opacity-100'}`}>
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-background-soft transition-all duration-300 text-muted-foreground hover:text-foreground"
          aria-label="Toggle Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 p-2 flex items-center justify-center shrink-0 border border-primary/20 transition-all duration-300 hover:scale-105 shadow-sm">
            <KuntalXIconDark className="w-full h-full text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Kuntal<span className="text-primary font-bold uppercase">X</span>
          </h1>
        </div>
      </div>

      <div className={`flex-1 transition-all duration-300 ${isSearchOpen ? 'max-w-full px-0' : 'max-w-lg hidden md:block px-12'}`}>
        <div className="relative">
          <GlobalSearchBar />
          {isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isSearchOpen && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-background-soft transition-all duration-300 text-muted-foreground hover:text-foreground"
            aria-label="Toggle Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        )}
        
        <div className="transition-transform duration-300 hover:scale-105">
          <NotificationBell />
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-background-soft transition-all duration-300 text-muted-foreground hover:text-foreground"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          )}
        </button>

        <div className="hidden sm:block border-l border-border/50 pl-4 flex items-center h-full self-stretch">
          <QuickActionsMenu onLogout={() => setShowLogoutConfirm(true)} />
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="card-minimal w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="px-6 py-5 border-b border-border/50 bg-background-soft">
              <h2 className="text-[14px] font-bold text-foreground">Sign Out</h2>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-foreground font-bold leading-tight">
                    Are you sure you want to sign out?
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    You will need to sign in again to access your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 bg-background-soft border-t border-border/50">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="h-10 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="h-10 flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
