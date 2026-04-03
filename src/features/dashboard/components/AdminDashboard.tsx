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
                title={userRole === 'association_admin' ? `${stats?.associationName || 'Association'}` : 'Platform Overview'}
                description="Trade ecosystem management and performance monitoring."
                actions={
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                        {userRole === 'association_admin' ? (
                            <>
                                <ActionButton
                                    variant={daysFilter === 30 ? 'primary' : 'outline'}
                                    onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                                >
                                    {daysFilter === 30 ? 'All Time ▾' : '30D ▾'}
                                </ActionButton>
                                <ActionButton
                                    onClick={() => navigate({ to: '/my-aggregations' })}
                                    icon={<span>➕</span>}
                                >
                                    <span className="hidden sm:inline">{t('nav.createAggregation')}</span>
                                    <span className="sm:hidden">New</span>
                                </ActionButton>
                            </>
                        ) : (
                            <>
                                <ActionButton
                                    variant={daysFilter === 30 ? 'primary' : 'outline'}
                                    onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                                >
                                    {daysFilter === 30 ? 'All Time ▾' : 'Last 30D ▾'}
                                </ActionButton>
                                <ActionButton
                                    onClick={handleExport}
                                >
                                    <span className="hidden sm:inline">{t('dashboard.generateAuditReport')}</span>
                                    <span className="sm:hidden">Export</span>
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
