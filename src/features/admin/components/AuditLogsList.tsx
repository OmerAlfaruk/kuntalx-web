import React, { memo } from 'react';
import { AdaptiveDate } from '../../../shared/components/UI';

interface AuditLogsListProps {
    logs: any[];
    getLogDescription: (action: string, userName: string, entityType: string) => string;
}

export const AuditLogsList: React.FC<AuditLogsListProps> = memo(({
    logs,
    getLogDescription
}) => {
    if (logs.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    📡
                </div>
                <h3 className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">No Active Traces</h3>
                <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest max-w-sm leading-relaxed">
                    The audit log stream is reporting no events within the specified time window.
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
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Timestamp</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Operator</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Entity</th>
                            <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metadata</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-background-soft/50 transition-all duration-300 group">
                                <td className="px-10 py-7">
                                    <div className="space-y-1.5">
                                        <AdaptiveDate date={log.timestamp} className="text-[13px] font-bold text-foreground uppercase tracking-tight" />
                                        <span className="text-[9px] font-mono font-bold text-muted-foreground/30 uppercase tracking-widest block">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="space-y-2">
                                        <div className="inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-primary/20 text-primary bg-primary/5">
                                            {log.action.replace(/_/g, ' ')}
                                        </div>
                                        <p className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest leading-relaxed max-w-[280px]">
                                            {getLogDescription(log.action, log.userName, log.entityType)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-inner group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            {log.userName.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[13px] font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors block">{log.userName}</span>
                                            <span className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-widest block">ID: {log.userId.slice(0, 12)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="space-y-1.5">
                                        <span className="text-[13px] font-bold text-primary/60 group-hover:text-primary transition-colors uppercase tracking-tight block">{log.entityType}</span>
                                        <span className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-widest block">Key: {log.entityId.slice(0, 12)}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <div className="max-w-[200px] ml-auto">
                                        <div className="p-4 rounded-xl border border-border/50 bg-background-soft/50 group-hover:border-primary/20 transition-all">
                                            <pre className="text-[9px] leading-relaxed font-mono font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors whitespace-pre-wrap break-all uppercase">
                                                {log.details ? JSON.stringify(log.details) : 'No metadata'}
                                            </pre>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-6">
                {logs.map((log) => (
                    <div key={log.id} className="card-minimal p-7 space-y-6 group">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <AdaptiveDate date={log.timestamp} className="text-[13px] font-bold text-foreground uppercase tracking-tight" />
                                <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] block">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20">
                                {log.action.replace(/_/g, ' ')}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border/50 bg-background-soft/50 group-hover:border-primary/20 transition-all">
                            <p className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest leading-relaxed">
                                {getLogDescription(log.action, log.userName, log.entityType)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-5 border-y border-border/40 bg-background-soft/30 -mx-7 px-7">
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Operator</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-bold shrink-0">
                                        {log.userName.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">{log.userName}</p>
                                        <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase truncate">ID: {log.userId.slice(0, 10)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Target</p>
                                <p className="text-[11px] font-bold text-primary/70 uppercase tracking-tight truncate">{log.entityType}</p>
                                <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase truncate">Key: {log.entityId.slice(0, 10)}</p>
                            </div>
                        </div>

                        {log.details && (
                            <div className="space-y-2">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Payload</p>
                                <div className="p-4 rounded-xl border border-border/50 bg-background-soft/50 font-mono font-bold text-[9px] text-muted-foreground/30 uppercase break-all leading-relaxed group-hover:text-primary/50 transition-all">
                                    {JSON.stringify(log.details)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});
