import React, { memo } from 'react';
import { Badge } from '../../../shared/components/UI';
import type { QualityInspection } from '../hooks/use-quality-data';

interface QualityListProps {
    inspections: QualityInspection[];
    onViewReport: (check: QualityInspection) => void;
}

export const QualityList: React.FC<QualityListProps> = memo(({
    inspections,
    onViewReport
}) => {
    if (inspections.length === 0) {
        return (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">🔬</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No Inspections Found</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    Laboratory surveillance has not yet logged any quality assessments for this cluster.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Batch Ledger</th>
                            <th className="px-6 py-4">Asset Class</th>
                            <th className="px-6 py-4">Purity Matrix</th>
                            <th className="px-6 py-4">Audit Result</th>
                            <th className="px-6 py-4 text-right">Certificate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                        {inspections.map((check) => (
                            <tr key={check.id} className="group hover:bg-muted/5 transition-all duration-300">
                                <td className="px-6 py-4 font-extrabold text-primary font-mono text-xs italic tracking-wider uppercase">{check.id.slice(0, 8).toUpperCase()}</td>
                                <td className="px-6 py-4 text-muted-foreground font-extrabold text-[10px] uppercase italic tracking-wider">{check.aggregationId.slice(0, 8).toUpperCase()}</td>
                                <td className="px-6 py-4 font-extrabold text-foreground uppercase text-xs italic">Produce Cluster</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 w-24 bg-muted/40 rounded-full overflow-hidden p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${check.purityPercentage > 90 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-primary shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                                                    }`}
                                                style={{ width: `${check.purityPercentage}%` }}
                                            />
                                        </div>
                                        <span className="font-extrabold text-[10px] text-foreground uppercase italic">{check.purityPercentage}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={check.grade === 'A' || check.grade === 'B' ? 'success' : 'warning'} className="text-[10px] font-extrabold uppercase h-7 px-4 italic">
                                        {check.grade}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewReport(check)}
                                        className="h-9 px-4 sm:h-10 sm:px-6 rounded-xl bg-primary text-white text-[10px] uppercase font-extrabold tracking-wider hover:brightness-110 shadow-lg shadow-primary/20 transition-all italic whitespace-nowrap"
                                    >
                                        View Report →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {inspections.map((check) => (
                    <div
                        key={check.id}
                        onClick={() => onViewReport(check)}
                        className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-extrabold text-primary font-mono text-[10px] italic tracking-wider uppercase">QC: #{check.id.slice(0, 8).toUpperCase()}</span>
                            <Badge variant={check.grade === 'A' || check.grade === 'B' ? 'success' : 'warning'} className="text-[10px] font-extrabold uppercase h-6 px-3 italic">
                                Grade {check.grade}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Batch Ledger Reference</p>
                                <p className="text-[10px] text-foreground font-extrabold uppercase italic tracking-wider">AGG-#{check.aggregationId.slice(0, 8).toUpperCase()}</p>
                            </div>

                            <div>
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Purity Verification</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${check.purityPercentage > 90 ? 'bg-emerald-500' : 'bg-primary'}`}
                                            style={{ width: `${check.purityPercentage}%` }}
                                        />
                                    </div>
                                    <span className="font-extrabold text-[10px] text-foreground uppercase italic shrink-0">{check.purityPercentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <p className="text-[9px] font-extrabold text-muted-foreground/60 uppercase italic tracking-widest">Laboratory Status: Logged</p>
                            <button className="h-9 px-4 rounded-lg bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider italic">
                                Full Report →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
