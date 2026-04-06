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
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border/50 pb-12">
            <div className="space-y-8">
                <button
                    onClick={() => navigate({ to: '/aggregations' })}
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-background-soft border border-border shadow-minimal hover:bg-primary hover:text-white transition-all group active:scale-95"
                >
                    <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
                </button>

                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">
                            {aggregation.title || `Batch #${aggregation.id.substring(0, 8)}`}
                        </h1>
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">
                        Registry Signature: {aggregation.id.substring(0, 12)}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-background-soft border border-border shadow-minimal w-full md:w-auto justify-between md:justify-center">
                <span className="md:hidden text-[10px] font-bold uppercase text-muted-foreground/40 ml-2">Status Terminal</span>
                {canManage ? (
                    <AggregationStatusEditor
                        currentStatus={aggregation.status}
                        onStatusChange={handleStatusChange}
                    />
                ) : (
                    <div className="px-6">
                        <AggregationStatusChip
                            status={(aggregation.aggregationType === 'mini_association' ? 'ready_for_sale' : aggregation.status) as AggregationStatus}
                            className="text-[10px] font-bold px-6 py-2 rounded-xl uppercase tracking-widest border border-border/30 bg-background/50 shadow-minimal"
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

