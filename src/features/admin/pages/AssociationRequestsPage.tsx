import { useState, useCallback, useMemo } from 'react';
import { PageHeader, StatCard, GlassModal, SkeletonList, SkeletonCardsList } from '../../../shared/components/UI';
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
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Association Requests"
                description="Review and manage applications for new regional association nodes."
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by Association Name, Farmer, or Phone..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                <StatCard
                    title="Pending Requests"
                    value={requests.filter(r => r.status === 'pending').length.toString()}
                    icon="📩"
                    description="Awaiting review"
                />
                <StatCard
                    title="Total Requests"
                    value={requests.length.toString()}
                    icon="🏢"
                    description="Incoming applications"
                />
                <StatCard
                    title="Approved Nodes"
                    value={requests.filter(r => r.status === 'approved').length.toString()}
                    icon="✅"
                    description="Live associations"
                />
            </div>

            <div className="flex gap-8 border-b border-border px-4">
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
                        className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === tab.id ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'
                            }`}
                    >
                        {tab.label}
                        {filter === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all" />
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

            {/* Approve Modal - Immersive Surveillance Overlay */}
            <GlassModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Node Approval"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="h-10 flex-1 rounded-lg bg-background-soft border border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:bg-muted/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApprove}
                            className="h-10 flex-[2] rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            Approve & Sync →
                        </button>
                    </div>
                }
            >
                {selectedRequest && (
                    <div className="space-y-8 py-4">
                        <div className="bg-background-soft p-6 rounded-xl border border-border">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 opacity-70">Application Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Entity Name</p>
                                    <p className="font-bold text-lg text-foreground">{selectedRequest.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Location</p>
                                    <p className="font-bold text-base text-foreground">{selectedRequest.region} / {selectedRequest.zone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Admin Configuration</h3>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Admin Full Name</label>
                                <input
                                    type="text"
                                    className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold focus:border-primary/50 outline-none transition-all placeholder:opacity-30"
                                    placeholder="Enter full name"
                                    value={adminForm.fullName}
                                    onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Admin Email</label>
                                    <input
                                        type="email"
                                        className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold focus:border-primary/50 outline-none transition-all placeholder:opacity-30"
                                        placeholder="admin@kuntalx.com"
                                        value={adminForm.email}
                                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Admin Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold focus:border-primary/50 outline-none transition-all placeholder:opacity-30"
                                        placeholder="+251..."
                                        value={adminForm.phone}
                                        onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex gap-4 items-center">
                                <span className="text-xl">⚠️</span>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Authorization Warning</p>
                                    <p className="text-[10px] text-amber-600/80 font-medium leading-relaxed">The assigned operator will receive immediate administrative-level access.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </GlassModal>
        </div>
    );
};

