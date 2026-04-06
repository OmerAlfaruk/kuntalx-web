import React from 'react';
import { AdaptiveDate, Badge } from '../../../shared/components/UI';
import { type Aggregation } from '../types/aggregation';

interface AggregationDetailSpecsProps {
    aggregation: Aggregation;
}

export const AggregationDetailSpecs: React.FC<AggregationDetailSpecsProps> = ({ aggregation }) => {
    return (
        <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-border/50 pb-8">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Specifications Registry</h3>
                    <p className="font-bold text-lg text-foreground tracking-tight">Contractual Parameters</p>
                </div>
            </div>

            <div className="card-minimal overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 bg-background-soft/50">
                            <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Parameter</th>
                            <th className="px-10 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Value Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-10 py-6 text-[13px] font-bold text-foreground">Unit Acquisition Price</td>
                            <td className="px-10 py-6 text-right font-bold text-primary text-[13px] tabular-nums">
                                ETB {aggregation.pricePerKuntal?.toLocaleString() || 'Market Price'}
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-10 py-6 text-[13px] font-bold text-foreground">Verification Grade</td>
                            <td className="px-10 py-6 text-right">
                                <Badge variant="success" className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Grade {aggregation.qualityGrade || 'A'}
                                </Badge>
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-10 py-6 text-[13px] font-bold text-foreground">Settlement Forecast</td>
                            <td className="px-10 py-6 text-right text-[13px] font-bold text-foreground uppercase tracking-widest">
                                <AdaptiveDate date={aggregation.expectedDeliveryDate} />
                            </td>
                        </tr>
                        <tr className="hover:bg-background-soft transition-colors group">
                            <td className="px-10 py-6 text-[13px] font-bold text-foreground">Network Type</td>
                            <td className="px-10 py-6 text-right text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                {aggregation.aggregationType?.replace(/_/g, ' ') || 'Federated'}
                            </td>
                        </tr>
                        {aggregation.associationName && (
                            <tr className="hover:bg-background-soft transition-colors group border-t border-border/50 bg-background-soft/30">
                                <td className="px-10 py-6 text-[13px] font-bold text-foreground">Governance Body</td>
                                <td className="px-10 py-6 text-right font-bold text-foreground text-[13px]">{aggregation.associationName}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
