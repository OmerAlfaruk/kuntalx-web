import { useState, useMemo, memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader, StatCard, Badge } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useMyOrders, useUpdateOrderStatus } from '../hooks/use-orders';
import type { Order, OrderStatus } from '../types/order';
import { useAuth } from '../../../lib/auth-context';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import { useI18n } from '../../../lib/i18n-context';
import { OrdersList } from '../components/OrdersList';

const getStatusVariant = (status: OrderStatus): any => {
    switch (status) {
        case 'pending': return 'warning';
        case 'accepted': return 'primary';
        case 'in_transit': return 'primary';
        case 'delivered': return 'success';
        case 'cancelled': return 'error';
        case 'fulfilled': return 'success';
        default: return 'outline';
    }
};

const columnHelper = createColumnHelper<Order>();

export const OrdersPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useI18n();
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    // Debounce filters to prevent excessive requests
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const debouncedFromDate = useDebounce(fromDate, 500);
    const debouncedToDate = useDebounce(toDate, 500);

    // Use React Query
    const { data: orders = [], isLoading } = useMyOrders(
        statusFilter === 'all' ? undefined : statusFilter,
        debouncedFromDate || undefined,
        debouncedToDate || undefined,
        debouncedSearchTerm || undefined
    );
    const { mutate: updateStatus } = useUpdateOrderStatus();

    const stats = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            inTransit: orders.filter(o => o.status === 'in_transit').length,
            totalValue: orders.reduce((acc, o) => acc + o.totalPrice, 0)
        };
    }, [orders]);

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => "Order ID",
            cell: info => (
                <span className="font-bold text-primary block text-[11px] font-mono">
                    #{info.getValue().substring(0, 8)}
                </span>
            ),
        }),
        columnHelper.accessor(row => row.aggregation?.associationName, {
            id: 'association',
            header: () => "Association",
            cell: info => (
                <span className="text-sm font-bold text-foreground">
                    {info.getValue() || 'Regional Hub'}
                </span>
            ),
        }),
        columnHelper.accessor(row => row.aggregation?.title, {
            id: 'aggregation',
            header: () => "Aggregation",
            cell: info => (
                <span className="text-sm font-bold text-foreground opacity-80">
                    {info.getValue() || t('orders.unknownProduce')}
                </span>
            ),
        }),
        columnHelper.accessor('buyerName', {
            header: () => "Buyer",
            cell: info => (
                <span className="text-sm font-bold text-foreground">
                    {info.getValue() || (user?.role === 'buyer' ? user.fullName : 'Verified Partner')}
                </span>
            ),
        }),
        columnHelper.accessor(row => row.aggregation?.cropTypeName, {
            id: 'cropType',
            header: () => "Crop Type",
            cell: info => (
                <Badge variant="outline" className="text-[11px] font-bold px-3 py-1 rounded-full border-primary/20 text-primary">
                    {info.getValue()}
                </Badge>
            ),
        }),
        columnHelper.accessor('requestedQuantityKuntal', {
            header: () => "Volume",
            cell: info => (
                <div className="flex items-baseline gap-1">
                    <span className="font-bold text-foreground text-sm">{info.getValue()} qt</span>
                </div>
            ),
        }),
        columnHelper.accessor('totalPrice', {
            header: () => "Valuation",
            cell: info => (
                <span className="font-bold text-sm text-foreground">ETB {info.getValue().toLocaleString()}</span>
            ),
        }),
        columnHelper.accessor('status', {
            id: 'status',
            header: () => "Status",
            cell: info => (
                <Badge variant={getStatusVariant(info.getValue())} className="text-[11px] font-bold px-3 py-1 rounded-full capitalize">
                    {info.getValue().replace('_', ' ')}
                </Badge>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => "Actions",
            cell: info => {
                const status = info.row.original.status;
                const isPendingBuyer = user?.role === 'buyer' && status === 'pending';

                return (
                    <div className="flex justify-end gap-3">
                        {isPendingBuyer && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(t('orders.cancelConfirm'))) {
                                        updateStatus({ id: info.row.original.id, status: 'cancelled' });
                                    }
                                }}
                                className="px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={() => navigate({ to: '/orders/$id', params: { id: info.row.original.id } } as any)}
                            className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                        >
                            View Detail
                        </button>
                    </div>
                );
            },
        }),
    ], [navigate, user, updateStatus, t]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: orders,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    const showFullLoader = isLoading && orders.length === 0;

    const statusLabels: Record<string, string> = {
        all: t('common.all'),
        pending: t('common.pending'),
        accepted: t('common.accepted'),
        in_transit: t('common.inTransit'),
        delivered: t('common.delivered'),
    };

    return (
        <div className="space-y-8 sm:space-y-16 animate-in fade-in duration-500 pb-12">
            <PageHeader
                title={t('orders.pageTitle')}
                description={user?.role === 'buyer'
                    ? t('orders.pageDescBuyer')
                    : t('orders.pageDescAdmin')}
                actions={
                    <div className="flex flex-wrap bg-muted/30 p-1 rounded-lg border border-border gap-1">
                        {['all', 'pending', 'accepted', 'in_transit', 'delivered'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${statusFilter === s
                                    ? 'bg-primary shadow-sm text-white border-transparent'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {statusLabels[s] ?? s}
                            </button>
                        ))}
                    </div>
                }
            />

            {/* Local Search Component */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder={t('orders.searchPlaceholder') || "Search by Order ID, Produce, or Buyer..."}
                        className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {showFullLoader ? <SkeletonCardsList count={1} /> : <StatCardsSection stats={stats} />}

            {user?.role === 'platform_admin' && (
                <TemporalFiltersSection
                    fromDate={fromDate}
                    toDate={toDate}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                    t={t}
                />
            )}

            {showFullLoader ? <SkeletonList rows={pageSize} /> : (
                <OrdersList
                    table={table}
                    isLoading={isLoading}
                    ordersCount={orders.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    t={t}
                    navigate={navigate}
                    user={user}
                    updateStatus={updateStatus}
                />
            )}
        </div>
    );
};

// --- Sub-components to isolate re-renders ---

const StatCardsSection = memo(({ stats }: { stats: any }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Volume" value={stats.total} icon="📑" description="Orders in network" />
        <StatCard title="Active Review" value={stats.pending} icon="⏳" description="Awaiting response" />
        <StatCard title="Logistics" value={stats.inTransit} icon="🚛" description="In-transit assets" />
        <StatCard title="Gross Value" value={`ETB ${(stats.totalValue / 1000).toFixed(1)}k`} icon="💰" description="Aggregate valuation" />
    </div>
));

const TemporalFiltersSection = memo(({ fromDate: parentFromDate, toDate: parentToDate, setFromDate, setToDate }: any) => {
    // Use local state for immediate response, sync to parent on change
    const [localFrom, setLocalFrom] = useState(parentFromDate);
    const [localTo, setLocalTo] = useState(parentToDate);

    // Sync local state if parent changes (e.g. on reset)
    useMemo(() => {
        setLocalFrom(parentFromDate);
        setLocalTo(parentToDate);
    }, [parentFromDate, parentToDate]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-10 bg-background-soft/50 border border-border/50 rounded-2xl">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Archive Start</label>
                <input
                    type="date"
                    value={localFrom}
                    onChange={(e) => {
                        setLocalFrom(e.target.value);
                        setFromDate(e.target.value);
                    }}
                    className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Archive End</label>
                <input
                    type="date"
                    value={localTo}
                    onChange={(e) => {
                        setLocalTo(e.target.value);
                        setToDate(e.target.value);
                    }}
                    className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                />
            </div>
            <div className="flex items-end">
                <button
                    onClick={() => {
                        setLocalFrom('');
                        setLocalTo('');
                        setFromDate('');
                        setToDate('');
                    }}
                    className="w-full h-11 border border-border text-foreground text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-background transition-all"
                >
                    Clear History Filter
                </button>
            </div>
        </div>
    );
});


