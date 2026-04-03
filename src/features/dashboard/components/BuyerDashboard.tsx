import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader } from '../../../shared/components/UI';
import { type DashboardStats } from '../hooks/use-dashboard-data';
import { LiveMarketTicker } from './LiveMarketTicker';
import { QuickStats } from './StatsCards';
import { ActivityTable } from './ActivityTable';
import { ActionButton } from '../../../shared/components/ActionButton';

interface BuyerDashboardProps {
    stats?: DashboardStats;
    isLoading?: boolean;
    daysFilter?: number;
    setDaysFilter: (days?: number) => void;
    t: (k: string) => string;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ stats, isLoading, daysFilter, setDaysFilter, t }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title={t('dashboard.procurementHub')}
                description={t('dashboard.procurementHubDesc')}
                actions={
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                        <ActionButton
                            variant={daysFilter === 30 ? 'primary' : 'outline'}
                            onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                        >
                            {daysFilter === 30 ? 'All Time ▾' : 'Last 30D ▾'}
                        </ActionButton>
                        <ActionButton
                            onClick={() => navigate({ to: '/aggregations' })}
                        >
                            {t('dashboard.marketTerminal')} →
                        </ActionButton>
                    </div>
                }
            />

            <LiveMarketTicker />

            <QuickStats stats={stats} isLoading={isLoading} t={t} userRole="buyer" />

            <ActivityTable data={stats?.regionalActivity} isLoading={isLoading} t={t} />
        </div>
    );
};
