import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, StatCard, TablePagination } from '../../../shared/components/UI';
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <PageHeader
                title="Payouts Dashboard"
                description={user?.role === 'farmer'
                    ? "Monitor payout history and transaction details."
                    : "Manage and distribute payouts to verified producers."}
                actions={
                    user?.role === 'platform_admin' && (
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    const aggId = prompt("Enter Aggregation ID to export for CBE:");
                                    if (aggId) {
                                        window.open(`${import.meta.env.VITE_API_URL}/payouts/export/csv/${aggId}?method=bank_transfer`, '_blank');
                                    }
                                }}
                                className="h-10 px-6 rounded-xl bg-background border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all flex items-center justify-center gap-2"
                            >
                                <span>🏦</span>
                                CBE Export
                            </button>
                            <button
                                onClick={() => {
                                    const aggId = prompt("Enter Aggregation ID to export for Telebirr:");
                                    if (aggId) {
                                        window.open(`${import.meta.env.VITE_API_URL}/payouts/export/csv/${aggId}?method=telebirr`, '_blank');
                                    }
                                }}
                                className="h-10 px-6 rounded-xl bg-background border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all flex items-center justify-center gap-2"
                            >
                                <span>📱</span>
                                Mobile Export
                            </button>
                            <button
                                onClick={() => setIsDistributeModalOpen(true)}
                                className="h-10 px-8 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>💸</span>
                                Execute Payout
                            </button>
                        </div>
                    )
                }
            />

            {/* Tactical Search HUD */}
            <div className="relative group max-w-4xl">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, status, or reference..."
                    className="w-full h-14 bg-background border border-border rounded-xl pl-16 pr-8 text-[13px] font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={3} /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard
                        title="Total Disbursed"
                        value={`ETB ${totalDisbursed.toLocaleString()}`}
                        icon="💰"
                        description="Verified distributed value."
                        delay={0.1}
                    />
                    <StatCard
                        title="Awaiting Sync"
                        value={`ETB ${pendingPayoutsTotal.toLocaleString()}`}
                        icon="⏳"
                        description="Pending processing runs."
                        delay={0.2}
                    />
                    <StatCard
                        title="Cycle Velocity"
                        value="1.8 Days"
                        icon="⚡"
                        description="Mean distribution frequency."
                        delay={0.3}
                    />
                </div>
            )}

            <div className="flex gap-10 border-b border-border/50 px-8">
                {['all', 'paid', 'pending'].map((f) => (
                    <button
                        key={f}
                        onClick={() => {
                            setFilter(f as any);
                            table.setPageIndex(0);
                        }}
                        className={`pb-5 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === f ? 'text-primary' : 'text-muted-foreground/30 hover:text-foreground'
                            }`}
                    >
                        {f === 'all' ? 'All Transactions' : f === 'paid' ? 'Completed' : 'Awaiting'}
                        {filter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />}
                    </button>
                ))}
            </div>

            {showFullLoader ? <SkeletonList rows={5} /> : (
                <div className="card-minimal overflow-hidden">
                    <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Payout History</h2>
                    </div>
                    <div className="p-0">
                        <PayoutsList table={table} navigate={navigate} userRole={user?.role} isLoading={isLoadingPayouts} />
                        <div className="px-10 py-6 border-t border-border/50">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={filteredPayouts.length}
                                pageSize={pageSize}
                                onPageChange={(page) => table.setPageIndex(page - 1)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Execute Payout Modal */}
            {isDistributeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Execute Payout Run</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Initialize capital flow to producer accounts</p>
                        </div>
                        
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-6 items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl shrink-0">
                                    💸
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Processing Engine</p>
                                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                        Select a fully settled aggregation sequence. Proportional shares will be automatically calculated and distributed to all contributing producers.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    Target Aggregation / Order
                                </label>
                                {isLoadingOrders ? (
                                    <div className="h-12 bg-background-soft border border-border/50 rounded-xl flex items-center px-4">
                                        <span className="animate-pulse text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loading settled orders...</span>
                                    </div>
                                ) : (
                                    <div className="relative group/select">
                                        <select
                                            className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all cursor-pointer appearance-none"
                                            value={selectedOrderId}
                                            onChange={(e) => setSelectedOrderId(e.target.value)}
                                        >
                                            <option value="">Select settled order...</option>
                                            {allOrders.map((order: any) => (
                                                <option key={order.id} value={order.id}>
                                                    ORD_{order.id.substring(0, 8).toUpperCase()} • {order.cropType?.name || 'PRODUCE'} • ETB {order.totalPrice.toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">⌵</div>
                                    </div>
                                )}
                                {allOrders.length === 0 && !isLoadingOrders && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-rose-500/5 border border-rose-500/20 rounded-xl mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        <p className="text-[11px] text-rose-500 font-bold uppercase tracking-widest">No pending payouts available for processing.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                            <button
                                onClick={() => setIsDistributeModalOpen(false)}
                                disabled={isDistributing}
                                className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDistributePayout}
                                disabled={!selectedOrderId || isDistributing}
                                className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDistributing ? (
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm Distribution"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
