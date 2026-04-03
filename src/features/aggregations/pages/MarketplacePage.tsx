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
        <div className="space-y-10 animate-fade-in">
            <PageHeader
                title={t('nav.marketplace') || "Marketplace"}
                description="Browse active aggregation protocols across the national network."
                actions={
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search Marketplace..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                table.setPageIndex(0);
                            }}
                            className="w-full h-11 pl-12 pr-4 bg-muted/20 border border-border/50 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none italic"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>
                }
            />

            {/* Market Intelligence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Active Pools"
                    value={aggregations.length}
                    icon="🌊"
                    description="Total open aggregation sessions."
                />
                <StatCard
                    title="Market Status"
                    value="Bullish"
                    icon="📈"
                    description="Aggregate network activity index."
                />
                <StatCard
                    title="Verified Hubs"
                    value="24"
                    icon="🏛️"
                    description="Certified collection centers active."
                />
            </div>

            {/* Main Command Center: Grid for Buyers, Table for Admins */}
            {isLoading && !aggregations.length ? (
                <SkeletonCardsList count={12} />
            ) : isBuyer ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {table.getRowModel().rows.map(row => (
                            <MarketplaceCard key={row.original.id} aggregation={row.original} />
                        ))}
                    </div>
                    {aggregations.length === 0 && (
                        <div className="py-20 text-center space-y-4 bg-muted/5 rounded-[3rem] border border-dashed border-border/40">
                            <div className="text-6xl grayscale opacity-20">📡</div>
                            <h3 className="text-xl font-black text-foreground uppercase italic">{t('aggregations.noProtocols') || "No Protocols Found"}</h3>
                            <p className="text-sm text-muted-foreground font-medium italic">Broadcast signal established, but no active market aggregations detected.</p>
                        </div>
                    )}
                    <TablePagination
                        currentPage={pageIndex + 1}
                        totalPages={table.getPageCount()}
                        totalRecords={table.getFilteredRowModel().rows.length}
                        pageSize={pageSize}
                        onPageChange={(page: number) => table.setPageIndex(page - 1)}
                    />
                </div>
            ) : (
                <div className="card-minimal overflow-hidden">
                    <div className="p-8 border-b border-border bg-muted/10">
                        <h3 className="text-xl font-extrabold uppercase italic tracking-tight text-foreground">Open Market Protocols</h3>
                    </div>
                    {isLoading ? <SkeletonList rows={pageSize} /> : (
                        <>
                            <MyAggregationsList
                                table={table}
                                isLoading={isLoading}
                                t={t}
                            />
                            <TablePagination
                                currentPage={pageIndex + 1}
                                totalPages={table.getPageCount()}
                                totalRecords={table.getFilteredRowModel().rows.length}
                                pageSize={pageSize}
                                onPageChange={(page: number) => table.setPageIndex(page - 1)}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
