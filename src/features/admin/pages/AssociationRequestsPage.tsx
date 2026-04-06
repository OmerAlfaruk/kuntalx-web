import { useState, useCallback, useMemo } from 'react';
import { PageHeader, StatCard, SkeletonList, SkeletonCardsList } from '../../../shared/components/UI';
import { useAssociationRequests } from '../hooks/use-association-requests';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { AssociationCreationRequest } from '../types/admin';
import { AssociationRequestsList } from '../components/AssociationRequestsList';

export const AssociationRequestsPage = () => {
    const [filter, setFilter] = useState<'pending' | 'history'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { requests, isLoading, approve, reject } = useAssociationRequests(debouncedSearchTerm);

    const [selectedRequest, setSelectedRequest] = useState<AssociationCreationRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [adminForm, setAdminForm] = useState({ fullName: '', email: '', phone: '' });

    const filtered = useMemo(() => requests.filter(r => filter === 'pending' ? r.status === 'pending' : r.status !== 'pending'), [requests, filter]);

    const handleApprove = useCallback(async () => {
        if (selectedRequest) {
            await approve({
                requestId: selectedRequest.id,
                adminData: adminForm
            });
            setSelectedRequest(null);
            setAdminForm({ fullName: '', email: '', phone: '' });
        }
    }, [approve, selectedRequest, adminForm]);

    const handleReject = useCallback(async (requestId: string) => {
        if (confirm('Are you sure you want to reject this request?')) {
            await reject(requestId);
        }
    }, [reject]);

    const handleVerify = useCallback((req: AssociationCreationRequest) => {
        setSelectedRequest(req);
        setAdminForm({ fullName: req.farmerName, email: '', phone: req.farmerPhone });
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-10">
                <div className="h-32 w-full card-minimal animate-pulse" />
                <SkeletonCardsList count={3} className="grid grid-cols-2 lg:grid-cols-3 gap-6" />
                <SkeletonList />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-12">
            <PageHeader
                title="Association Registry"
                description="Review and authorize applications for new regional association nodes within the platform."
            />

            {/* Search + Stats */}
            <div className="space-y-8">
                <div className="relative group max-w-4xl">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by association name, applicant, or region..."
                        className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <StatCard
                        title="Pending Review"
                        value={requests.filter(r => r.status === 'pending').length.toString()}
                        icon="⌬"
                        description="Awaiting authorization"
                        trend={{ value: 'Active', isPositive: true }}
                    />
                    <StatCard
                        title="Total Requests"
                        value={requests.length.toString()}
                        icon="⧉"
                        description="All time submissions"
                    />
                    <StatCard
                        title="Approved Nodes"
                        value={requests.filter(r => r.status === 'approved').length.toString()}
                        icon="◈"
                        description="Operational associations"
                        trend={{ value: 'Secure', isPositive: true }}
                    />
                </div>
            </div>

            {/* Tab Filter */}
            <div className="flex flex-col space-y-8">
                <div className="flex items-center gap-1 border-b border-border/50 self-start">
                    {[
                        { id: 'pending', label: 'Pending' },
                        { id: 'history', label: 'History' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setFilter(tab.id as any);
                                setCurrentPage(1);
                            }}
                            className={`pb-4 px-6 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === tab.id ? 'text-primary' : 'text-muted-foreground/40 hover:text-foreground'}`}
                        >
                            {tab.label}
                            {filter === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <AssociationRequestsList
                    requests={filtered}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onVerify={handleVerify}
                    onReject={handleReject}
                />
            </div>

            {/* Approve Modal */}
            {!!selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-7 border-b border-border/50 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Authorization</p>
                                <h2 className="text-xl font-bold tracking-tight uppercase">Approve Association</h2>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-9 h-9 rounded-xl border border-border bg-background-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95"
                            >✕</button>
                        </div>

                        <div className="p-10 space-y-8">
                            {/* Association details preview */}
                            <div className="card-minimal p-8 space-y-6">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Association Details</p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Name</p>
                                        <p className="text-[15px] font-bold text-foreground uppercase tracking-tight">{selectedRequest.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Location</p>
                                        <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{selectedRequest.region} · {selectedRequest.zone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin form */}
                            <div className="space-y-6">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Admin Account Setup</p>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                                        placeholder="Full name of association admin"
                                        value={adminForm.fullName}
                                        onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Email</label>
                                        <input
                                            type="email"
                                            className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                                            placeholder="admin@example.com"
                                            value={adminForm.email}
                                            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                                            placeholder="+251..."
                                            value={adminForm.phone}
                                            onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-4 items-start">
                                <span className="text-amber-500 text-lg shrink-0">⚠</span>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Important</p>
                                    <p className="text-[11px] text-amber-600/80 font-bold uppercase tracking-wider leading-relaxed">The assigned admin will receive full association-level access upon approval.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 px-10 py-7 border-t border-border/50 bg-background-soft/50">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="flex-1 h-12 rounded-xl border border-border bg-background text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all text-muted-foreground hover:text-foreground active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex-[2] h-12 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all"
                            >
                                ✓ Approve Association
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
