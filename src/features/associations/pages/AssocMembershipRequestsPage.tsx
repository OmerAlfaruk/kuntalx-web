import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, StatCard, Badge } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { apiClient } from '../../../lib/api-client';
import { useToast } from '../../../lib/toast-context';
import { motion } from 'framer-motion';

type MembershipStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface MembershipRequest {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    associationId: string;
    status: MembershipStatus;
    notes: string | null;
    createdAt: string;
}

const useAssocMemberships = () =>
    useQuery<MembershipRequest[]>({
        queryKey: ['assoc-memberships'],
        queryFn: async () => {
            const pendingData = await apiClient.get<any[]>('/associations/requests/pending');
            return pendingData.map((m: any) => ({
                id: m.id,
                farmerId: m.farmer_id,
                farmerName: m.farmer_name || m.farmer?.user?.full_name || m.farmer?.full_name || 'Unknown Farmer',
                farmerPhone: m.farmer_phone || m.farmer?.user?.phone || '—',
                associationId: m.association_id,
                status: m.status,
                notes: m.notes ?? null,
                createdAt: m.created_at,
            }));
        },
    });

const useUpdateMembership = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
            apiClient.patch(`/associations/requests/${id}`, { status }),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['assoc-memberships'] });
            toast.success(`Request ${variables.status} successfully`);
        },
        onError: () => toast.error('Failed to update request'),
    });
};

const statusVariant = (s: MembershipStatus): any => {
    switch (s) {
        case 'approved': return 'success';
        case 'pending': return 'warning';
        case 'rejected': return 'error';
        case 'cancelled': return 'outline';
    }
};

