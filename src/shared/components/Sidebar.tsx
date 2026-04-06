import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';

import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n-context';
import { getMediaUrl } from '../../lib/api-client';

interface SidebarProps {
  isMobileOpen?: boolean;
}

export function Sidebar({ isMobileOpen }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar-collapsed', String(nextState));
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed: nextState } }));
  };

  const getMenuItems = () => {
    const dashboardItem = { label: t('nav.dashboard'), path: '/dashboard', icon: '◰' };
    const marketplaceItem = { label: t('nav.marketplace') || 'Marketplace', path: '/aggregations', icon: '⌬' };
    const cropTypesItem = { label: t('nav.cropTypes') || 'Supported Crops', path: '/crop-types', icon: '⚛' };
    const platformAnalyticsItem = { label: t('nav.platformAnalytics'), path: '/analytics', icon: '⌇' };

    if (user?.role === 'buyer') {
      return [
        dashboardItem,
        marketplaceItem,
        { label: t('nav.myOrders'), path: '/orders', icon: '□' },
        { label: t('nav.shipments'), path: '/shipments', icon: '▽' },
        cropTypesItem,
        { label: t('nav.systemSettings') || 'Settings', path: '/settings', icon: '⚙' },
      ];
    }

    if (user?.role === 'association_admin') {
      return [
        dashboardItem,
        { label: t('nav.myAggregations') || 'My Aggregations', path: '/my-aggregations', icon: '⊕' },
        { label: t('nav.myOrders') || 'Orders', path: '/orders', icon: '□' },
        { label: t('nav.farmerManagement'), path: '/farmers', icon: '⧟' },
        { label: 'Requests', path: '/assoc-requests', icon: '✉' },
        { label: t('nav.qualityControl'), path: '/quality-control', icon: '◇' },
        { label: t('nav.shipments'), path: '/shipments', icon: '▽' },
        { label: t('nav.payouts'), path: '/payouts', icon: '⊚' },
        { label: 'Payments', path: '/payments', icon: '₿' },
        cropTypesItem,
        { label: t('nav.systemSettings') || 'Settings', path: '/settings', icon: '⚙' },
      ];
    }

    if (user?.role === 'farmer' && user?.farmerData?.isMiniAssociation) {
      return [
        dashboardItem,
        { label: t('nav.myOfferings') || 'My Offerings', path: '/my-aggregations', icon: '⊕' },
        { label: t('nav.myOrders') || 'Orders', path: '/orders', icon: '□' },
        { label: t('nav.payouts') || 'My Payouts', path: '/payouts', icon: '⊚' },
        cropTypesItem,
        { label: t('nav.systemSettings') || 'Settings', path: '/settings', icon: '⚙' },
      ];
    }

    if (user?.role === 'platform_admin') {
      return [
        dashboardItem,
        marketplaceItem,
        { label: 'Orders', path: '/orders', icon: '□' },
        { label: t('nav.associations'), path: '/associations', icon: '◬' },
        { label: t('nav.requests'), path: '/requests', icon: '✉' },
        { label: t('nav.userManagement'), path: '/users', icon: '⧟' },
        { label: t('nav.payouts') || 'Payouts', path: '/payouts', icon: '⊚' },
        { label: 'Payments', path: '/payments', icon: '₿' },
        cropTypesItem,
        platformAnalyticsItem,
        { label: 'Live Fleet Map', path: '/fleet-map', icon: '⦿' },
        { label: t('nav.auditLogs'), path: '/audit-logs', icon: '⧩' },
        { label: t('nav.systemSettings'), path: '/settings', icon: '⚙' },
      ];
    }

    return [dashboardItem, marketplaceItem, cropTypesItem];
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-background-soft/95 backdrop-blur-xl text-foreground border-r border-border/50 z-40 flex flex-col pt-8 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className={`mb-12 px-6 flex items-center justify-between ${isCollapsed ? 'lg:px-0 flex-col gap-6' : ''}`}>
        {(!isCollapsed || isMobileOpen) && (
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Network System</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 ${isCollapsed ? 'mb-4' : ''}`}
        >
          <span className="text-xs transition-transform duration-500" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            〈
          </span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar">
        {getMenuItems().map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path as any}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  window.dispatchEvent(new CustomEvent('mobile-sidebar-toggle', { detail: { isOpen: false } }));
                }
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative  ${isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                } ${isCollapsed && !isMobileOpen ? 'lg:justify-center lg:px-0' : ''}`}
              title={isCollapsed && !isMobileOpen ? item.label : ''}
            >
              <span className={`text-xl transition-all ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>

              {(!isCollapsed || isMobileOpen) && (
                <span className={`text-[11px] font-bold uppercase tracking-[0.1em] truncate transition-all ${isActive ? '' : 'opacity-80 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
              )}
              {isActive && (
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`mt-auto p-4 border-t border-border/40 ${(isCollapsed && !isMobileOpen) ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${(isCollapsed && !isMobileOpen) ? 'lg:justify-center' : 'hover:bg-primary/5 group cursor-pointer'}`}>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden ring-1 ring-primary/10 group-hover:ring-primary/40 transition-all shadow-sm">
            {user?.profilePictureUrl ? (
              <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-display">{user?.fullName?.[0] || 'U'}</span>
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="overflow-hidden text-left">
              <p className="text-[11px] font-bold text-foreground uppercase tracking-wider truncate">{user?.fullName || 'User'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] truncate opacity-80">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
