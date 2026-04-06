import React from 'react';
import { StatCard } from '../../../shared/components/UI';
import { type DashboardStats } from '../hooks/use-dashboard-data';
import { SkeletonCardsList } from '../../../shared/components/Skeletons';

interface StatsProps {
    stats?: DashboardStats;
    isLoading?: boolean;
    t: (k: string) => string;
    userRole?: string;
    isMini?: boolean;
}

export const QuickStats: React.FC<StatsProps> = ({ stats, isLoading, t, userRole }) => {
    if (isLoading) return <SkeletonCardsList />;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-10 sm:mb-14">
            {userRole !== 'buyer' && (
                <>
                    <StatCard 
                        title={t('dashboard.regionalHubs')} 
                        value={stats?.totalAssociations || 0} 
                        icon="⌬" 
                        description={t('dashboard.regionalHubsDesc')} 
                        delay={0.1}
                    />
                    <StatCard 
                        title={t('dashboard.totalFarmers')} 
                        value={(stats?.totalFarmers || 0).toLocaleString()} 
                        icon="base" 
                        description={t('dashboard.totalFarmersDesc')} 
                        delay={0.2}
                    />
                </>
            )}
            <StatCard 
                title={t('dashboard.activeAggregations')} 
                value={stats?.activeAggregations || 0} 
                icon="⌘" 
                description={t('dashboard.activeAggregationsDesc')} 
                delay={0.3}
            />
            <StatCard 
                title={t('dashboard.totalRevenue')} 
                value={`${((stats?.totalSalesVolume || 0) / 1000).toFixed(0)}k`} 
                icon="⊞" 
                description={t('dashboard.totalRevenueDesc')} 
                delay={0.4}
            />
        </div>
    );
};

export const AssocAdminStats: React.FC<StatsProps> = ({ stats, isLoading, t, isMini }) => {
    if (isLoading) return <SkeletonCardsList />;
    const gridCols = isMini ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

    return (
        <div className={`grid ${gridCols} gap-4 sm:gap-8 mb-10 sm:mb-14`}>
            {!isMini && (
                <StatCard 
                    title={t('dashboard.members')} 
                    value={(stats?.myMembersCount || 0).toLocaleString()} 
                    icon="base" 
                    description={t('dashboard.membersDesc')} 
                    delay={0.1}
                />
            )}
            <StatCard 
                title={t('dashboard.activeAggregations')} 
                value={stats?.activeAggregations || 0} 
                icon="⌘" 
                description={t('dashboard.activeAggregationsDesc')} 
                delay={isMini ? 0.1 : 0.2}
            />
            <StatCard 
                title={t('dashboard.monthlyVolume')} 
                value={`${(stats?.totalMonthlyVolumeKuntal || 0).toFixed(1)}`} 
                icon="⏚" 
                description={t('dashboard.monthlyVolumeDesc')} 
                delay={isMini ? 0.2 : 0.3}
            />
        </div>
    );
};
