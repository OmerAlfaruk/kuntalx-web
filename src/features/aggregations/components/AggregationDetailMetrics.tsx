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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Progress */}
            <div className={`${isMini ? 'lg:col-span-4' : 'md:col-span-2'} p-8 bg-card border border-border/60 rounded-xl space-y-6 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden`}>
                <div className="flex items-center justify-between relative z-10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">Collection Progress</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{progressPercent}% Fulfilled</span>
                    </div>
                </div>

                <div className="space-y-5 relative z-10">
                    <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold tracking-tight text-foreground transition-colors tabular-nums leading-none">
                            {totalQty.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            Target: {targetQty.toLocaleString()} QT
                        </p>
                    </div>

                    <div className="h-2 w-full bg-background-soft rounded-full overflow-hidden border border-border/10">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {!isMini && (
                <>
                    {/* Contributors */}
                    <div className="p-8 bg-card border border-border/60 rounded-xl space-y-6 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70 relative z-10">Producers</p>
                        <div className="space-y-1 relative z-10">
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                    {aggregation.items?.length || 0}
                                </p>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5">Active</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest pt-2">Registered Sellers</p>
                        </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="p-8 bg-card border border-border/60 rounded-xl space-y-6 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70 relative z-10">Time Left</p>
                        <div className="space-y-1 relative z-10">
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-bold tracking-tight text-foreground tabular-nums leading-none">
                                    {aggregation.daysRemaining ?? '--'}
                                </p>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-0.5">Days</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest pt-2">Window Close</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
