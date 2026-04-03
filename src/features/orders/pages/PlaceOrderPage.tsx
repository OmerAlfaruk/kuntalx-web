import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useAggregationDetail } from '../../aggregations/hooks/use-aggregations';
import { useCreateOrder } from '../hooks/use-orders';
import { KuntalLoader } from '../../../shared/components/UI';

export const PlaceOrderPage = () => {
    const { poolId } = useParams({ from: '/app/place-order/$poolId' });
    const navigate = useNavigate();

    const { data: pool, isLoading } = useAggregationDetail(poolId);
    const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

    const [orderForm, setOrderForm] = useState({
        quantity: 0,
        requirements: '',
        deliveryWindowStart: '',
        deliveryWindowEnd: ''
    });

    if (isLoading || !pool) {
        return <KuntalLoader />;
    }

    const pricePerKuntal = pool.pricePerKuntal || 5000;
    // Use backend-provided available_quantity which accounts for accepted/in-progress orders.
    // Fall back to totalQuantityKuntal only if availableQuantity is not returned.
    const maxAvailable = pool.availableQuantity ?? pool.totalQuantityKuntal ?? 0;

    const baseTotal = orderForm.quantity * pricePerKuntal;
    const serviceFee = baseTotal * 0.04;
    const finalTotal = baseTotal + serviceFee;

    const handlePlaceOrder = async () => {
        if (orderForm.quantity <= 0 || !orderForm.deliveryWindowStart || !orderForm.deliveryWindowEnd) {
            alert('Please fill out all required fields including quantity and delivery windows.');
            return;
        }

        try {
            await createOrder({
                aggregationId: pool.id,
                requestedQuantityKuntal: orderForm.quantity,
                pricePerKuntal: pricePerKuntal,
                deliveryWindowStart: new Date(orderForm.deliveryWindowStart).toISOString(),
                deliveryWindowEnd: new Date(orderForm.deliveryWindowEnd).toISOString(),
                qualityRequirements: orderForm.requirements
            });

            // Navigate to orders to see the new pending contract
            navigate({ to: '/orders' });
        } catch (error) {
            console.error('Failed to create contract:', error);
            alert('Failed to initiate order. Please try again.');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-4">
                <button
                    onClick={() => navigate({ to: '/aggregations' })}
                    className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    <span className="mr-2">←</span> Back to Aggregations
                </button>
                <h1 className="text-3xl font-bold text-foreground tracking-tight uppercase">Order Details</h1>
            </div>

            {/* Aggregation Summary Card */}
            <div className="card-minimal p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-background-soft rounded-lg flex items-center justify-center text-2xl border border-border">
                    🌾
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-foreground uppercase">{pool.title || 'Aggregation Batch'}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">
                        Available Stock: <span className="text-foreground">{maxAvailable.toLocaleString()} Kuntal</span>
                    </p>
                </div>
            </div>

            {/* Order Information */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Order Information</h3>
                <div className="card-minimal p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block opacity-60 ml-1">Quantity (Kuntal)</label>
                            <input
                                type="number"
                                className="w-full h-10 bg-background border border-border rounded-lg px-4 font-bold text-foreground outline-none focus:border-primary/50 transition-all text-sm"
                                value={orderForm.quantity || ''}
                                onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                                max={maxAvailable}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block opacity-60 ml-1">Rate per Kuntal</label>
                            <div className="w-full h-10 bg-background-soft border border-border rounded-lg px-4 font-bold text-foreground flex items-center text-sm uppercase opacity-70">
                                ETB {pricePerKuntal.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Window */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Delivery Window</h3>
                <div className="card-minimal p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block opacity-50 ml-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full h-10 bg-background border border-border rounded-lg px-4 font-bold text-foreground outline-none focus:border-primary/50 transition-all text-xs uppercase"
                                value={orderForm.deliveryWindowStart}
                                onChange={(e) => setOrderForm({ ...orderForm, deliveryWindowStart: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block opacity-50 ml-1">End Date</label>
                            <input
                                type="date"
                                className="w-full h-10 bg-background border border-border rounded-lg px-4 font-bold text-foreground outline-none focus:border-primary/50 transition-all text-xs uppercase"
                                value={orderForm.deliveryWindowEnd}
                                onChange={(e) => setOrderForm({ ...orderForm, deliveryWindowEnd: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Requirements */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Quality Requirements</h3>
                <textarea
                    className="w-full h-28 bg-background border border-border rounded-xl p-4 text-xs font-bold text-foreground outline-none focus:border-primary/50 transition-all resize-none placeholder:opacity-30"
                    placeholder="Enter specific quality standards or requirements..."
                    value={orderForm.requirements}
                    onChange={(e) => setOrderForm({ ...orderForm, requirements: e.target.value })}
                />
            </div>

            {/* Checkout Summary */}
            <div className="bg-background-soft p-8 rounded-xl border border-border space-y-6">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    <span>Base Value</span>
                    <span className="text-foreground">ETB {baseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    <span>Service Fee (4%)</span>
                    <span>+ ETB {serviceFee.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-border flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Final Total</span>
                    <span className="text-4xl font-bold text-primary tracking-tighter">ETB {finalTotal.toLocaleString()}</span>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={handlePlaceOrder}
                disabled={isCreatingOrder || orderForm.quantity <= 0 || orderForm.quantity > maxAvailable}
                className="w-full h-12 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-30"
            >
                {isCreatingOrder ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};

