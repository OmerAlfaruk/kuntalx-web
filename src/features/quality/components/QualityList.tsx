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
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    🔬
                </div>
                <h3 className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">No Inspections Logged</h3>
                <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest max-w-sm leading-relaxed">
                    No quality assessments have been recorded for this distribution cluster.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 bg-background-soft/50">
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inspection ID</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Batch Ref</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset Class</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Purity</th>
                            <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grade</th>
                            <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {inspections.map((check) => (
                            <tr key={check.id} className="hover:bg-background-soft/50 transition-all duration-300 group">
                                <td className="px-10 py-7">
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] font-bold text-primary uppercase tracking-tight group-hover:text-primary/80 transition-colors">QC-{check.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">Sig: {check.id.toUpperCase().slice(0, 16)}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-border/50">
                                        AGG-{check.aggregationId.slice(0, 8).toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all" />
                                        <span className="text-[13px] font-bold text-foreground uppercase tracking-tight">Produce Cluster</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-1.5 w-28 bg-border/30 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${check.purityPercentage > 90 ? 'bg-primary' : 'bg-primary/50'}`}
                                                style={{ width: `${check.purityPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[13px] font-bold text-foreground tabular-nums">{check.purityPercentage}%</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <Badge
                                        variant={check.grade === 'A' || check.grade === 'B' ? 'success' : 'warning'}
                                        className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                                    >
                                        Grade {check.grade}
                                    </Badge>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <button
                                        onClick={() => onViewReport(check)}
                                        className="h-10 px-6 rounded-xl bg-background-soft border border-border text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-minimal"
                                    >
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-6">
                {inspections.map((check) => (
                    <div
                        key={check.id}
                        onClick={() => onViewReport(check)}
                        className="card-minimal p-7 space-y-6 group active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-primary uppercase tracking-tight">QC-{check.id.slice(0, 8).toUpperCase()}</p>
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">#{check.id.toUpperCase().slice(0, 12)}</p>
                            </div>
                            <Badge variant={check.grade === 'A' || check.grade === 'B' ? 'success' : 'warning'} className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0">
                                Grade {check.grade}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-5 border-y border-border/40 bg-background-soft/30 -mx-7 px-7">
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Batch Ref</p>
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">AGG-{check.aggregationId.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Purity Score</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${check.purityPercentage > 90 ? 'bg-primary' : 'bg-primary/50'}`}
                                            style={{ width: `${check.purityPercentage}%` }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-foreground tabular-nums shrink-0">{check.purityPercentage}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Lab Status: Verified</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-widest">View Report</span>
                                <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
