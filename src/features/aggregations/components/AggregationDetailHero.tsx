import React from 'react';
import { type Aggregation } from '../types/aggregation';

interface AggregationDetailHeroProps {
    aggregation: Aggregation;
}

export const AggregationDetailHero: React.FC<AggregationDetailHeroProps> = ({ aggregation }) => {
    return (
        <div className="card-minimal overflow-hidden transition-all hover:border-primary/30 group">
            <div className="h-80 md:h-96 bg-background-soft relative overflow-hidden">
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

                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-8 left-10 flex flex-wrap gap-4">
                    {aggregation.cropTypeName && (
                        <div className="px-6 py-2.5 rounded-xl bg-primary text-white flex items-center gap-3 shadow-minimal">
                            <span className="text-lg">🌾</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest">{aggregation.cropTypeName}</span>
                        </div>
                    )}
                    {aggregation.region && (
                        <div className="px-6 py-2.5 rounded-xl bg-background-soft/80 backdrop-blur-md text-foreground border border-border flex items-center gap-3 shadow-minimal">
                            <span className="text-lg">📍</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest">{aggregation.region}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-10 space-y-6">
                <div className="space-y-3">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Collection Description</p>
                    <p className="text-[15px] font-medium text-foreground/80 leading-relaxed max-w-4xl">
                        {aggregation.description || 'This collection pool follows standardized quality verification. All volume metrics are recorded and verified through the KuntalX system to ensure transparent trade.'}
                    </p>
                </div>
            </div>
        </div>
    );
};
