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
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
            <PageHeader
                title={t('dashboard.procurementHub')}
                description="Real-time multi-regional aggregation tracking and procurement signals."
                actions={
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        <ActionButton
                            variant={daysFilter === 30 ? 'primary' : 'outline'}
                            onClick={() => setDaysFilter(daysFilter === 30 ? undefined : 30)}
                            className="rounded-xl border-white/10 bg-background/40 font-display text-[10px] uppercase tracking-widest"
                        >
                            {daysFilter === 30 ? 'Lock: 30D' : 'Window: 30D'}
                        </ActionButton>
                        <ActionButton
                            onClick={() => navigate({ to: '/aggregations' })}
                            className="rounded-xl font-display text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                            icon={<span className="text-sm">⌬</span>}
                        >
                            {t('dashboard.marketTerminal')}
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
