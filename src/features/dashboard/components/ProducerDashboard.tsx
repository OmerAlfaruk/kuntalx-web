import React from 'react';
import { type DashboardStats } from '../hooks/use-dashboard-data';
import { StatCard } from '../../../shared/components/UI';
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <StatCard title="Active Inventory" value={`${(stats?.totalMonthlyVolumeKuntal || 0).toFixed(1)} Qt`} icon="⚖️" delay={0.1} />
            <StatCard title="Total Sold" value={`${(stats?.totalSalesVolume || 0).toFixed(1)} Qt`} icon="📦" delay={0.2} />
            <StatCard title="Completed Payouts" value={`${((stats?.completedOrdersCount || 0) / 1000).toFixed(0)}k ETB`} icon="💰" delay={0.3} />
        </div>
    );
};

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({ stats, isLoading }) => {
    const { t } = useI18n();

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 w-full">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        My Producer Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium mt-1">
                        Manage your individual production and direct sales.
                    </p>
                </div>
                
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <Link to="/my-aggregations" className="flex-shrink-0">
                        <ActionButton variant="primary">
                            + New Offering
                        </ActionButton>
                    </Link>
                    <Link to="/orders" className="flex-shrink-0">
                        <ActionButton variant="outline">
                            View Orders
                        </ActionButton>
                    </Link>
                    <Link to="/payouts" className="flex-shrink-0">
                        <ActionButton variant="outline">
                            My Payouts
                        </ActionButton>
                    </Link>
                </div>
            </div>

            <ProducerStats stats={stats} isLoading={isLoading} />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recent Market Activity</h2>
                <ActivityTable
                    data={stats?.regionalActivity}
                    isLoading={isLoading}
                    t={t}
                />
            </div>
        </div>
    );
};
