import { useNavigate, useParams } from '@tanstack/react-router';
import { KuntalXIconLite } from '../../../shared/components/Logo';
import { SkeletonDetail } from '../../../shared/components/Skeletons';
import { useOrderDetails, useUpdateOrderStatus, useInitiatePayment, useVerifyPayment } from '../hooks/use-orders';
import { ShipmentFormDialog } from '../../shipments/components/ShipmentFormDialog';
import { useState, useCallback } from 'react';
import { useAuth } from '../../../lib/auth-context';
import type { OrderStatus } from '../types/order';

export const OrderDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: order, isLoading } = useOrderDetails(id);
    const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

    const { mutateAsync: initiatePayment, isPending: isInitiating } = useInitiatePayment();
    const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string>('telebirr');
    const [transactionId, setTransactionId] = useState('');
    const [paymentResponse, setPaymentResponse] = useState<any>(null);
    const [isSimulatingWebview, setIsSimulatingWebview] = useState(false);
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

    const handleStatusUpdate = useCallback(async (newStatus: OrderStatus) => {
        if (!order) return;
        try {
            await updateStatus({ id: order.id, status: newStatus });
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status. Please check constraints (e.g., payment status).');
        }
    }, [order, updateStatus]);

    const handleInitiatePayment = useCallback(async () => {
        if (!order) return;
        try {
            const response = await initiatePayment({ orderId: order.id, method: selectedMethod, transactionRef: transactionId });
            setPaymentResponse(response);
            setIsPaymentModalOpen(false);

            if (selectedMethod === 'cash_on_delivery') {
                alert('Payment marked as Pending (Cash on Delivery). The association will update status upon receipt.');
            } else if (selectedMethod === 'bank_transfer') {
                alert('Bank Transfer submitted! The association will verify your receipt number and mark the order as Paid.');
            } else {
                setIsSimulatingWebview(true);
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Failed to initiate payment. Please try again.');
        }
    }, [order, selectedMethod, transactionId, initiatePayment]);

    const handleVerifyPayment = useCallback(async () => {
        try {
            // Use the simulation confirm endpoint — calls /payments/simulate-confirm/{reference}
            // which only works when PAYMENT_SIMULATION_MODE=True on the backend
            await verifyPayment(paymentResponse.reference);
            setIsSimulatingWebview(false);
            setPaymentResponse(null);
        } catch (error) {
            console.error('Simulation confirm failed:', error);
            alert('Payment confirmation failed. Ensure PAYMENT_SIMULATION_MODE=True on the backend.');
        }
    }, [paymentResponse, verifyPayment]);

    if (isLoading) {
        return <SkeletonDetail />;
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
                <div className="w-16 h-16 bg-background-soft rounded-full flex items-center justify-center text-2xl mb-6">📦</div>
                <h2 className="text-xl font-bold mb-2">Order not found</h2>
                <p className="text-sm text-muted-foreground mb-8">The requested order record could not be synced.</p>
                <button
                    onClick={() => navigate({ to: '/orders' })}
                    className="h-10 px-6 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    const serviceFee = (order?.totalPrice || 0) * 0.04;
    const finalTotal = (order?.totalPrice || 0) + serviceFee;

    // Tracking steps mapping
    const steps = [
        { label: 'Submitted', status: 'pending' },
        { label: 'Accepted', status: 'accepted' },
        { label: 'In Progress', status: 'in_progress' },
        { label: 'In Transit', status: 'in_transit' },
        { label: 'Delivered', status: 'delivered' },
        { label: 'Completed', status: 'fulfilled' },
    ];

    const currentStatus = order.status;
    const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

    return (
        <>
        <div className="space-y-12 animate-in fade-in duration-500 pb-12 print:hidden">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border shadow-minimal hover:bg-background-soft transition-all"
                    >
                        ←
                    </button>
                    <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Overview</h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                {currentStatus.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                            Order ID: {order.id.slice(0, 16).toUpperCase()} • Reference: <span className="text-primary font-bold tracking-widest">{order.referenceCode || 'PENDING'}</span> • Submitted {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 no-print">
                    {user?.role === 'buyer' && (currentStatus === 'pending' || currentStatus === 'accepted') && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => handleStatusUpdate('cancelled' as OrderStatus)}
                                disabled={isUpdating}
                                className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-rose-200 text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                            >
                                Cancel Order
                            </button>

                            {currentStatus === 'accepted' && (!order.paymentStatus || (order.paymentStatus !== 'paid' && order.paymentStatus !== 'released')) && (
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg shadow-minimal hover:bg-primary/90 transition-all"
                                >
                                    Fulfill Payment
                                </button>
                            )}
                        </div>
                    )}

                    {user?.role === 'association_admin' && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                            {currentStatus === 'pending' && (
                                <>
                                    {/* Admin can accept/reject regardless of payment — payment is required for ACCEPTED → IN_PROGRESS */}
                                    <button
                                        onClick={() => handleStatusUpdate('accepted')}
                                        disabled={isUpdating}
                                        className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-white rounded-lg shadow-minimal hover:bg-emerald-600 transition-all"
                                    >
                                        Accept Order
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('rejected')}
                                        disabled={isUpdating}
                                        className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-rose-200 text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}

                            {currentStatus === 'accepted' && (
                                <>
                                    {order.paymentStatus?.toLowerCase() === 'paid' ? (
                                        <button
                                            onClick={() => handleStatusUpdate('in_progress')}
                                            disabled={isUpdating}
                                            className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg shadow-minimal hover:bg-primary/90 transition-all"
                                        >
                                            Start Processing
                                        </button>
                                    ) : (
                                        <div className="h-10 px-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-2 text-orange-600">
                                            <span className="text-sm">⚠️</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Buyer Payment</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {currentStatus === 'in_progress' && (
                                <button
                                    onClick={() => setIsShipmentModalOpen(true)}
                                    className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest bg-indigo-500 text-white rounded-lg shadow-minimal hover:bg-indigo-600 transition-all"
                                >
                                    Dispatch Shipment
                                </button>
                            )}

                            {currentStatus === 'in_transit' && (
                                <button
                                    onClick={() => handleStatusUpdate('delivered')}
                                    disabled={isUpdating}
                                    className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest bg-teal-500 text-white rounded-lg shadow-minimal hover:bg-teal-600 transition-all"
                                >
                                    Confirm Delivery
                                </button>
                            )}

                            {currentStatus === 'delivered' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate({ to: `/payout-distribution/${order.id}` as any })}
                                        className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white rounded-lg shadow-minimal hover:bg-amber-600 transition-all"
                                    >
                                        Distribute Payouts
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('fulfilled')}
                                        disabled={isUpdating}
                                        className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-emerald-500/20 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                                    >
                                        Archive
                                    </button>
                                </div>
                            )}

                            {/* Payout distribution only available after order is fulfilled */}
                            {currentStatus === 'fulfilled' && order.paymentStatus?.toLowerCase() === 'paid' && (
                                <button
                                    onClick={() => navigate({ to: `/payout-distribution/${order.id}` as any })}
                                    className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-white rounded-lg shadow-minimal hover:bg-amber-600 transition-all"
                                >
                                    View Payout Distribution
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card-minimal p-6 space-y-2 text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Total Value</p>
                            <p className="text-xl font-bold tracking-tight">ETB {(order.totalPrice || 0).toLocaleString()}</p>
                        </div>
                        <div className="card-minimal p-6 space-y-2 text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Volume</p>
                            <p className="text-xl font-bold tracking-tight">{order.requestedQuantityKuntal.toLocaleString()} QT</p>
                        </div>
                        <div className="card-minimal p-6 space-y-2 text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Unit Price</p>
                            <p className="text-xl font-bold tracking-tight">ETB {(order.pricePerKuntal || 0).toLocaleString()}</p>
                        </div>
                        <div className="card-minimal p-6 space-y-2 text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Pool ID</p>
                            <p className="text-sm font-mono font-bold text-primary truncate">#{order.aggregationId?.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Transaction Core — visible to all roles */}
                    <div className="card-minimal p-8 space-y-8 text-left">
                        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transaction Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Buyer sees: who they're buying from (seller) */}
                            {user?.role === 'buyer' && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Seller / Association</p>
                                    <p className="font-bold text-sm uppercase tracking-tight">{order.aggregation?.associationName || order.aggregation?.sellerName || 'N/A'}</p>
                                    {order.aggregation?.sellerPhone && (
                                        <p className="text-xs text-muted-foreground font-mono">{order.aggregation.sellerPhone}</p>
                                    )}
                                    {order.aggregation?.region && (
                                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">{order.aggregation.region}</p>
                                    )}
                                </div>
                            )}

                            {/* Seller sees: who is buying from them (buyer) */}
                            {(user?.role === 'association_admin' || user?.role === 'farmer') && (
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Buyer</p>
                                    <p className="font-bold text-sm uppercase tracking-tight">{order.buyerName || 'Verified Buyer'}</p>
                                    {order.buyerPhone && (
                                        <p className="text-xs text-muted-foreground font-mono">{order.buyerPhone}</p>
                                    )}
                                    {order.buyerEmail && (
                                        <p className="text-[10px] text-muted-foreground/60">{order.buyerEmail}</p>
                                    )}
                                </div>
                            )}

                            {/* Platform admin sees both */}
                            {user?.role === 'platform_admin' && (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Buyer</p>
                                        <p className="font-bold text-sm uppercase tracking-tight">{order.buyerName || 'Verified'}</p>
                                        {order.buyerPhone && <p className="text-xs font-mono text-muted-foreground">{order.buyerPhone}</p>}
                                        <p className="text-[9px] font-mono text-muted-foreground/30 break-all">{order.buyerId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Seller / Association</p>
                                        <p className="font-bold text-sm uppercase tracking-tight">{order.aggregation?.associationName || order.aggregation?.sellerName || 'N/A'}</p>
                                        {order.aggregation?.sellerPhone && <p className="text-xs font-mono text-muted-foreground">{order.aggregation.sellerPhone}</p>}
                                    </div>
                                </>
                            )}

                            {/* Product info — always shown */}
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Product</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-sm text-[9px] font-bold uppercase tracking-widest">{order.aggregation?.cropTypeName || 'PRODUCE'}</span>
                                    <p className="font-bold text-sm truncate uppercase tracking-tight">{order.aggregation?.title || 'Unknown Product'}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Submission Date</p>
                                <p className="font-bold text-sm uppercase tracking-tight">{new Date(order.createdAt).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="card-minimal p-8 space-y-8 text-left">
                        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Requirements</h3>
                        </div>
                        <div className="bg-background-soft/50 p-6 rounded-xl border border-border/50">
                            <p className="text-sm font-medium leading-relaxed text-muted-foreground/80 lowercase first-letter:uppercase">
                                {order.qualityRequirements || 'Standard platform quality protocols apply. No additional criteria identified.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="card-minimal p-8 space-y-10 text-left">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline</h3>
                        <div className="space-y-8 relative">
                            <div className="absolute left-[7px] top-6 bottom-4 w-px bg-border/40"></div>
                            {steps.map((step, idx) => {
                                const isDone = currentStatus === step.status || currentStepIndex > steps.findIndex(s => s.status === step.status);
                                const isCurrent = currentStepIndex === steps.findIndex(s => s.status === step.status);

                                return (
                                    <div key={idx} className={`relative flex gap-6 pb-2 last:pb-0 ${!isDone && !isCurrent ? 'opacity-30' : ''}`}>
                                        <div className={`w-4 h-4 rounded-full border-2 bg-background relative z-10 mt-0.5 transition-all ${isCurrent ? 'border-primary' : isDone ? 'border-primary bg-primary' : 'border-border'}`}></div>
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent || isDone ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                                {isDone ? 'Finished' : isCurrent ? 'Active' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card-minimal p-6 text-left">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-60">System Log</p>
                        <p className="text-[9px] font-mono text-muted-foreground/40 break-all leading-tight uppercase font-bold">
                            ORD_{order.id.replace(/-/g, '').toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals & Components */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight">Payment Channel</h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'telebirr', name: 'Telebirr', icon: '📱' },
                                { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
                                { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: '💵' },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`w-full h-14 px-6 border rounded-xl flex items-center gap-4 transition-all ${selectedMethod === method.id ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:bg-background-soft'}`}
                                >
                                    <span className="text-xl">{method.icon}</span>
                                    <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{method.name}</span>
                                    {selectedMethod === method.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {selectedMethod === 'bank_transfer' && (
                            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4 text-left animate-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Bank Transfer Instructions</p>
                                    <button 
                                        onClick={() => window.print()} 
                                        className="h-7 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                        Print Slip
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</span>
                                        <span className="text-xs font-bold font-mono">CBE</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-blue-100/50">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</span>
                                        <span className="text-xs font-bold font-mono tracking-widest">{order.aggregation?.associationCbeAccount || 'Contact Association'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Transfer Reference</span>
                                        <span className="text-sm font-bold text-primary font-mono tracking-widest">{order.referenceCode}</span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-blue-500/70 font-medium leading-relaxed italic">
                                    Include the Transfer Reference in your bank transaction. Association will verify against this code.
                                </p>
                            </div>
                        )}

                        {/* Transaction ID Input for Bank Transfer */}
                        {selectedMethod === 'bank_transfer' && (
                            <div className="space-y-2 pb-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Bank Receipt # / Transaction ID</label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter receipt number (e.g., FT23904...)"
                                    className="w-full h-11 bg-card border border-border rounded-xl px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all uppercase"
                                />
                                <p className="text-[9px] text-muted-foreground italic ml-1 font-medium">Required to verify your offline settlement.</p>
                            </div>
                        )}

                        <div className="p-6 bg-background-soft border border-border/50 rounded-xl space-y-4 text-left">
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-60">
                                <span>Subtotal</span>
                                <span>ETB {order.totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                                <span>Service Fee</span>
                                <span>+ ETB {serviceFee.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-border/50 flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">ETB {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleInitiatePayment}
                            disabled={isInitiating || (selectedMethod === 'bank_transfer' && !transactionId.trim())}
                            className="w-full h-14 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {isInitiating ? 'Initializing...' : (selectedMethod === 'bank_transfer' ? 'Submit Proof of Payment' : 'Authorize Transaction')}
                        </button>
                    </div>
                </div>
            )}

            {isSimulatingWebview && paymentResponse && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-md border border-border rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Telebirr/Chapa Style Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                            <line x1="1" y1="10" x2="23" y2="10"></line>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-wide">{selectedMethod === 'telebirr' ? 'Telebirr' : 'Chapa'}</p>
                                        <p className="text-xs opacity-80">Secure Payment</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsSimulatingWebview(false)} className="text-white/80 hover:text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs opacity-80 uppercase tracking-wider">Amount to Pay</p>
                                <p className="text-3xl font-black">ETB {finalTotal.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+251</span>
                                    <input
                                        type="tel"
                                        placeholder="9XX XXX XXX"
                                        className="w-full h-12 pl-16 pr-4 bg-background border-2 border-border rounded-xl text-sm font-bold focus:border-primary focus:outline-none transition-all"
                                        maxLength={9}
                                    />
                                </div>
                            </div>

                            {selectedMethod === 'telebirr' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">PIN</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your 4-digit PIN"
                                        className="w-full h-12 px-4 bg-background border-2 border-border rounded-xl text-sm font-bold focus:border-primary focus:outline-none transition-all"
                                        maxLength={4}
                                    />
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="p-4 bg-background-soft rounded-xl space-y-3 border border-border/50">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Payment Summary</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Order Amount</span>
                                        <span className="font-bold">ETB {order.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service Fee</span>
                                        <span className="font-bold">ETB {serviceFee.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-2 border-t border-border flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-black text-primary">ETB {finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reference */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    <span className="font-bold">Ref:</span> {paymentResponse.reference}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleVerifyPayment}
                                    disabled={isVerifying}
                                    className="w-full h-14 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-wide shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isVerifying ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Pay Now'}
                                </button>
                                <button
                                    onClick={() => setIsSimulatingWebview(false)}
                                    className="w-full h-12 bg-background border border-border text-foreground rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-muted/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                                <svg className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Your payment is secured with end-to-end encryption. This is a test environment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {order && (
                <ShipmentFormDialog
                    isOpen={isShipmentModalOpen}
                    onClose={() => setIsShipmentModalOpen(false)}
                    order={order}
                />
            )}

            {/* Footer Status */}
            <div className="pt-10 border-t border-border/40 flex justify-between items-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                <p>KuntalX System</p>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Verified
                </div>
            </div>
        </div>

        {/* Printable Bank Slip (Hidden from screen, visible on print) */}
        <div className="hidden print:block bg-white text-black p-8 max-w-2xl mx-auto border-2 border-dashed border-gray-300 font-sans mt-8">
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <KuntalXIconLite className="h-16 w-auto" />
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">KuntalX</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Official Payment Slip</p>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Bank Transfer</h2>
                    <p className="text-sm font-bold text-gray-500">{new Date().toLocaleDateString()}</p>
                    <p className="font-mono text-[10px] font-bold mt-2">ORD_{order.id.split('-').pop()?.toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">Pay To (Beneficiary)</h3>
                        <p className="font-bold text-lg leading-tight uppercase relative"><span className="absolute -left-5 top-0.5 text-sm"></span>{order.aggregation?.associationName || 'Association'}</p>
                        <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">CBE Account Number</p>
                            <p className="font-mono text-xl font-black tracking-widest">{order.aggregation?.associationCbeAccount || 'CONTACT ADMIN'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">Payment Reference</h3>
                        <div className="mt-1 inline-block pb-1">
                            <p className="font-mono text-xl font-black tracking-widest py-1 px-3 border-2 border-black">{order.referenceCode}</p>
                        </div>
                        <p className="text-[10px] font-bold italic mt-2 text-gray-600 leading-tight">⚠️ MUST include this exact reference <br/>code in the bank transfer reason/remark.</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">From (Buyer)</h3>
                        <p className="font-bold text-lg leading-tight uppercase">{order.buyerName || 'Verified Buyer'}</p>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-200 pb-1">Order Details</h3>
                        <div className="space-y-3 mt-3">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                <span className="text-[10px] font-bold uppercase text-gray-500">Product</span>
                                <span className="text-sm font-bold uppercase text-right max-w-[150px] truncate">{order.aggregation?.title || 'Agricultural Produce'}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                                <span className="text-[10px] font-bold uppercase text-gray-500">Volume</span>
                                <span className="text-sm font-bold">{order.requestedQuantityKuntal.toLocaleString()} Quintals (QT)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t-4 border-black pt-6">
                <div className="flex justify-end">
                    <div className="w-1/2 space-y-2">
                        <div className="flex justify-between text-sm font-bold text-gray-500">
                            <span>Subtotal</span>
                            <span>ETB {(order.totalPrice || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-gray-500">
                            <span>Service Fee (4%)</span>
                            <span>ETB {(serviceFee || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-end pt-3 border-t-2 border-gray-200">
                            <span className="text-sm font-black uppercase tracking-widest">Total Amount Due</span>
                            <span className="text-2xl font-black">ETB {(finalTotal || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest border-t border-gray-200 pt-6">
                <p>This is a system-generated instruction slip. It is not a receipt of payment.</p>
                <p className="mt-1">The association administrative team will verify the transfer against the provided reference code.</p>
            </div>
        </div>
        </>
    );
};

