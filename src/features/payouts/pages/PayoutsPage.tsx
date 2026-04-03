import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, StatCard, GlassModal, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { usePayouts, useDistributePayout } from '../hooks/use-payouts';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import { useAuth } from '../../../lib/auth-context';
import { useMyOrders as useOrders } from '../../orders/hooks/use-orders';
import { PayoutsList } from '../components/PayoutsList';
import type { Payout } from '../types/payout';

const columnHelper = createColumnHelper<Payout>();

export const PayoutsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
    const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: payouts = [], isLoading: isLoadingPayouts } = usePayouts(debouncedSearchTerm);
    // Fetch fulfilled orders that have been paid — these are eligible for payout distribution
    const { data: allOrders = [], isLoading: isLoadingOrders } = useOrders('fulfilled');
    const { mutateAsync: distributePayout, isPending: isDistributing } = useDistributePayout();

    const [selectedOrderId, setSelectedOrderId] = useState<string>('');

    const handleDistributePayout = useCallback(async () => {
        if (!selectedOrderId) return;

        try {
            await distributePayout(selectedOrderId);
            setIsDistributeModalOpen(false);
            setSelectedOrderId('');
        } catch (error) {
            console.error('Failed to process payout run', error);
            alert("Error: Ensure the order is PAID and hasn't already been distributed.");
        }
    }, [selectedOrderId, distributePayout]);

    const showFullLoader = isLoadingPayouts && (payouts as Payout[]).length === 0;

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => "Transaction ID",
        }),
        columnHelper.accessor('amount', {
            header: () => "Amount",
        }),
        columnHelper.accessor('status', {
            header: () => "Status",
        }),
        columnHelper.accessor('createdAt', {
            header: () => "Date",
        }),
    ], []);

    const filteredPayouts = useMemo(() => {
        return filter === 'all'
            ? payouts
            : (payouts as Payout[]).filter((p) => filter === 'pending' ? p.status !== 'paid' : p.status === 'paid');
    }, [filter, payouts]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filteredPayouts,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    const totalDisbursed = useMemo(() => {
        return (payouts as Payout[])
            .filter((p) => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
    }, [payouts]);

    const pendingPayoutsTotal = useMemo(() => {
        return (payouts as Payout[])
            .filter((p) => p.status !== 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
    }, [payouts]);

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <PageHeader
                title="Payouts"
                description={user?.role === 'farmer'
                    ? "Monitor individual payment streams and transaction history."
                    : "Manage and distribute payments to producers based on verified deliveries."}
                actions={
                    user?.role === 'platform_admin' && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const aggId = prompt("Enter Aggregation ID to export for CBE:");
                                    if (aggId) {
                                        window.open(`${import.meta.env.VITE_API_URL}/payouts/export/csv/${aggId}?method=bank_transfer`, '_blank');
                                    }
                                }}
                                className="h-10 px-6 bg-card border border-border text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-minimal hover:bg-background-soft transition-all flex items-center justify-center gap-2"
                            >
                                <span>🏦</span>
                                Export for CBE
                            </button>
                            <button
                                onClick={() => {
                                    const aggId = prompt("Enter Aggregation ID to export for Telebirr:");
                                    if (aggId) {
                                        window.open(`${import.meta.env.VITE_API_URL}/payouts/export/csv/${aggId}?method=telebirr`, '_blank');
                                    }
                                }}
                                className="h-10 px-6 bg-card border border-border text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-minimal hover:bg-background-soft transition-all flex items-center justify-center gap-2"
                            >
                                <span>📱</span>
                                Export for Telebirr
                            </button>
                            <button
                                onClick={() => setIsDistributeModalOpen(true)}
                                className="h-10 px-6 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <span>💸</span>
                                Process Payout
                            </button>
                        </div>
                    )
                }
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, Status, or Amount..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={3} /> : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard
                        title="Total Paid"
                        value={`ETB ${totalDisbursed.toLocaleString()}`}
                        icon="💰"
                        description="Processed successfully"
                    />
                    <StatCard
                        title="Pending"
                        value={`ETB ${pendingPayoutsTotal.toLocaleString()}`}
                        icon="⏳"
                        description="Verified/Awaiting"
                    />
                    <StatCard
                        title="Efficiency"
                        value="2 Days"
                        icon="⚡"
                        description="Average cycle time"
                    />
                </div>
            )}

            <div className="flex gap-8 border-b border-border/50">
                {['all', 'paid', 'pending'].map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setFilter(f as any);
                            table.setPageIndex(0);
                        }}
                        className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${filter === f ? 'text-primary' : 'text-muted-foreground/60 hover:text-foreground'
                            }`}
                    >
                        {f === 'all' ? 'All Transactions' : f === 'paid' ? 'Completed' : 'Pending'}
                        {filter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            {showFullLoader ? <SkeletonList rows={5} /> : (
                <div className="card-minimal overflow-hidden">
                    <PayoutsList table={table} navigate={navigate} userRole={user?.role} isLoading={isLoadingPayouts} />
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={filteredPayouts.length}
                        pageSize={pageSize}
                        onPageChange={(page) => table.setPageIndex(page - 1)}
                    />
                </div>
            )}

            <GlassModal
                isOpen={isDistributeModalOpen}
                onClose={() => setIsDistributeModalOpen(false)}
                title="Fund Distribution"
                maxWidth="max-w-2xl"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <button
                            onClick={() => setIsDistributeModalOpen(false)}
                            className="px-6 py-2 rounded-lg hover:bg-background-soft text-[10px] font-bold uppercase tracking-widest border border-border transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDistributePayout}
                            disabled={!selectedOrderId || isDistributing}
                            className="px-8 py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            {isDistributing ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Confirm Distribution</>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-10 py-2">
                    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 flex gap-6 items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl text-primary">
                            💸
                        </div>
                        <div className="space-y-1 flex-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Fund Distribution</p>
                            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                                Select a settled order. Proportional shares will be calculated for contributing farmers based on verified deliveries.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">
                            Available Settlements
                        </label>
                        {isLoadingOrders ? (
                            <div className="h-11 bg-background-soft/50 border border-border rounded-lg flex items-center px-4">
                                <span className="animate-pulse text-xs font-bold uppercase tracking-widest opacity-50">Syncing with network...</span>
                            </div>
                        ) : (
                            <select
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                                value={selectedOrderId}
                                onChange={(e) => setSelectedOrderId(e.target.value)}
                            >
                                <option value="">Select a settled order...</option>
                                {allOrders.map((order: any) => (
                                    <option key={order.id} value={order.id}>
                                        {order.id.substring(0, 8)} // {order.cropType?.name || 'Produce'} // ETB {order.totalPrice.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        )}
                        {allOrders.length === 0 && !isLoadingOrders && (
                            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest ml-1 mt-2">No settles available for distribution.</p>
                        )}
                    </div>
                </div>
            </GlassModal>
        </div>
    );
};
