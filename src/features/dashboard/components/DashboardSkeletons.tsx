import React from 'react';
import { GlassCard } from '../../../shared/components/UI';

export const StatCardSkeleton: React.FC = () => (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col gap-4 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-muted rounded-lg" />
        </div>
        <div className="space-y-2">
            <div className="h-3 w-1/3 bg-muted rounded" />
            <div className="h-8 w-2/3 bg-muted rounded" />
            <div className="h-3 w-4/5 bg-muted rounded" />
        </div>
    </div>
);

export const StatsCardsSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
        ))}
    </div>
);

export const MarketTickerSkeleton: React.FC = () => (
    <div className="h-10 flex items-center justify-center border-y border-border bg-muted/30 mb-6 w-full animate-pulse">
        <div className="h-3 w-64 bg-muted rounded" />
    </div>
);

export const ActivityTableSkeleton: React.FC = () => (
    <GlassCard className="p-0 overflow-hidden flex flex-col animate-pulse">
        <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-wrap justify-between items-center gap-3 bg-muted/30">
            <div className="space-y-2">
                <div className="h-5 w-40 bg-muted rounded" />
                <div className="h-3 w-64 bg-muted rounded" />
            </div>
            <div className="h-10 w-32 bg-muted rounded-xl" />
        </div>
        
        {/* Desktop Skeleton */}
        <div className="hidden md:block overflow-x-auto flex-1 p-6">
             <div className="space-y-4">
                 {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-4 items-center border-b border-border/20 pb-4">
                          <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
                          <div className="space-y-2 flex-1">
                              <div className="h-4 w-1/4 bg-muted rounded" />
                              <div className="h-3 w-1/3 bg-muted rounded" />
                          </div>
                      </div>
                 ))}
             </div>
        </div>
        
        {/* Mobile Skeleton */}
        <div className="md:hidden p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                      <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
                          <div className="space-y-2 flex-1">
                              <div className="h-4 w-1/2 bg-muted rounded" />
                              <div className="h-3 w-1/3 bg-muted rounded" />
                          </div>
                      </div>
                      <div className="h-16 w-full bg-muted/50 rounded-xl" />
                  </div>
              ))}
        </div>
    </GlassCard>
);
