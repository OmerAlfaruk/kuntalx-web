import React from 'react';
import { type Aggregation } from '../types/aggregation';

interface AggregationDetailMetricsProps {
    aggregation: Aggregation;
}

export const AggregationDetailMetrics: React.FC<AggregationDetailMetricsProps> = ({ aggregation }) => {
    const isMini = aggregation.aggregationType === 'mini_association';
    const totalQty = isMini ? aggregation.targetQuantityKuntal : (aggregation.totalQuantityKuntal || 0);
    const targetQty = aggregation.targetQuantityKuntal || 1;
    const progressPercent = isMini ? 100 : Math.min(Math.round((totalQty / targetQty) * 100), 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Progress */}
            <div className={`${isMini ? 'lg:col-span-4' : 'md:col-span-2'} p-10 card-minimal space-y-8 transition-all hover:border-primary/30 group`}>
                <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Net Progress</p>
                    <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase">{progressPercent}% Sync</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-baseline gap-4">
                        <p className="text-5xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                            {totalQty.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                            Target: {targetQty.toLocaleString()} QT
                        </p>
                    </div>

                    <div className="h-1.5 w-full bg-background-soft rounded-full overflow-hidden border border-border/30 p-[0.5px]">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {!isMini && (
                <>
                    {/* Contributors */}
                    <div className="p-10 card-minimal space-y-8 transition-all hover:border-primary/30 group">
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Producer Network</p>
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <p className="text-5xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                    {aggregation.items?.length || 0}
                                </p>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified</span>
                            </div>
                            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Active Contributors</p>
                        </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="p-10 card-minimal space-y-8 transition-all hover:border-primary/30 group">
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Window Closure</p>
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <p className="text-5xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                    {aggregation.daysRemaining ?? '--'}
                                </p>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Days Left</span>
                            </div>
                            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Registry Locking</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
