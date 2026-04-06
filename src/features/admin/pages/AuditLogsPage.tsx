import { useState, useCallback, useMemo } from 'react';
import { PageHeader, TablePagination } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { useAuditLogs } from '../hooks';
import { useAuth } from '../../../lib/auth-context';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import { useNavigate } from '@tanstack/react-router';
import { AuditLogsList } from '../components/AuditLogsList';

export const AuditLogsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const getLogDescription = useCallback((action: string, userName: string = 'System', entityType: string) => {
        const normalizedAction = action.toLowerCase().replace(/_/g, ' ');
        const entity = entityType.toLowerCase();

        const maps: Record<string, string> = {
            'CREATE': `Created new ${entity}`,
            'UPDATE': `Modified ${entity} details`,
            'DELETE': `Removed ${entity} record`,
            'VERIFY': `Verified ${entity} identity`,
            'APPROVE': `Approved ${entity} request`,
            'REJECT': `Rejected ${entity} request`,
            'LOGIN': `Secure session started`,
            'LOGOUT': `Secure session ended`,
            'EXPORT': `Generated report`,
            'PAYOUT_PROCESS': `Processed payout`,
            'ORDER_PLACE': `Placed new order`,
            'SHIPMENT_UPDATE': `Updated shipment status`
        };

        const baseAction = Object.keys(maps).find(key => action.toUpperCase().includes(key));
        return maps[baseAction || ''] || `${userName} performed ${normalizedAction} on ${entity}`;
    }, []);

    const { data: logs = [], isLoading } = useAuditLogs({
        limit: 50,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        keyword: debouncedSearchTerm || undefined
    });

    const totalPages = useMemo(() => Math.ceil((logs.length || 0) / pageSize), [logs.length, pageSize]);
    const paginatedLogs = useMemo(() => {
        return logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [logs, currentPage, pageSize]);

    const handleReset = useCallback(() => {
        setFromDate('');
        setToDate('');
        setSearchTerm('');
    }, []);

    // Only platform_admin should see this
    if (user && user.role !== 'platform_admin') {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-4xl mb-8 shadow-minimal">
                    🚫
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tight">Access Denied</h2>
                <p className="text-sm text-muted-foreground/60 mb-10 max-w-sm font-medium leading-relaxed">
                    Your account does not have sufficient clearance to view the audit log stream.
                </p>
                <button
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="h-12 px-10 bg-background-soft border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-all active:scale-95 shadow-minimal"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const showFullLoader = isLoading && logs.length === 0;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-12">
            <PageHeader
                title="Audit Logs"
                description="Comprehensive record of all administrative actions and system state transitions."
            />

            {/* Filters */}
            <div className="space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by action, actor, or entity..."
                        className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="card-minimal p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full h-12 bg-background border border-border rounded-xl px-5 text-[11px] font-bold uppercase tracking-widest focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full h-12 bg-background border border-border rounded-xl px-5 text-[11px] font-bold uppercase tracking-widest focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleReset}
                        className="h-12 px-6 rounded-xl bg-background-soft border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/5 transition-all active:scale-95 w-full"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Log Table */}
            <div className={`card-minimal overflow-hidden transition-all duration-700 ${isLoading ? 'opacity-70' : ''}`}>
                <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Stream</p>
                        <h3 className="font-bold text-lg text-foreground tracking-tight">Activity Log</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {isLoading && (
                            <div className="flex items-center gap-3 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/20">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                <span className="text-[9px] font-bold uppercase text-primary tracking-widest">Syncing</span>
                            </div>
                        )}
                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{logs.length} events</span>
                    </div>
                </div>

                {showFullLoader ? (
                    <div className="p-8">
                        <SkeletonList rows={10} />
                    </div>
                ) : (
                    <div>
                        <AuditLogsList
                            logs={paginatedLogs}
                            getLogDescription={getLogDescription}
                        />
                        <div className="border-t border-border/50">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={logs.length}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
