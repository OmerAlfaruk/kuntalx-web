import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../../lib/auth-context';
import { useDashboardStats } from '../hooks/use-dashboard-data';
import { useI18n } from '../../../lib/i18n-context';
import { BuyerDashboard } from '../components/BuyerDashboard';
import { AdminDashboard } from '../components/AdminDashboard';
import { ProducerDashboard } from '../components/ProducerDashboard';

export const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useI18n();
    const [daysFilter, setDaysFilter] = useState<number | undefined>(undefined);
    const { data: stats, isLoading } = useDashboardStats(user?.role || '', daysFilter);

    const handleExport = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002/api/v1';
            const url = daysFilter
                ? `${baseUrl}/admin/export?days=${daysFilter}`
                : `${baseUrl}/admin/export`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `kuntalx_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export report:', error);
        }
    }, [daysFilter]);

    const handleRegionalExport = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8002/api/v1';
            const url = daysFilter
                ? `${baseUrl}/admin/export/regional?days=${daysFilter}`
                : `${baseUrl}/admin/export/regional`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `kuntalx_regional_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export regional report:', error);
        }
    }, [daysFilter]);

    // Don't block whole page during data fetch anymore.
    // Ensure `isLoading` props are handled in subcomponents instead.

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            {user?.role === 'buyer' && (
                <BuyerDashboard
                    stats={stats}
                    isLoading={isLoading}
                    daysFilter={daysFilter}
                    setDaysFilter={setDaysFilter}
                    t={t}
                />
            )}

            {(user?.role === 'platform_admin' || user?.role === 'association_admin') && (
                <AdminDashboard
                    userRole={user.role}
                    isMini={user?.farmerData?.isMiniAssociation}
                    stats={stats}
                    isLoading={isLoading}
                    daysFilter={daysFilter}
                    setDaysFilter={setDaysFilter}
                    handleExport={handleExport}
                    handleRegionalExport={handleRegionalExport}
                    t={t}
                />
            )}

            {user?.role === 'farmer' && user?.farmerData?.isMiniAssociation && (
                <ProducerDashboard
                    stats={stats}
                    isLoading={isLoading}
                />
            )}

            {!user && (
                <div className="flex flex-col items-center justify-center py-24 sm:py-32 animate-in fade-in zoom-in-95 duration-500 px-4">
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-3xl mb-6">
                        🔒
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center">{t('dashboard.authRequired')}</h2>
                    <button onClick={() => navigate({ to: '/login' })} className="h-10 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        {t('dashboard.proceedLogin')}
                    </button>
                </div>
            )}
        </div>
    );
};
