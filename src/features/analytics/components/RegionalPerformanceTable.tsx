import React, { memo } from 'react';
import { Badge } from '../../../shared/components/UI';

interface RegionalActivity {
    name: string;
    region: string;
    hubId: string;
    status: string;
    volume: number;
}

interface RegionalPerformanceTableProps {
    activity: RegionalActivity[];
}

export const RegionalPerformanceTable: React.FC<RegionalPerformanceTableProps> = memo(({
    activity
}) => {
    return (
        <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm relative">
            <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-foreground uppercase tracking-tight italic">Regional Performance Matrix</h3>
                    <p className="text-xs font-bold text-muted-foreground mt-1 uppercase opacity-60">Detailed metrics for each registered association</p>
                </div>
                <Badge variant="outline" className="px-4 text-[10px] font-extrabold uppercase tracking-wider italic shrink-0">Total: {activity.length}</Badge>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">
                        <tr>
                            <th className="px-6 py-4 pl-10">Association Name</th>
                            <th className="px-6 py-4">Region</th>
                            <th className="px-6 py-4 text-center">Protocol ID</th>
                            <th className="px-6 py-4 text-center">Current Status</th>
                            <th className="px-6 py-4 text-right pr-10">Cumulative Volume</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {activity.map((assoc, idx) => (
                            <tr key={`${assoc.name}-${idx}`} className="group hover:bg-muted/5 transition-colors">
                                <td className="px-6 py-4 pl-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold shadow-sm group-hover:bg-primary group-hover:text-white transition-all text-sm italic">
                                            {assoc.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors uppercase italic tracking-tight">{assoc.name}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5 uppercase italic">HUB ID: {assoc.hubId.slice(0, 12)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-extrabold text-xs text-foreground uppercase tracking-wider italic">{assoc.region}</p>
                                        <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest italic">FEDERATED_REGION</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <p className="font-mono text-[10px] text-muted-foreground uppercase opacity-60 font-extrabold italic tracking-widest">PROTOCOL: {assoc.hubId.split('-')[1] || '0xAF92'}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <Badge variant={assoc.status === 'active' || assoc.status === 'Operational' ? 'success' : 'outline'} className="text-[10px] font-extrabold uppercase italic tracking-wider">
                                            {assoc.status}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right pr-10">
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-extrabold text-lg text-foreground tabular-nums italic tracking-tighter">{assoc.volume.toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic">Kuntal</span></p>
                                        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden border border-border/5">
                                            <div
                                                className="bg-primary h-full rounded-full opacity-60"
                                                style={{ width: `${Math.min(100, (assoc.volume / 1000) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
                {activity.map((assoc, idx) => (
                    <div key={`${assoc.name}-${idx}`} className="bg-muted/5 border border-border/60 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold italic shrink-0 text-sm">
                                {assoc.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-sm text-foreground uppercase italic tracking-tight truncate">{assoc.name}</p>
                                <p className="text-[10px] font-mono text-muted-foreground/40 uppercase italic truncate">HUB: {assoc.hubId.slice(0, 10)}</p>
                            </div>
                            <Badge variant={assoc.status === 'active' || assoc.status === 'Operational' ? 'success' : 'outline'} className="text-[9px] font-extrabold uppercase italic shrink-0">
                                {assoc.status}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                            <div>
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Region</p>
                                <p className="text-[10px] font-extrabold text-foreground uppercase italic truncate">{assoc.region}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Volume</p>
                                <p className="text-[11px] font-extrabold text-primary italic">{assoc.volume.toLocaleString()} <span className="text-[9px] opacity-60">QT</span></p>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full opacity-60" style={{ width: `${Math.min(100, (assoc.volume / 1000) * 100)}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
