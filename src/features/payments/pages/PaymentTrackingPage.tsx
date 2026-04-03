import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { PageHeader, StatCard, Badge, GlassModal, TablePagination } from '../../../shared/components/UI';
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
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Payment Tracking"
                description="Monitor buyer payment status across all orders linked to your association."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                <StatCard title="Total Received" value={`ETB ${totalPaid.toLocaleString()}`} icon="💰" description="Across paid orders" />
                <StatCard title="Awaiting Payment" value={pendingCount.toString()} icon="⏳" description="Pending clearance" />
                <StatCard title="Confirmed Paid" value={paidCount.toString()} icon="✅" description="Buyer settled" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by buyer or order ref..."
                        className="w-full h-11 bg-card border border-border/50 rounded-xl pl-11 pr-4 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-card border border-border/50 rounded-xl p-1 h-11">
                    {(['all', 'pending', 'paid', 'released'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 sm:px-4 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="text-sm font-extrabold text-foreground uppercase tracking-tight italic">Payment Registry</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 mt-0.5">Buyer Settlement Status</p>
                </div>

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order Ref</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Payment Status</th>
                                <th className="px-6 py-4">Paid At</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-16 text-center text-muted-foreground text-sm">No payment records found.</td></tr>
                            )}
                            {paginatedRows.map(row => {
                                const p = row.original;
                                return (
                                    <tr key={p.orderId} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[11px] font-bold text-primary">#{p.orderRef}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-foreground">{p.buyerName}</td>
                                        <td className="px-6 py-4 text-sm font-extrabold text-foreground">ETB {p.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-muted-foreground capitalize">{p.paymentMethod?.replace('_', ' ') || '—'}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={statusVariant(p.paymentStatus)} className="text-[10px] font-extrabold uppercase">
                                                {p.paymentStatus || 'unpaid'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] text-muted-foreground">
                                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.paymentStatus === 'paid' ? (
                                                <div className="h-8 px-3 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                                                    Locked in Escrow (123)
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
                                                    className="h-8 px-3 rounded-lg border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wider hover:bg-primary/5 transition-all"
                                                >
                                                    Update →
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
                <div className="md:hidden space-y-4 p-4 bg-muted/5">
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-muted-foreground text-sm">No payment records found.</div>
                    )}
                    {paginatedRows.map(row => {
                        const p = row.original;
                        return (
                            <div key={p.orderId} className="bg-card border border-border/60 rounded-xl p-4 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] font-bold text-primary">#{p.orderRef}</span>
                                    <Badge variant={statusVariant(p.paymentStatus)} className="text-[10px] font-extrabold uppercase">
                                        {p.paymentStatus || 'unpaid'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Buyer</p>
                                    <p className="font-bold text-sm text-foreground">{p.buyerName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 py-2 border-y border-border/40">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Amount</p>
                                        <p className="font-extrabold text-sm">ETB {p.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Method</p>
                                        <p className="text-sm font-bold capitalize">{p.paymentMethod?.replace('_', ' ') || '—'}</p>
                                    </div>
                                </div>
                                {p.paymentStatus === 'paid' ? (
                                    <div className="w-full py-2 px-3 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[9px] font-bold text-center">
                                        Funds Held in Escrow (Account 123)
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
                                            className="w-full h-9 rounded-lg border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wider"
                                        >
                                            Update Status →
                                        </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <TablePagination
                    currentPage={pageIndex + 1}
                    totalPages={Math.ceil(filtered.length / pageSize) || 1}
                    totalRecords={filtered.length}
                    pageSize={pageSize}
                    onPageChange={(page) => table.setPageIndex(page - 1)}
                />
            </div>

            {/* Update Status Modal */}
            <GlassModal
                isOpen={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
                title="Update Payment Status"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => setSelectedPayment(null)}
                            disabled={isUpdating}
                            className="h-10 flex-1 rounded-lg border border-border text-[10px] font-bold uppercase text-muted-foreground hover:bg-muted/10 transition-all"
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
                            className="h-10 flex-[2] rounded-lg bg-primary text-white text-[10px] font-bold uppercase shadow-sm hover:bg-primary/90 transition-all"
                        >
                            Save Status →
                        </button>
                    </div>
                }
            >
                {selectedPayment && (
                    <div className="space-y-6 py-4">
                        <div className="bg-muted/30 p-5 rounded-xl border border-border space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-70">Payment Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Order Ref</p>
                                    <p className="font-mono text-sm font-bold text-foreground">#{selectedPayment.orderRef}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Amount</p>
                                    <p className="font-extrabold text-foreground">ETB {selectedPayment.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">New Status</label>
                                <select
                                    value={updateStatusVal}
                                    onChange={(e) => setUpdateStatusVal(e.target.value as PaymentStatus)}
                                    className="w-full h-11 bg-card border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all uppercase appearance-none"
                                >
                                    <option value="pending">PENDING</option>
                                    <option value="paid">PAID</option>
                                    <option value="failed">FAILED</option>
                                    <option value="released">RELEASED</option>
                                    <option value="refunded">REFUNDED</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Payment Method</label>
                                <select
                                    value={updateMethodVal}
                                    onChange={(e) => setUpdateMethodVal(e.target.value)}
                                    className="w-full h-11 bg-card border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all uppercase appearance-none"
                                >
                                    <option value="">NOT SELECTED</option>
                                    <option value="telebirr">TELEBIRR</option>
                                    <option value="bank_transfer">BANK TRANSFER</option>
                                    <option value="chapa">CHAPA</option>
                                    <option value="cash_on_delivery">CASH ON DELIVERY</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Paid At Date</label>
                                <input
                                    type="date"
                                    value={updatePaidAtVal}
                                    onChange={(e) => setUpdatePaidAtVal(e.target.value)}
                                    className="w-full h-11 bg-card border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Transaction Ref (Optional)</label>
                                <input
                                    type="text"
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    placeholder="Bank receipt #, Telebirr id..."
                                    className="w-full h-11 bg-card border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </GlassModal>
        </div>
    );
};
