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

    const handleResetTrace = useCallback(() => {
        setFromDate('');
        setToDate('');
        setSearchTerm('');
    }, []);

    // Only platform_admin should see this
    if (user && user.role !== 'platform_admin') {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-background-soft border border-border rounded-xl flex items-center justify-center text-3xl mb-6">
                    🚫
                </div>
                <h2 className="text-xl font-bold text-foreground mb-3 text-center">Access Restricted</h2>
                <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
                    You do not have the required permissions to access the system audit logs.
                </p>
                <button
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="h-10 px-6 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-minimal"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const showFullLoader = isLoading && logs.length === 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="System Audit Logs"
                description="Comprehensive record of administrative activities and system changes."
            />

            <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Actor, Entity, or Action..."
                        className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Premium Filters Section */}
                <div className="card-minimal p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Start Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">End Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleResetTrace}
                        className="h-10 px-6 rounded-lg bg-background-soft border border-border text-muted-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/10 transition-all w-full md:w-auto"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <div className={`card-minimal overflow-hidden transition-all duration-300 ${isLoading ? 'opacity-50' : ''}`}>
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background-soft">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity Log</h3>
                        {isLoading && (
                            <div className="flex items-center gap-2 px-2 py-0.5 bg-primary/5 rounded-full border border-primary/20">
                                <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-[8px] font-bold uppercase text-primary tracking-widest">Updating</span>
                            </div>
                        )}
                    </div>
                </div>

                {showFullLoader ? <SkeletonList rows={10} /> : (
                    <>
                        <AuditLogsList
                            logs={paginatedLogs}
                            getLogDescription={getLogDescription}
                        />
                        <div className="border-t border-border">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={logs.length}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
