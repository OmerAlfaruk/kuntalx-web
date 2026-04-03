import { Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { KuntalLoader } from './UI';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleToggle = (e: any) => {
      setIsSidebarCollapsed(e.detail.isCollapsed);
    };
    const handleMobileToggle = (e: any) => {
      setIsMobileMenuOpen(e.detail.isOpen);
    };
    window.addEventListener('sidebar-toggle', handleToggle);
    window.addEventListener('mobile-sidebar-toggle', handleMobileToggle);
    return () => {
      window.removeEventListener('sidebar-toggle', handleToggle);
      window.removeEventListener('mobile-sidebar-toggle', handleMobileToggle);
    };
  }, []);

  if (isLoading) {
    return <KuntalLoader />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar isMobileOpen={isMobileMenuOpen} />
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30 lg:hidden animate-in fade-in duration-300"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('mobile-sidebar-toggle', { detail: { isOpen: false } }));
            }}
          />
        )}
        <main className={`flex-1 min-h-screen mt-16 transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          } ml-0`}>
          <div className="px-10 py-12 animate-in fade-in duration-1000">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
