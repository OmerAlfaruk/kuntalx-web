import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, StatCard, TablePagination } from '../../../shared/components/UI';
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
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
            <PageHeader
                title={t('aggregations.hubTitle')}
                description="Manage regional aggregation protocols and verifiable inventory state."
                actions={
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        {canCreate && (
                            <ActionButton
                                onClick={() => setIsCreateModalOpen(true)}
                                className="w-full sm:w-auto"
                                variant="primary"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">⌬</span>
                                    <span>{t('aggregations.initiateProtocol')}</span>
                                </div>
                            </ActionButton>
                        )}
                    </div>
                }
            />

            <div className={`grid grid-cols-1 ${isMini ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 sm:gap-8`}>
                <StatCard
                    title="Active Inventory"
                    value={`${totalVolume.toLocaleString()} qt`}
                    icon="秤"
                    description={isMini ? "Current listed stock" : "Consolidated volume"}
                    delay={0.1}
                />
                {!isMini && (
                    <StatCard
                        title="Active Status"
                        value={activeCount.toString()}
                        icon="⌘"
                        description="Collection pools"
                        delay={0.2}
                    />
                )}
                <StatCard
                    title={isMini ? "Fulfilled" : "Awaiting Settlement"}
                    value={completedCount.toString()}
                    icon="⊞"
                    description={isMini ? "Successful sale cycles" : "Completed protocols"}
                    delay={0.3}
                />
            </div>

            <div className="card-minimal overflow-hidden">
                <div className="px-8 py-5 border-b border-border/50 bg-background-soft/50">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-none">Aggregation Registry</h2>
                </div>
                <MyAggregationsList 
                    table={table}
                    isLoading={isLoading}
                    t={t}
                />
                <div className="border-t border-border/50">
                    <TablePagination
                        currentPage={table.getState().pagination.pageIndex + 1}
                        totalPages={table.getPageCount()}
                        totalRecords={table.getFilteredRowModel().rows.length}
                        pageSize={table.getState().pagination.pageSize}
                        onPageChange={(page: number) => table.setPageIndex(page - 1)}
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateAggregationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

