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
        <div className="space-y-12">
            {/* Actions */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Actions</h3>
                    <div className="h-px bg-border/40 flex-1" />
                </div>
                <div className="space-y-4">
                    {aggregation.status === 'collecting' && isFarmer && (
                        <button
                            onClick={() => navigate({ to: '/contribute/$poolId', params: { poolId: aggregation.id } } as any)}
                            className="w-full h-16 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-4 group"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
                            <span>Add Yours</span>
                        </button>
                    )}
                    {(aggregation.status === 'collecting' || aggregation.status === 'ready_for_sale') && isBuyer && (
                        <button
                            onClick={() => navigate({ to: '/place-order/$poolId', params: { poolId: aggregation.id } } as any)}
                            className="w-full h-16 rounded-xl bg-foreground text-background text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:opacity-90 transition-all flex items-center justify-center gap-4 group"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
                            <span>Order Now</span>
                        </button>
                    )}
                    {aggregation.contactPhone && (
                        <a
                            href={`tel:${aggregation.contactPhone}`}
                            className="w-full h-14 rounded-xl border border-border bg-card text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all flex items-center justify-center gap-4 group"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">📞</span>
                            <span>Contact Admin</span>
                        </a>
                    )}
                    {isOwner && isMiniFarmer && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="w-full h-14 rounded-xl border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">🗑️</span>
                            <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete Pool'}</span>
                        </button>
                    )}
                </div>
            </section>

            {/* System Info */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">System Info</h3>
                    <div className="h-px bg-border/40 flex-1" />
                </div>
                <div className="card-minimal p-8 space-y-8 relative overflow-hidden group">
                    <div className="space-y-3 relative z-10">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Date Created</p>
                        <p className="text-lg font-bold text-foreground uppercase tracking-tight">
                            <AdaptiveDate date={aggregation.createdAt} />
                        </p>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">System ID</p>
                        <div className="p-4 bg-background-soft rounded-lg border border-border/50">
                            <p className="text-[10px] font-mono text-primary font-bold break-all leading-relaxed uppercase tracking-widest">{aggregation.id}</p>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">Verified by KuntalX</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
