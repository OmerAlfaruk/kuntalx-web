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
            <div className="py-32 text-center opacity-20">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center text-2xl mb-6">📡</div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider italic">No active traces detected.</p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto relative">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">
                        <tr>
                            <th className="px-6 py-4 pl-10">Temporal Logic</th>
                            <th className="px-6 py-4">Action Pattern</th>
                            <th className="px-6 py-4">Active Actor</th>
                            <th className="px-6 py-4">Target Entity</th>
                            <th className="px-6 py-4 text-right pr-10">Metadata Trace</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border/40">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/5 transition-colors group">
                                <td className="px-6 py-4 pl-10">
                                    <div className="flex flex-col gap-1">
                                        <AdaptiveDate date={log.timestamp} className="font-extrabold text-foreground text-sm uppercase italic" />
                                        <span className="text-[10px] text-muted-foreground font-extrabold tracking-wider opacity-60 uppercase italic">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="inline-flex px-3 py-1 rounded-sm text-[10px] font-extrabold uppercase tracking-wider border border-primary/20 text-primary bg-primary/5 italic w-fit">
                                            {log.action.replace(/_/g, ' ')}
                                        </div>
                                        <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight opacity-90 max-w-[240px] leading-relaxed">
                                            {getLogDescription(log.action, log.userName, log.entityType)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-extrabold text-foreground text-sm uppercase italic group-hover:text-primary transition-colors">{log.userName}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono font-extrabold opacity-40 tracking-tighter uppercase italic">USER ID: {log.userId.slice(0, 12)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-extrabold text-primary/80 group-hover:text-primary transition-colors text-xs tracking-wide uppercase italic">{log.entityType}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono font-extrabold opacity-40 tracking-tighter uppercase italic">ENTITY ID: {log.entityId.slice(0, 12)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right pr-10">
                                    <div className="max-w-[200px] ml-auto">
                                        <pre className="text-[10px] leading-relaxed font-extrabold text-muted-foreground/60 transition-colors group-hover:text-muted-foreground whitespace-pre-wrap break-all uppercase italic">
                                            {log.details ? JSON.stringify(log.details) : 'PROTOCOL_NULL'}
                                        </pre>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5 min-h-[200px] relative">
                {logs.map((log) => (
                    <div key={log.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <AdaptiveDate date={log.timestamp} className="font-extrabold text-foreground text-[10px] uppercase italic tracking-wider" />
                                <span className="text-[9px] text-muted-foreground font-extrabold tracking-widest uppercase italic opacity-60">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="px-2 h-5 rounded bg-primary/10 text-primary text-[8px] font-extrabold uppercase italic tracking-widest flex items-center border border-primary/20">
                                {log.action.replace(/_/g, ' ')}
                            </div>
                        </div>

                        <div className="p-3 bg-muted/20 border border-border/40 rounded-lg">
                            <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight leading-relaxed opacity-80">
                                {getLogDescription(log.action, log.userName, log.entityType)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Authorized Actor</p>
                                <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight truncate">{log.userName}</p>
                                <p className="text-[8px] font-mono font-extrabold text-muted-foreground uppercase italic tracking-tighter opacity-40">ID: {log.userId.slice(0, 8)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Target Resource</p>
                                <p className="text-[10px] font-extrabold text-primary/80 uppercase italic tracking-tight truncate">{log.entityType}</p>
                                <p className="text-[8px] font-mono font-extrabold text-muted-foreground uppercase italic tracking-tighter opacity-40">ID: {log.entityId.slice(0, 8)}</p>
                            </div>
                        </div>

                        {log.details && (
                            <div className="pt-2 border-t border-border/40">
                                <p className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Payload Manifest</p>
                                <div className="p-2 bg-black/5 rounded text-[8px] font-mono font-extrabold text-muted-foreground uppercase italic break-all leading-tight opacity-60">
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
