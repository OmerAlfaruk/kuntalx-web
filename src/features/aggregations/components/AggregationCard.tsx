import React from 'react';
import type { Aggregation } from '../types/aggregation';
import { GlassCard, Badge, AdaptiveDate } from '../../../shared/components/UI';
import { AggregationStatusChip } from './AggregationStatusChip';

interface AggregationCardProps {
  aggregation: Aggregation;
  role?: string;
  onClick?: () => void;
  onActionClick?: () => void;
}

export const AggregationCard: React.FC<AggregationCardProps> = ({
  aggregation,
  role,
  onClick,
  onActionClick
}) => {
  const isBuyer = role === 'buyer';
  const isMini = aggregation.aggregationType === 'mini_association';
  const progress = isMini ? 100 : Math.min((aggregation.totalQuantityKuntal / aggregation.targetQuantityKuntal) * 100, 100);

  const availableQty = aggregation.availableQuantity ?? aggregation.totalQuantityKuntal;

  return (
    <GlassCard
      className="group flex flex-col h-full cursor-pointer hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-[2rem] overflow-hidden p-0 border-border/40"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={aggregation.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={aggregation.title || 'Aggregation'}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <AggregationStatusChip status={isMini ? 'ready_for_sale' : aggregation.status} />
          {aggregation.qualityGrade && (
            <Badge variant="gold" className="backdrop-blur-md bg-yellow-500/10 border-yellow-500/20 text-[10px] font-bold">Grade {aggregation.qualityGrade}</Badge>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white tracking-widest">
            {aggregation.cropTypeName || 'PRODUCE'}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
            {aggregation.title || `${aggregation.cropTypeName} Pool`}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
            {aggregation.associationName || 'Local Cooperative'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Available Volume</p>
            <p className="text-lg font-bold text-foreground">{availableQty} <span className="text-[10px] opacity-60 font-medium tracking-normal">qt</span></p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Unit Price</p>
            <p className="text-lg font-bold text-emerald-600">ETB {aggregation.pricePerKuntal?.toLocaleString() || '---'}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Expected Delivery</p>
            <AdaptiveDate date={aggregation.expectedDeliveryDate} className="text-[10px] font-bold text-foreground" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.();
            }}
            className={`h-10 px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isBuyer
                ? 'bg-primary text-white shadow-minimal hover:bg-primary/90'
                : 'bg-card border border-border text-foreground hover:bg-background-soft shadow-minimal'
              }`}
          >
            {isBuyer ? 'Order Now' : 'Manage'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
