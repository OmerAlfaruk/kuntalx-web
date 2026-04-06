import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { PageHeader, StatCard, Badge, TablePagination } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { apiClient } from '../../../lib/api-client';
import { useToast } from '../../../lib/toast-context';

type PaymentStatus = 'pending' | 'paid' | 'released' | 'refunded' | 'failed';

interface PaymentRecord {
    orderId: string;
    orderRef: string;
    buyerName: string;
    amount: number;
    paymentStatus: PaymentStatus | null;
    paymentMethod: string | null;
    transactionRef: string | null;
    paidAt: string | null;
    orderStatus: string;
    createdAt: string;
}

const statusVariant = (s: PaymentStatus | null): any => {
    switch (s) {
        case 'paid': return 'success';
        case 'released': return 'success';
        case 'pending': return 'warning';
        case 'failed': return 'error';
        case 'refunded': return 'outline';
        default: return 'outline';
    }
};

const usePaymentOrders = () =>
    useQuery<PaymentRecord[]>({
        queryKey: ['assoc-payment-orders'],
        queryFn: async () => {
            const orders = await apiClient.get<any[]>('/orders/');
            return orders.map((o: any) => ({
                orderId: o.id,
                orderRef: o.reference_code || o.id.substring(0, 8).toUpperCase(),
                buyerName: o.buyer_name || o.buyer?.business_name || 'Unknown Buyer',
                amount: o.total_price,
                paymentStatus: o.payment_status ?? o.payment?.status ?? null,
                paymentMethod: o.payment_method ?? o.payment?.payment_method ?? null,
                transactionRef: o.payment?.transaction_reference ?? null,
                paidAt: o.paid_at ?? o.payment?.paid_at ?? null,
                orderStatus: o.status,
                createdAt: o.created_at,
            }));
        },
    });

const useUpdatePaymentStatus = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, status, paymentMethod, transactionRef, paidAt }: {
            orderId: string,
            status: PaymentStatus,
            paymentMethod?: string,
            transactionRef?: string,
            paidAt?: string
        }) => {
            const payment = await apiClient.get<any>(`/payments/order/${orderId}`);
            return apiClient.put(`/payments/${payment.id}`, {
                status,
                payment_method: paymentMethod,
                transaction_reference: transactionRef,
                paid_at: paidAt
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assoc-payment-orders'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            toast.success('Payment status updated successfully');
        },
        onError: () => toast.error('Failed to update payment status'),
    });
};

