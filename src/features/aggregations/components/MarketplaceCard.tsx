import React from 'react';
import { Badge } from '../../../shared/components/UI';
import type { Aggregation } from '../types/aggregation';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

interface MarketplaceCardProps {
    aggregation: Aggregation;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ aggregation }) => {
    const navigate = useNavigate();
    const isMini = aggregation.aggregationType === 'mini_association';
    const progress = isMini ? 100 : Math.round((aggregation.totalQuantityKuntal / aggregation.targetQuantityKuntal) * 100);

    // Dynamic image selection based on crop type
    const cardImage = aggregation.cropTypeName?.toLowerCase().includes('coffee')
        ? "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800"
        : "https://images.unsplash.com/photo-1542713314-878f0907d341?auto=format&fit=crop&q=80&w=800";

    return (
        <div
            onClick={() => navigate({ to: '/aggregations/$id', params: { id: aggregation.id } })}
            className="group card-minimal overflow-hidden transition-all duration-500 hover:border-primary/40 cursor-pointer flex flex-col relative"
        >
            {/* Featured Image Area */}
            <div className="relative aspect-[16/9] overflow-hidden bg-background-soft/50">
                <img
                    src={cardImage}
                    alt={aggregation.cropTypeName}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-soft/90 via-background-soft/10 to-transparent" />
                <div className="absolute top-4 left-4">
                    <Badge variant="gold" className="shadow-minimal border border-white/10">
                        {aggregation.qualityGrade || 'GRADE_A'}
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase leading-none">Net Progress</span>
                        <span className="text-[11px] font-bold text-foreground tabular-nums tracking-widest">{progress}%</span>
                    </div>
                    <div className="h-1 bg-background border border-border/50 rounded-full overflow-hidden p-[0.5px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        />
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] leading-none">
                            {aggregation.region || "Sector Hub"}
                        </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-foreground leading-tight tracking-wide group-hover:text-primary transition-colors">
                        {aggregation.cropTypeName}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground/40 line-clamp-2 leading-relaxed italic uppercase tracking-widest">
                        {aggregation.description || `Certified regional aggregation for ${aggregation.cropTypeName}.`}
                    </p>
                </div>

                {/* Registry Data */}
                <div className="flex items-center gap-4 py-5 border-y border-border/30 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-sm shadow-minimal">
                        {aggregation.associationName?.[0] || '⌬'}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Regional Origin</p>
                        <p className="text-[13px] font-bold text-foreground uppercase tracking-widest truncate leading-none mt-1">
                            {aggregation.associationName}
                        </p>
                    </div>
                </div>

                {/* Interaction Footer */}
                <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                            Registry Verified
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Examine</span>
                        <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
