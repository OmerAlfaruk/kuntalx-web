import React from 'react';
import { type Aggregation } from '../types/aggregation';

interface AggregationDetailHeroProps {
    aggregation: Aggregation;
}

export const AggregationDetailHero: React.FC<AggregationDetailHeroProps> = ({ aggregation }) => {
    return (
        <div className="relative bg-card rounded-xl overflow-hidden border border-border/60 shadow-sm transition-all hover:border-primary/40 group">
            <div className="h-80 md:h-[450px] bg-muted/30 relative overflow-hidden">
                {aggregation.imageUrl ? (
                    <img
                        src={aggregation.imageUrl}
                        alt={aggregation.title}
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[120px] opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700">
                        {aggregation.cropTypeName?.includes('Coffee') ? '☕' : '🌾'}
                    </div>
                )}

                {/* Elite Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />

                <div className="absolute bottom-8 left-8 flex flex-wrap gap-3">
                    {aggregation.cropTypeName && (
                        <div className="px-5 py-2.5 rounded-lg bg-primary/20 backdrop-blur-md text-primary border border-primary/20 flex items-center gap-3 shadow-minimal">
                            <span className="text-lg">🌾</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest">{aggregation.cropTypeName}</span>
                        </div>
                    )}
                    {aggregation.region && (
                        <div className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center gap-3 shadow-minimal">
                            <span className="text-lg">📍</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest">{aggregation.region}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-10 space-y-6 relative">
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Collection Details</p>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed max-w-3xl">
                        {aggregation.description || 'This collection pool follows standardized quality verification. All volume metrics are recorded and verified through the KuntalX system to ensure transparent trade.'}
                    </p>
                </div>
            </div>
        </div>
    );
};