export const AssocMembershipRequestsPage = () => {
    const { data: memberships = [], isLoading } = useAssocMemberships();
    const { mutate: updateMembership, isPending: isUpdating } = useUpdateMembership();
    const [filter, setFilter] = useState<'pending' | 'history'>('pending');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<MembershipRequest | null>(null);
    const [notes, setNotes] = useState('');

    const filtered = useMemo(() => {
        const byStatus = filter === 'pending'
            ? memberships.filter(m => m.status === 'pending')
            : memberships.filter(m => m.status !== 'pending');
        return byStatus.filter(m =>
            search === '' ||
            m.farmerName.toLowerCase().includes(search.toLowerCase()) ||
            m.farmerPhone.includes(search)
        );
    }, [memberships, filter, search]);

    const pendingCount = memberships.filter(m => m.status === 'pending').length;
    const approvedCount = memberships.filter(m => m.status === 'approved').length;

    if (isLoading) return (
        <div className="space-y-10">
            <div className="h-32 w-full bg-background-soft rounded-2xl animate-pulse border border-border" />
            <SkeletonList />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-16">
            <PageHeader
                title="Membership Requests"
                description="Review and validate new farmers joining your association."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <StatCard title="Active Requests" value={pendingCount.toString()} icon="📩" description="Pending Verification" />
                <StatCard title="Verified Farmers" value={approvedCount.toString()} icon="✅" description="Active network members" />
                <StatCard title="Total Volume" value={memberships.length.toString()} icon="👥" description="All-time requests" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-8 border-b border-border/50 px-2 w-full md:w-auto">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === 'pending' ? 'text-primary' : 'text-muted-foreground/40 hover:text-foreground'}`}
                    >
                        Pending Review
                        {filter === 'pending' && <motion.div layoutId="requestTabs" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button
                        onClick={() => setFilter('history')}
                        className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === 'history' ? 'text-primary' : 'text-muted-foreground/40 hover:text-foreground'}`}
                    >
                        History
                        {filter === 'history' && <motion.div layoutId="requestTabs" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                </div>

                <div className="relative flex-1 md:max-w-md group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full h-12 bg-background-soft border border-border rounded-xl pl-12 pr-6 text-[13px] font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card-minimal overflow-hidden">
                <header className="px-8 py-5 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Registration Queue</h2>
                    </div>
                    <Badge variant="outline" className="h-6 px-3 rounded-md text-[9px] font-bold uppercase tracking-widest shadow-none">{filtered.length} Request{filtered.length !== 1 && 's'}</Badge>
                </header>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-background-soft/30">
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Farmer</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Submitted</th>
                                <th className="px-8 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-3xl opacity-30 mx-auto animate-pulse mb-6">📩</div>
                                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">No Requests Found</h4>
                                </td></tr>
                            )}
                            {filtered.map(m => (
                                <tr key={m.id} className="hover:bg-background-soft/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {m.farmerName[0].toUpperCase()}
                                            </div>
                                            <span className="text-[13px] font-bold text-foreground">{m.farmerName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <code className="text-[11px] font-bold text-muted-foreground tracking-widest">{m.farmerPhone}</code>
                                    </td>
                                    <td className="px-8 py-5">
                                        <Badge variant={statusVariant(m.status)} className="capitalize">
                                            {m.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[11px] font-bold text-muted-foreground tracking-widest">{new Date(m.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {m.status === 'pending' && (
                                            <button
                                                onClick={() => { setSelected(m); setNotes(''); }}
                                                className="h-9 px-6 rounded-lg bg-background border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all ml-auto shadow-minimal"
                                            >
                                                Review
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden divide-y divide-border/50">
                    {filtered.length === 0 && (
                        <div className="py-20 text-center opacity-40">
                             <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">No requests found</h4>
                        </div>
                    )}
                    {filtered.map(m => (
                        <div key={m.id} className="p-6 bg-background-soft/30 space-y-5">
                            <div className="flex items-center gap-5 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                        {m.farmerName[0].toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[13px] font-bold text-foreground leading-none">{m.farmerName}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{m.farmerPhone}</p>
                                    </div>
                                </div>
                                <Badge variant={statusVariant(m.status)} className="capitalize shrink-0">{m.status}</Badge>
                            </div>
                            
                            <div className="py-4 border-y border-border/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                <p>Submitted</p>
                                <p className="text-foreground">{new Date(m.createdAt).toLocaleDateString()}</p>
                            </div>

                            {m.status === 'pending' && (
                                <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => { updateMembership({ id: m.id, status: 'rejected' }); }}
                                        disabled={isUpdating}
                                        className="w-11 h-11 rounded-xl border border-border bg-background flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-colors shadow-minimal"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                    <button
                                        onClick={() => { setSelected(m); setNotes(''); }}
                                        disabled={isUpdating}
                                        className="flex-1 h-11 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center"
                                    >
                                        Review Detail
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Review Membership Request</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Accept or reject farmer</p>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-background border border-border/50 p-6 rounded-2xl flex gap-6 items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl text-primary font-bold shrink-0">
                                    {selected.farmerName[0].toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Farmer Identifier</p>
                                    <p className="text-[18px] font-bold text-foreground tracking-tight">{selected.farmerName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-background-soft p-6 rounded-2xl border border-border/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Phone / Contact</p>
                                    <p className="text-[13px] font-bold text-foreground tracking-widest">{selected.farmerPhone}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Date Submitted</p>
                                    <p className="text-[13px] font-bold text-foreground tracking-widest">{new Date(selected.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Administrative Notes (Optional)</label>
                                <textarea
                                    className="w-full h-28 bg-background-soft border border-border rounded-xl p-4 text-[13px] font-medium focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                                    placeholder="Add reason for approval/rejection..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                            <button
                                onClick={() => { if (selected) updateMembership({ id: selected.id, status: 'rejected' }); setSelected(null); }}
                                disabled={isUpdating}
                                className="h-11 flex-1 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-minimal"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => { if (selected) updateMembership({ id: selected.id, status: 'approved' }); setSelected(null); }}
                                disabled={isUpdating}
                                className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all"
                            >
                                Approve Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