export const PaymentTrackingPage = () => {
    const { data: payments = [], isLoading } = usePaymentOrders();
    const { mutate: updatePaymentStatus, isPending: isUpdating } = useUpdatePaymentStatus();
    const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'released'>('all');
    const [search, setSearch] = useState('');
    const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
    const [updateStatusVal, setUpdateStatusVal] = useState<PaymentStatus>('pending');
    const [updateMethodVal, setUpdateMethodVal] = useState<string>('');
    const [transactionRef, setTransactionRef] = useState('');
    const [updatePaidAtVal, setUpdatePaidAtVal] = useState<string>('');

    const filtered = useMemo(() => {
        return payments.filter(p => {
            const matchStatus = filter === 'all' ? true : (p.paymentStatus === filter);
            const matchSearch = search === '' ||
                p.buyerName.toLowerCase().includes(search.toLowerCase()) ||
                p.orderRef.toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [payments, filter, search]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filtered,
        columns: [],
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const { pageIndex, pageSize } = table.getState().pagination;
    const paginatedRows = table.getRowModel().rows;

    const totalPaid = payments.filter(p => p.paymentStatus === 'paid' || p.paymentStatus === 'released').reduce((sum, p) => sum + p.amount, 0);
    const pendingCount = payments.filter(p => !p.paymentStatus || p.paymentStatus === 'pending').length;
    const paidCount = payments.filter(p => p.paymentStatus === 'paid').length;

    if (isLoading) return (
        <div className="space-y-10">
            <div className="h-32 w-full bg-card rounded-xl animate-pulse" />
            <SkeletonList />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <PageHeader
                title="Payment Tracking"
                description="Monitor buyer settlement status across all orders linked to your association."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <StatCard title="Total Received" value={`ETB ${totalPaid.toLocaleString()}`} icon="💰" description="Across paid orders" />
                <StatCard title="Awaiting Payment" value={pendingCount.toString()} icon="⏳" description="Pending clearance" />
                <StatCard title="Confirmed Paid" value={paidCount.toString()} icon="✅" description="Buyer settled" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative flex-1 group max-w-4xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by buyer or order ref..."
                        className="w-full h-14 bg-background border border-border rounded-xl pl-12 pr-6 text-[13px] font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-background-soft border border-border rounded-xl p-1 h-14">
                    {(['all', 'pending', 'paid', 'released'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-minimal' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="card-minimal overflow-hidden">
                <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Payment Registry</h2>
                </div>

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-background-soft/50">
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order Ref</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Buyer</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Method</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Payment Status</th>
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Paid At</th>
                                <th className="px-10 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-10 py-24 text-center text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">No payment records found.</td></tr>
                            )}
                            {paginatedRows.map(row => {
                                const p = row.original;
                                return (
                                    <tr key={p.orderId} className="hover:bg-background-soft/50 transition-colors group">
                                        <td className="px-10 py-5 font-bold text-[13px] text-primary tracking-widest">#{p.orderRef}</td>
                                        <td className="px-10 py-5 text-[13px] font-bold text-foreground">{p.buyerName}</td>
                                        <td className="px-10 py-5 text-[13px] font-bold text-foreground tabular-nums">ETB {p.amount.toLocaleString()}</td>
                                        <td className="px-10 py-5 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">{p.paymentMethod?.replace('_', ' ') || '—'}</td>
                                        <td className="px-10 py-5">
                                            <Badge variant={statusVariant(p.paymentStatus)}>
                                                {p.paymentStatus || 'unpaid'}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-5 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-10 py-5 text-right">
                                            {p.paymentStatus === 'paid' ? (
                                                <div className="h-8 px-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center">
                                                    Locked in Escrow
                                                </div>
                                            ) : p.paymentStatus !== 'released' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayment(p);
                                                        setUpdateStatusVal(p.paymentStatus || 'pending');
                                                        setUpdateMethodVal(p.paymentMethod || '');
                                                        setTransactionRef(p.transactionRef || '');
                                                        setUpdatePaidAtVal(p.paidAt ? p.paidAt.split('T')[0] : '');
                                                    }}
                                                    className="h-8 px-4 rounded-lg bg-background border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all active:scale-95 shadow-minimal"
                                                >
                                                    Update Status
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">No payment records found.</div>
                    )}
                    {paginatedRows.map(row => {
                        const p = row.original;
                        return (
                            <div key={p.orderId} className="card-minimal p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[13px] text-primary tracking-widest leading-none">#{p.orderRef}</span>
                                    <Badge variant={statusVariant(p.paymentStatus)}>
                                        {p.paymentStatus || 'unpaid'}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-none">Buyer Account</p>
                                    <p className="font-bold text-[13px] text-foreground leading-none mt-1">{p.buyerName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 py-6 border-y border-border/30">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-none">Final Amount</p>
                                        <p className="font-bold text-[13px] text-foreground tabular-nums leading-none mt-1">ETB {p.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-none">Channel</p>
                                        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-none mt-1">{p.paymentMethod?.replace('_', ' ') || '—'}</p>
                                    </div>
                                </div>
                                {p.paymentStatus === 'paid' ? (
                                    <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[9px] font-bold text-center uppercase tracking-widest">
                                        Held in Escrow
                                    </div>
                                ) : p.paymentStatus !== 'released' && (
                                    <button
                                        onClick={() => {
                                            setSelectedPayment(p);
                                            setUpdateStatusVal(p.paymentStatus || 'pending');
                                            setUpdateMethodVal(p.paymentMethod || '');
                                            setTransactionRef(p.transactionRef || '');
                                            setUpdatePaidAtVal(p.paidAt ? p.paidAt.split('T')[0] : '');
                                        }}
                                        className="w-full h-11 rounded-xl bg-background border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all active:scale-95 shadow-minimal"
                                    >
                                        Update Settlement Status
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="px-10 py-6 border-t border-border/50 bg-background-soft/50">
                    <TablePagination
                        currentPage={pageIndex + 1}
                        totalPages={Math.ceil(filtered.length / pageSize) || 1}
                        totalRecords={filtered.length}
                        pageSize={pageSize}
                        onPageChange={(page) => table.setPageIndex(page - 1)}
                    />
                </div>
            </div>

            {selectedPayment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Update Settlement Status</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Manage payment validation state</p>
                        </div>
                        
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-background-soft p-5 rounded-2xl border border-border/50 flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    💰
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Order Ref #{selectedPayment.orderRef}</p>
                                    <p className="font-bold text-[14px] text-foreground tracking-tight">ETB {selectedPayment.amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">New Status</label>
                                    <div className="relative group/select">
                                        <select
                                            value={updateStatusVal}
                                            onChange={(e) => setUpdateStatusVal(e.target.value as PaymentStatus)}
                                            className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all uppercase appearance-none cursor-pointer"
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="paid">PAID</option>
                                            <option value="failed">FAILED</option>
                                            <option value="released">RELEASED</option>
                                            <option value="refunded">REFUNDED</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">⌵</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Payment Method</label>
                                    <div className="relative group/select">
                                        <select
                                            value={updateMethodVal}
                                            onChange={(e) => setUpdateMethodVal(e.target.value)}
                                            className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all uppercase appearance-none cursor-pointer"
                                        >
                                            <option value="">NOT SELECTED</option>
                                            <option value="telebirr">TELEBIRR</option>
                                            <option value="bank_transfer">BANK TRANSFER</option>
                                            <option value="chapa">CHAPA</option>
                                            <option value="cash_on_delivery">CASH ON DELIVERY</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">⌵</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Paid At Date</label>
                                    <input
                                        type="date"
                                        value={updatePaidAtVal}
                                        onChange={(e) => setUpdatePaidAtVal(e.target.value)}
                                        className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm font-bold text-muted-foreground focus:border-primary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Transaction Ref (Optional)</label>
                                    <input
                                        type="text"
                                        value={transactionRef}
                                        onChange={(e) => setTransactionRef(e.target.value)}
                                        placeholder="Bank receipt #, Telebirr id..."
                                        className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/30 focus:border-primary/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                            <button
                                onClick={() => setSelectedPayment(null)}
                                disabled={isUpdating}
                                className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedPayment) {
                                        updatePaymentStatus({
                                            orderId: selectedPayment.orderId,
                                            status: updateStatusVal,
                                            paymentMethod: updateMethodVal || undefined,
                                            transactionRef: transactionRef || undefined,
                                            paidAt: updatePaidAtVal ? new Date(updatePaidAtVal).toISOString() : undefined
                                        });
                                        setSelectedPayment(null);
                                    }
                                }}
                                disabled={isUpdating}
                                className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isUpdating ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : "Commit Status Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
