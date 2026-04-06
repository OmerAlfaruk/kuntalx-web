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
        <div className="overflow-hidden card-minimal mt-8">
            <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Telemetry</p>
                    <h3 className="font-bold text-lg text-foreground tracking-tight">Regional Performance Pipeline</h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{activity.length} Nodes</span>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/30 bg-background-soft/30">
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Association Node</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Region</th>
                            <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Node ID</th>
                            <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume (QT)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {activity.map((assoc, idx) => (
                            <tr key={`${assoc.name}-${idx}`} className="hover:bg-background-soft/50 transition-all duration-300 group">
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-300 text-lg shrink-0">
                                            {assoc.name[0].toUpperCase()}
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{assoc.name}</p>
                                            <p className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-widest leading-none">ID: {assoc.hubId.slice(0, 12)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{assoc.region}</p>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <span className="text-[9px] font-mono font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-md border border-primary/10 select-all">SIG-{assoc.hubId.split('-')[1] || assoc.hubId.slice(0, 4)}</span>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <Badge 
                                        variant={assoc.status === 'active' || assoc.status === 'Operational' ? 'success' : 'outline'} 
                                        className="h-6 px-4 rounded-full text-[9px] font-bold uppercase tracking-widest"
                                    >
                                        {assoc.status}
                                    </Badge>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <div className="flex flex-col items-end gap-3">
                                        <p className="text-[15px] font-bold text-foreground tabular-nums tracking-tight">{assoc.volume.toLocaleString()}</p>
                                        <div className="w-32 h-1.5 bg-border/30 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-1000 opacity-80"
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

            {/* Mobile View */}
            <div className="md:hidden space-y-4 p-6 bg-background-soft/20">
                {activity.map((assoc, idx) => (
                    <div key={`${assoc.name}-${idx}`} className="p-7 space-y-6 border border-border/50 rounded-2xl bg-card hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-5 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all shadow-minimal shrink-0">
                                    {assoc.name[0].toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate max-w-[120px]">{assoc.name}</p>
                                    <p className="text-[9px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.2em] truncate max-w-[100px]">ID: {assoc.hubId.slice(0, 10)}</p>
                                </div>
                            </div>
                            <Badge variant={assoc.status === 'active' || assoc.status === 'Operational' ? 'success' : 'outline'} className="h-5 px-3 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0">
                                {assoc.status}
                            </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-5 border-y border-border/40 bg-background-soft/30 -mx-7 px-7">
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Region</p>
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">{assoc.region}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Volume</p>
                                <p className="text-[11px] font-bold text-foreground tabular-nums tracking-tight">{assoc.volume.toLocaleString()} <span className="text-[9px] text-muted-foreground/40 uppercase ml-1">QT</span></p>
                            </div>
                        </div>
                        
                        <div className="w-full h-1.5 bg-border/30 rounded-full overflow-hidden shadow-inner">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000 opacity-80" style={{ width: `${Math.min(100, (assoc.volume / 1000) * 100)}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
