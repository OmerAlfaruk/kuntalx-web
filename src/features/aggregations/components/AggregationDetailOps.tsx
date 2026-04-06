import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AdaptiveDate } from '../../../shared/components/UI';
import { type Aggregation } from '../types/aggregation';
import { useDeleteAggregation } from '../hooks/use-aggregations';

interface AggregationDetailOpsProps {
    aggregation: Aggregation;
    user: any;
}

export const AggregationDetailOps: React.FC<AggregationDetailOpsProps> = ({ aggregation, user }) => {
    const navigate = useNavigate();
    const isBuyer = user?.role === 'buyer';
    const isFarmer = user?.role === 'farmer';
    const isOwner = user?.id === aggregation.ownerId;
    const isMiniFarmer = Boolean(isFarmer && user?.farmerData?.isMiniAssociation);
    
    const deleteMutation = useDeleteAggregation();

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this pool? This action cannot be undone.")) {
            try {
                await deleteMutation.mutateAsync(aggregation.id);
                navigate({ to: '/aggregations' });
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    return (
        <div className="space-y-16">
            {/* Actions */}
            <section className="space-y-10">
                <div className="flex items-center justify-between border-b border-border/50 pb-8">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Terminal Actions</h3>
                        <p className="font-bold text-lg text-foreground tracking-tight">Pool Operations</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {aggregation.status === 'collecting' && isFarmer && (
                        <button
                            onClick={() => navigate({ to: '/contribute/$poolId', params: { poolId: aggregation.id } } as any)}
                            className="w-full h-16 rounded-2xl bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-5 group active:scale-95"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
                            <span>Add Yours</span>
                        </button>
                    )}
                    {(aggregation.status === 'collecting' || aggregation.status === 'ready_for_sale') && isBuyer && (
                        <button
                            onClick={() => navigate({ to: '/place-order/$poolId', params: { poolId: aggregation.id } } as any)}
                            className="w-full h-16 rounded-2xl bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] shadow-minimal hover:opacity-90 transition-all flex items-center justify-center gap-5 group active:scale-95"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
                            <span>Order Now</span>
                        </button>
                    )}
                    {aggregation.contactPhone && (
                        <a
                            href={`tel:${aggregation.contactPhone}`}
                            className="w-full h-16 rounded-2xl border border-border bg-background-soft text-foreground text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-background shadow-minimal transition-all flex items-center justify-center gap-5 group active:scale-95"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
                            <span>Contact Admin</span>
                        </a>
                    )}
                    {isOwner && isMiniFarmer && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="w-full h-16 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-5 group disabled:opacity-50 active:scale-95"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🗑️</span>
                            <span>{deleteMutation.isPending ? 'Deleting...' : 'Terminate Pool'}</span>
                        </button>
                    )}
                </div>
            </section>

            {/* System Info */}
            <section className="space-y-10">
                <div className="flex items-center justify-between border-b border-border/50 pb-8">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Metadata Registry</h3>
                        <p className="font-bold text-lg text-foreground tracking-tight">System Identity</p>
                    </div>
                </div>

                <div className="card-minimal p-10 space-y-10 relative overflow-hidden group">
                    <div className="space-y-4">
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Registration Timestamp</p>
                        <p className="text-xl font-bold text-foreground uppercase tracking-tight">
                            <AdaptiveDate date={aggregation.createdAt} />
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Security Hash ID</p>
                        <div className="p-5 bg-background-soft rounded-xl border border-border/50 shadow-inner group-hover:border-primary/20 transition-colors">
                            <p className="text-[10px] font-mono text-primary font-bold break-all leading-relaxed tracking-widest uppercase">{aggregation.id}</p>
                        </div>
                    </div>

                    <div className="pt-6 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest leading-none">Cryptographic Verification Active</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
