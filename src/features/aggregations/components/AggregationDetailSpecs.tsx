import React from 'react';
import { AdaptiveDate } from '../../../shared/components/UI';
import { type Aggregation } from '../types/aggregation';

interface AggregationDetailSpecsProps {
    aggregation: Aggregation;
}

export const AggregationDetailSpecs: React.FC<AggregationDetailSpecsProps> = ({ aggregation }) => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Specifications</h3>
                <div className="h-px bg-border/40 flex-1 ml-6" />
            </div>

            <div className="card-minimal overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background-soft border-b border-border/60 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        <tr>
                            <th className="px-8 py-6">Parameter</th>
                            <th className="px-8 py-6 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] divide-y divide-border/40">
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-8 py-6 font-bold text-foreground/70 uppercase tracking-widest group-hover:text-primary">Price per unit</td>
                            <td className="px-8 py-6 text-right font-bold text-primary text-sm tabular-nums">
                                ETB {aggregation.pricePerKuntal?.toLocaleString() || 'Market Price'}
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-8 py-6 font-bold text-foreground/70 uppercase tracking-widest group-hover:text-primary">Quality Grade</td>
                            <td className="px-8 py-6 text-right">
                                <span className="font-bold text-emerald-600 mr-3 text-lg uppercase tracking-widest">GRADE {aggregation.qualityGrade || 'A'}</span>
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-8 py-6 font-bold text-foreground/70 uppercase tracking-widest group-hover:text-primary">Expected Delivery</td>
                            <td className="px-8 py-6 text-right font-bold text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                                <AdaptiveDate date={aggregation.expectedDeliveryDate} />
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-8 py-6 font-bold text-foreground/70 uppercase tracking-widest group-hover:text-primary">Collection Type</td>
                            <td className="px-8 py-6 text-right font-bold text-foreground/60 uppercase tracking-widest text-[9px] group-hover:text-foreground/80 transition-colors">
                                {aggregation.aggregationType?.replace(/_/g, ' ') || 'General'}
                            </td>
                        </tr>
                        {aggregation.associationName && (
                            <tr className="hover:bg-background-soft transition-colors group border-t border-border">
                                <td className="px-8 py-6 font-bold text-foreground/70 uppercase tracking-widest group-hover:text-primary">Managed by</td>
                                <td className="px-8 py-6 text-right font-bold text-foreground uppercase tracking-tight text-sm">{aggregation.associationName}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
