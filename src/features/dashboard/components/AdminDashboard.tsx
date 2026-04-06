import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../shared/components/UI';
import { type DashboardStats } from '../hooks/use-dashboard-data';
import { LiveMarketTicker } from './LiveMarketTicker';
import { QuickStats, AssocAdminStats } from './StatsCards';
import { ActivityTable } from './ActivityTable';
import { ActionButton } from '../../../shared/components/ActionButton';

interface AdminDashboardProps {
    userRole: string;
    stats?: DashboardStats;
    isLoading?: boolean;
    daysFilter?: number;
    setDaysFilter: (days?: number) => void;
    handleExport: () => void;
    handleRegionalExport: () => void;
    t: (k: string) => string;
    isMini?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    userRole, stats, isLoading, daysFilter, setDaysFilter, handleExport, handleRegionalExport, t, isMini
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title={userRole === 'association_admin' ? `${stats?.associationName || 'Association'}` : 'Platform Command'}
                description="Trade ecosystem state management and real-time telemetry monitoring."
                actions={
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        {userRole === 'association_admin' ? (
                            <>
                                <ActionButton
                                    variant={daysFilter === 30 ? 'primary' : 'outline'}
                                    onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                                    className="rounded-xl border-white/10 bg-background/40 font-display text-[10px] uppercase tracking-widest"
                                >
                                    {daysFilter === 30 ? 'Locked: 30D' : 'Time: Universal'}
                                </ActionButton>
                                <ActionButton
                                    onClick={() => navigate({ to: '/my-aggregations' })}
                                    icon={<span className="text-sm">⌬</span>}
                                    className="rounded-xl font-display text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                >
                                    <span className="hidden sm:inline">{t('nav.createAggregation')}</span>
                                    <span className="sm:hidden">Initialize</span>
                                </ActionButton>
                            </>
                        ) : (
                            <>
                                <ActionButton
                                    variant={daysFilter === 30 ? 'primary' : 'outline'}
                                    onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                                    className="rounded-xl border-white/10 bg-background/40 font-display text-[10px] uppercase tracking-widest"
                                >
                                    {daysFilter === 30 ? 'Lock: 30D' : 'Window: 30D'}
                                </ActionButton>
                                <ActionButton
                                    onClick={handleExport}
                                    className="rounded-xl font-display text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                    icon={<span className="text-sm">⊞</span>}
                                >
                                    <span className="hidden sm:inline">{t('dashboard.generateAuditReport')}</span>
                                    <span className="sm:hidden">EXFIL</span>
                                </ActionButton>
                            </>
                        )}
                    </div>
                }
            />

            <LiveMarketTicker />

            {userRole === 'association_admin' ? (
                <AssocAdminStats stats={stats} isLoading={isLoading} t={t} isMini={isMini} />
            ) : (
                <QuickStats stats={stats} isLoading={isLoading} t={t} userRole={userRole} />
            )}

            <ActivityTable
                data={stats?.regionalActivity}
                isLoading={isLoading}
                onExport={userRole === 'platform_admin' ? handleRegionalExport : undefined}
                t={t}
            />
        </div>
    );
};
