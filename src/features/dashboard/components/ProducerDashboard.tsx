import React from 'react';
import { type DashboardStats } from '../hooks/use-dashboard-data';
import { PageHeader, StatCard } from '../../../shared/components/UI';
import { SkeletonCardsList } from '../../../shared/components/Skeletons';
import { ActionButton } from '../../../shared/components/ActionButton';
import { Link } from '@tanstack/react-router';
import { useI18n } from '../../../lib/i18n-context';
import { ActivityTable } from './ActivityTable';

interface ProducerDashboardProps {
    stats?: DashboardStats;
    isLoading: boolean;
}

export const ProducerStats: React.FC<{ stats?: DashboardStats; isLoading: boolean }> = ({ stats, isLoading }) => {
    if (isLoading) return <SkeletonCardsList />;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-14">
            <StatCard title="Active Inventory" value={`${(stats?.totalMonthlyVolumeKuntal || 0).toFixed(1)}`} icon="⚖️" description="Live verifiable stock on chain" delay={0.1} />
            <StatCard title="Total Sold" value={`${(stats?.totalSalesVolume || 0).toFixed(1)}`} icon="⌘" description="Total throughput this cycle" delay={0.2} />
            <StatCard title="Completed Payouts" value={`${((stats?.completedOrdersCount || 0) / 1000).toFixed(0)}k`} icon="⊞" description="Verified financial settlements" delay={0.3} />
        </div>
    );
};

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({ stats, isLoading }) => {
    const { t } = useI18n();

    return (
        <div className="animate-in fade-in duration-700">
            <PageHeader
                title="Producer Command"
                description="Manage individual production, direct sales, and settlement telemetry."
                actions={
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                        <Link to="/my-aggregations" className="flex-shrink-0">
                            <ActionButton 
                                variant="primary"
                                className="rounded-xl font-display text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                icon={<span className="text-sm">➕</span>}
                            >
                                New Signal
                            </ActionButton>
                        </Link>
                        <Link to="/orders" className="flex-shrink-0">
                            <ActionButton 
                                variant="outline"
                                className="rounded-xl border-white/10 bg-background/40 font-display text-[10px] uppercase tracking-widest"
                            >
                                Orders
                            </ActionButton>
                        </Link>
                        <Link to="/payouts" className="flex-shrink-0">
                            <ActionButton 
                                variant="outline"
                                className="rounded-xl border-white/10 bg-background/40 font-display text-[10px] uppercase tracking-widest"
                            >
                                Payouts
                            </ActionButton>
                        </Link>
                    </div>
                }
            />

            <ProducerStats stats={stats} isLoading={isLoading} />

            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-primary/40 rounded-full" />
                    <h2 className="text-[11px] font-display font-bold uppercase tracking-[0.3em] text-foreground/60 leading-none">Regional Market Activity</h2>
                </div>
                <ActivityTable
                    data={stats?.regionalActivity}
                    isLoading={isLoading}
                    t={t}
                />
            </div>
        </div>
    );
};
