import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { StatCard, Badge, TablePagination } from '../../../shared/components/UI';
import type { Aggregation } from '../types/aggregation';
import {
    useMyAggregations
} from '../hooks/use-aggregations';
import { useAuth } from '../../../lib/auth-context';

import { useI18n } from '../../../lib/i18n-context';
import { CreateAggregationModal } from '../components/CreateAggregationModal';
import { MyAggregationsList } from '../components/MyAggregationsList';
import { ActionButton } from '../../../shared/components/ActionButton';

const columnHelper = createColumnHelper<Aggregation>();

export const MyAggregationsPage = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: aggregations = [], isLoading } = useMyAggregations();

    const isMini = user?.farmerData?.isMiniAssociation;
    const canCreate = user?.role === 'association_admin' || (user?.role === 'farmer' && isMini);

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => "Aggregation ID",
        }),
        columnHelper.accessor('cropTypeName', {
            header: () => "Crop",
        }),
        columnHelper.accessor('totalQuantityKuntal', {
            header: () => "Quantity",
        }),
        columnHelper.accessor('status', {
            header: () => "Status",
        }),
    ], []);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: aggregations || [],
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const activeAggregations = aggregations.filter((agg: Aggregation) => 
        agg.status === 'collecting' || agg.status === 'ready_for_sale' || agg.status === 'reserved'
    );
    const totalVolume = activeAggregations.reduce((sum: number, agg: Aggregation) => sum + (agg.totalQuantityKuntal || 0), 0);
    const activeCount = aggregations.filter((agg: Aggregation) => 
        isMini ? (agg.status === 'ready_for_sale' || agg.status === 'collecting') : agg.status === 'collecting'
    ).length;
    const completedCount = aggregations.filter((agg: Aggregation) => 
        isMini ? agg.status === 'fulfilled' : agg.status === 'ready_for_sale' || agg.status === 'fulfilled'
    ).length;

    return (
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
            {/* Command Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20">{t('aggregations.operationalHub')}</Badge>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider opacity-50">{t('aggregations.hubSubtitle')}</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl text-foreground tracking-tight leading-none">{t('aggregations.hubTitle')}</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground opacity-70 max-w-xl">
                        {t('aggregations.hubDesc')}
                    </p>
                </div>

                {canCreate && (
                    <ActionButton
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto h-10 sm:h-12 px-6 sm:px-10 bg-primary text-white text-xs uppercase tracking-wider shadow-lg rounded-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
                    >
                        {t('aggregations.initiateProtocol')}
                    </ActionButton>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className={`grid grid-cols-1 ${isMini ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                <StatCard
                    title="Active Inventory"
                    value={`${totalVolume.toLocaleString()} q`}
                    icon="📦"
                    description={isMini ? "Current listed stock" : "Consolidated volume"}
                />
                {!isMini && (
                    <StatCard
                        title="Active Collections"
                        value={activeCount.toString()}
                        icon="🔄"
                        description="Open pools"
                    />
                )}
                <StatCard
                    title={isMini ? "Completed Orders" : "Awaiting Payout"}
                    value={completedCount.toString()}
                    icon="💰"
                    description={isMini ? "Successful sales" : "Completed cycles"}
                />
            </div>

            {/* Main Command Grid - Standardized Table */}
            <div className="card-minimal overflow-hidden">
                <MyAggregationsList 
                    table={table}
                    isLoading={isLoading}
                    t={t}
                />
                <TablePagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    totalRecords={table.getFilteredRowModel().rows.length}
                    pageSize={table.getState().pagination.pageSize}
                    onPageChange={(page: number) => table.setPageIndex(page - 1)}
                />
            </div>

            {/* Modals */}
            <CreateAggregationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

