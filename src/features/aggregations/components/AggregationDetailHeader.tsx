import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AggregationStatusChip } from './AggregationStatusChip';
import { AggregationStatusEditor } from './AggregationStatusEditor';
import { type Aggregation, type AggregationStatus } from '../types/aggregation';

interface AggregationDetailHeaderProps {
    aggregation: Aggregation;
    canManage: boolean;
    handleStatusChange: (status: string) => Promise<void>;
}

export const AggregationDetailHeader: React.FC<AggregationDetailHeaderProps> = ({
    aggregation,
    canManage,
    handleStatusChange
}) => {
    const navigate = useNavigate();

    return (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/60 pb-10">
            <div className="space-y-6">
                <button
                    onClick={() => navigate({ to: '/aggregations' })}
                    className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group py-2"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collections
                </button>

                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                            {aggregation.title || `Batch #${aggregation.id.substring(0, 8)}`}
                        </h1>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-40">
                        Batch ID: {aggregation.id.substring(0, 12)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 p-2 rounded-xl bg-card border border-border/60 shadow-minimal w-full md:w-auto justify-between md:justify-center">
                <span className="md:hidden text-[10px] font-bold uppercase text-muted-foreground ml-2">Status:</span>
                {canManage ? (
                    <AggregationStatusEditor
                        currentStatus={aggregation.status}
                        onStatusChange={handleStatusChange}
                    />
                ) : (
                    <div className="px-4">
                        <AggregationStatusChip
                            status={(aggregation.aggregationType === 'mini_association' ? 'ready_for_sale' : aggregation.status) as AggregationStatus}
                            className="text-[10px] font-bold px-4 py-1.5 rounded-lg uppercase tracking-widest border border-border/30"
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

