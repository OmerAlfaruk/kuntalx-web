import React from 'react';
import { Badge } from '../../../shared/components/UI';
import type { Aggregation } from '../types/aggregation';
import { useNavigate } from '@tanstack/react-router';

interface MarketplaceCardProps {
    aggregation: Aggregation;
    t: (k: string) => string;
}

export const MarketplaceCard: React.FC<Omit<MarketplaceCardProps, 't'>> = ({ aggregation }) => {
    const navigate = useNavigate();
    const isMini = aggregation.aggregationType === 'mini_association';
    const progress = isMini ? 100 : Math.round((aggregation.totalQuantityKuntal / aggregation.targetQuantityKuntal) * 100);

    // Dynamic image selection based on crop type (simulated)
    const cardImage = aggregation.cropTypeName?.toLowerCase().includes('coffee')
        ? "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"
        : "https://images.unsplash.com/photo-1542713314-878f0907d341?auto=format&fit=crop&q=80&w=800";

    return (
        <div
            onClick={() => navigate({ to: '/aggregations/$id', params: { id: aggregation.id } })}
            className="group bg-white border border-border rounded-xl overflow-hidden shadow-minimal transition-all duration-300 hover:border-primary/40 cursor-pointer flex flex-col"
        >
            {/* Featured Image Area */}
            <div className="relative aspect-[16/10] overflow-hidden bg-secondary-soft">
                <img
                    src={cardImage}
                    alt={aggregation.cropTypeName}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge variant="primary" className="bg-white/90 backdrop-blur-sm text-primary border-none">
                        {aggregation.qualityGrade || 'GRADE_A'}
                    </Badge>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                            {aggregation.region || "Registry Hub"}
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                            Active
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                        {aggregation.cropTypeName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {aggregation.description || `Certified ${aggregation.cropTypeName} aggregation protocol currently open for fulfillment across the regional network.`}
                    </p>
                </div>

                {/* Authority Tag */}
                <div className="flex items-center gap-4 py-4 border-y border-border/50">
                    <div className="w-8 h-8 rounded bg-secondary-soft border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
                        {aggregation.associationName?.[0]}
                    </div>
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider truncate">
                        {aggregation.associationName}
                    </span>
                </div>

                {/* Metrics & Progress Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Network Progress</span>
                            <p className="text-2xl font-bold text-foreground tracking-tighter leading-none">
                                {progress}<span className="text-xs font-medium text-muted-foreground/40 ml-1">%</span>
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Target Goal</span>
                            <p className="text-sm font-bold text-foreground leading-none">
                                {aggregation.targetQuantityKuntal} <span className="text-[10px] text-muted-foreground/40">QT</span>
                            </p>
                        </div>
                    </div>

                    {/* Minimal Progress Bar */}
                    <div className="h-1 bg-secondary-soft rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                </div>

                {/* Interaction Footer */}
                <div className="pt-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                        Updated 2h ago
                    </span>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">
                        View Protocol →
                    </button>
                </div>
            </div>
        </div>
    );
};
