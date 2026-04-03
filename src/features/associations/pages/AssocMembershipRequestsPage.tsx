import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, StatCard, Badge, GlassModal } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { apiClient } from '../../../lib/api-client';
import { useToast } from '../../../lib/toast-context';

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
            // Use the existing endpoint that returns pending membership requests
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
            <div className="h-32 w-full bg-card rounded-xl animate-pulse" />
            <SkeletonList />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Farmer Requests"
                description="Review farmer membership join requests and contribution approvals for your association."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                <StatCard title="Pending Requests" value={pendingCount.toString()} icon="📩" description="Awaiting review" />
                <StatCard title="Approved Members" value={approvedCount.toString()} icon="✅" description="Active farmers" />
                <StatCard title="Total Requests" value={memberships.length.toString()} icon="🌾" description="All time" />
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-border px-4">
                {([{ id: 'pending', label: 'Pending' }, { id: 'history', label: 'History' }] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${filter === tab.id ? 'text-primary' : 'text-muted-foreground opacity-60 hover:opacity-100'}`}
                    >
                        {tab.label}
                        {filter === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by farmer name or phone..."
                    className="w-full h-11 bg-card border border-border/50 rounded-xl pl-11 pr-4 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/30">
                    <h2 className="text-sm font-extrabold text-foreground uppercase tracking-tight italic">Request Registry</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 mt-0.5">Farmer Membership Applications</p>
                </div>

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Farmer</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-muted-foreground text-sm">No {filter === 'pending' ? 'pending ' : ''}requests found.</td></tr>
                            )}
                            {filtered.map(m => (
                                <tr key={m.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-sm text-foreground">{m.farmerName}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{m.farmerPhone}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={statusVariant(m.status)} className="text-[10px] font-extrabold uppercase">
                                            {m.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        {m.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelected(m); setNotes(''); }}
                                                    className="h-8 px-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wider hover:bg-primary/20 transition-all"
                                                >
                                                    Review →
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 p-4">
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-muted-foreground text-sm">No requests found.</div>
                    )}
                    {filtered.map(m => (
                        <div key={m.id} className="bg-card border border-border/60 rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-sm text-foreground">{m.farmerName}</p>
                                <Badge variant={statusVariant(m.status)} className="text-[10px] font-extrabold uppercase">{m.status}</Badge>
                            </div>
                            <p className="text-[11px] font-mono text-muted-foreground">{m.farmerPhone}</p>
                            <p className="text-[10px] text-muted-foreground/60">{new Date(m.createdAt).toLocaleDateString()}</p>
                            {m.status === 'pending' && (
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => { updateMembership({ id: m.id, status: 'rejected' }); }}
                                        disabled={isUpdating}
                                        className="flex-1 h-9 rounded-lg border border-rose-500/20 text-rose-500 text-[10px] font-extrabold uppercase"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => { setSelected(m); setNotes(''); }}
                                        disabled={isUpdating}
                                        className="flex-[2] h-9 rounded-lg bg-primary text-white text-[10px] font-extrabold uppercase"
                                    >
                                        Approve →
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Modal */}
            <GlassModal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title="Review Membership Request"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => { if (selected) updateMembership({ id: selected.id, status: 'rejected' }); setSelected(null); }}
                            disabled={isUpdating}
                            className="h-10 flex-1 rounded-lg border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase hover:bg-rose-500/5 transition-all disabled:opacity-50"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => { if (selected) updateMembership({ id: selected.id, status: 'approved' }); setSelected(null); }}
                            disabled={isUpdating}
                            className="h-10 flex-[2] rounded-lg bg-primary text-white text-[10px] font-bold uppercase shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            Approve & Sync →
                        </button>
                    </div>
                }
            >
                {selected && (
                    <div className="space-y-6 py-4">
                        <div className="bg-muted/30 p-5 rounded-xl border border-border space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-70">Farmer Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Name</p>
                                    <p className="font-bold text-foreground">{selected.farmerName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Phone</p>
                                    <p className="font-bold text-foreground font-mono">{selected.farmerPhone}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Applied</p>
                                <p className="font-bold text-foreground">{new Date(selected.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Admin Notes (optional)</label>
                            <textarea
                                className="w-full h-20 bg-card border border-border rounded-lg px-4 py-3 text-xs font-bold focus:border-primary/50 outline-none transition-all placeholder:opacity-30 resize-none"
                                placeholder="e.g. verified identity, contribution data..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </GlassModal>
        </div>
    );
};
