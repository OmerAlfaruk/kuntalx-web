import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useOpenAggregations } from '../hooks/use-aggregations';
import { useI18n } from '../../../lib/i18n-context';
import { MyAggregationsList } from '../components/MyAggregationsList';
import { MarketplaceCard } from '../components/MarketplaceCard';
import { PageHeader, StatCard, TablePagination } from '../../../shared/components/UI';
import { useAuth } from '../../../lib/auth-context';
import { SkeletonCardsList, SkeletonList } from '../../../shared/components/Skeletons';
import type { Aggregation } from '../types/aggregation';

const columnHelper = createColumnHelper<Aggregation>();

export const MarketplacePage = () => {
    const { user } = useAuth();
    const { t } = useI18n();
    const [keyword, setKeyword] = useState('');

    const { data: aggregations = [], isLoading } = useOpenAggregations({
        keyword: keyword || undefined
    });

    const isBuyer = user?.role === 'buyer';

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => "ID",
        }),
        columnHelper.accessor('cropTypeName', {
            header: () => "Crop",
        }),
        columnHelper.accessor('associationName', {
            header: () => "Association",
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

    const { pageIndex, pageSize } = table.getState().pagination;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <PageHeader
                title={t('nav.marketplace') || "Market Terminal"}
                description="Real-time multi-regional aggregation tracking and procurement signals."
                actions={
                    <div className="relative w-full sm:w-96 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search active protocols..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                table.setPageIndex(0);
                            }}
                            className="w-full h-11 pl-12 pr-4 bg-background-soft border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        />
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    title="Active Protocols"
                    value={aggregations.length}
                    icon="⌘"
                    description="Open sessions across active sectors."
                    delay={0.1}
                />
                <StatCard
                    title="Market Index"
                    value="Optimal"
                    icon="📈"
                    description="Aggregate network activity index."
                    delay={0.2}
                />
                <StatCard
                    title="Certified Hubs"
                    value="24"
                    icon="🏛️"
                    description="Federated collection centers."
                    delay={0.3}
                />
            </div>

            {isLoading && !aggregations.length ? (
                <SkeletonCardsList count={12} />
            ) : isBuyer ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {table.getRowModel().rows.map(row => (
                            <MarketplaceCard key={row.original.id} aggregation={row.original} />
                        ))}
                    </div>
                    {aggregations.length === 0 && (
                        <div className="py-24 text-center space-y-6 card-minimal">
                            <div className="text-6xl grayscale opacity-20">📡</div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-foreground uppercase tracking-widest">{t('aggregations.noProtocols') || "No Protocols Found"}</h3>
                                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest max-w-sm mx-auto">No compatible market aggregations detected in this sector.</p>
                            </div>
                        </div>
                    )}
                    <div className="px-10 py-6 border-t border-border/50 bg-background-soft/50 rounded-2xl">
                        <TablePagination
                            currentPage={pageIndex + 1}
                            totalPages={table.getPageCount()}
                            totalRecords={table.getFilteredRowModel().rows.length}
                            pageSize={pageSize}
                            onPageChange={(page: number) => table.setPageIndex(page - 1)}
                        />
                    </div>
                </div>
            ) : (
                <div className="card-minimal overflow-hidden">
                    <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 leading-none">Open Market Protocols</h2>
                    </div>
                    {isLoading ? <SkeletonList rows={pageSize} /> : (
                        <>
                            <MyAggregationsList
                                table={table}
                                isLoading={isLoading}
                                t={t}
                            />
                            <div className="px-10 py-6 border-t border-border/50 bg-background-soft/50">
                                <TablePagination
                                    currentPage={pageIndex + 1}
                                    totalPages={table.getPageCount()}
                                    totalRecords={table.getFilteredRowModel().rows.length}
                                    pageSize={pageSize}
                                    onPageChange={(page: number) => table.setPageIndex(page - 1)}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
