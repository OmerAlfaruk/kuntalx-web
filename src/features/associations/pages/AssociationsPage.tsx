import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PageHeader, StatCard, GlassModal, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useAuth } from '../../../lib/auth-context';
import { useAssociations } from '../hooks/use-associations.ts';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { Association } from '../../admin/types/admin';
import { useUsers } from '../../users';
import { AssociationsList } from '../components/AssociationsList';

const columnHelper = createColumnHelper<Association>();

export const AssociationsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { associations, isLoading, createAssociation, updateAssociation, deleteAssociation } = useAssociations(debouncedSearchTerm);
    const { users: farmers } = useUsers({ role: 'farmer' });

    const filteredAssociations = useMemo(() => {
        return user?.role === 'association_admin'
            ? associations.filter(a => a.adminUserId === user.id)
            : associations;
    }, [user, associations]);

    const totalProducers = useMemo(() => {
        return filteredAssociations.reduce((acc, a) => acc + (a.membershipCount || 0), 0);
    }, [filteredAssociations]);

    const activeAggregations = useMemo(() => {
        return filteredAssociations.reduce((acc, a) => acc + (a.activeAggregationsCount || 0), 0);
    }, [filteredAssociations]);

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: () => "Association",
        }),
        columnHelper.accessor('region', {
            header: () => "Region",
        }),
        columnHelper.accessor('membershipCount', {
            header: () => "Producers",
        }),
        columnHelper.accessor('activeAggregationsCount', {
            header: () => "Active Cycles",
        }),
    ], []);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filteredAssociations,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAssoc, setSelectedAssoc] = useState<Association | null>(null);
    const [assocForm, setAssocForm] = useState({
        name: '',
        region: '',
        zone: '',
        woreda: '',
        contactPhone: '',
        description: '',
        adminUserId: ''
    });

    const handleCreate = useCallback(async () => {
        await createAssociation(assocForm);
        setIsCreateModalOpen(false);
        setAssocForm({ name: '', region: '', zone: '', woreda: '', contactPhone: '', description: '', adminUserId: '' });
    }, [createAssociation, assocForm]);

    const handleUpdate = useCallback(async () => {
        if (selectedAssoc) {
            await updateAssociation({ id: selectedAssoc.id, data: assocForm });
            setSelectedAssoc(null);
            setAssocForm({ name: '', region: '', zone: '', woreda: '', contactPhone: '', description: '', adminUserId: '' });
        }
    }, [updateAssociation, selectedAssoc, assocForm]);

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Are you sure you want to delete this association?')) {
            await deleteAssociation(id);
        }
    }, [deleteAssociation]);

    const onEdit = useCallback((assoc: Association) => {
        setSelectedAssoc(assoc);
        setAssocForm({
            name: assoc.name,
            region: assoc.region,
            zone: assoc.zone || '',
            woreda: assoc.woreda,
            contactPhone: assoc.contactPhone || '',
            description: assoc.description || '',
            adminUserId: assoc.adminUserId
        });
    }, []);

    const showFullLoader = isLoading && associations.length === 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
            <PageHeader
                title="Associations"
                description="Manage regional unions and agricultural associations across the procurement network."
                actions={
                    user?.role === 'platform_admin' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-10 px-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <span>🏢</span>
                            Register Association
                        </button>
                    )
                }
            />

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group max-w-4xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by association name, region, or ID..."
                        className="w-full h-14 bg-background-soft border border-border rounded-2xl pl-12 pr-6 text-[13px] font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            table.setPageIndex(0);
                        }}
                    />
                </div>
            </div>

            {showFullLoader ? <SkeletonCardsList count={3} /> : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <StatCard
                        title="Registered Hubs"
                        value={associations.length}
                        icon="🏢"
                        description="Verified regional unions"
                    />
                    <StatCard
                        title="Federated Producers"
                        value={totalProducers.toLocaleString()}
                        icon="👥"
                        description="Aggregate network scale"
                    />
                    <StatCard
                        title="Active Aggregations"
                        value={activeAggregations}
                        icon="📈"
                        description="Ongoing cycles"
                    />
                </div>
            )}

            <div className="card-minimal overflow-hidden">
                {showFullLoader ? <SkeletonList rows={5} /> : (
                    <>
                        <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 leading-none">Regional Association Registry</h2>
                        </div>
                        <AssociationsList
                            table={table}
                            isLoading={isLoading}
                            navigate={navigate}
                            userRole={user?.role}
                            onEdit={onEdit}
                            onDelete={handleDelete}
                        />
                        <div className="px-10 py-6 border-t border-border/50 bg-background-soft/50">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={filteredAssociations.length}
                                pageSize={pageSize}
                                onPageChange={(page) => table.setPageIndex(page - 1)}
                            />
                        </div>
                    </>
                )}      </div>

            <GlassModal
                isOpen={isCreateModalOpen || !!selectedAssoc}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedAssoc(null);
                    setAssocForm({ name: '', region: '', zone: '', woreda: '', contactPhone: '', description: '', adminUserId: '' });
                }}
                title={selectedAssoc ? 'Update Profile' : 'Register Association'}
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <button
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setSelectedAssoc(null);
                            }}
                            className="px-6 py-2 rounded-lg hover:bg-background-soft text-[10px] font-bold uppercase tracking-widest border border-border transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={selectedAssoc ? handleUpdate : handleCreate}
                            className="px-6 py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all"
                        >
                            {selectedAssoc ? 'Save Changes' : 'Confirm Registration'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-8 py-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Legal Name</label>
                        <input
                            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                            value={assocForm.name}
                            onChange={(e) => setAssocForm({ ...assocForm, name: e.target.value })}
                            placeholder="e.g. Oromia West Union"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Region</label>
                            <input
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                                value={assocForm.region}
                                onChange={(e) => setAssocForm({ ...assocForm, region: e.target.value })}
                                placeholder="e.g. Oromia"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Zone</label>
                            <input
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                                value={assocForm.zone}
                                onChange={(e) => setAssocForm({ ...assocForm, zone: e.target.value })}
                                placeholder="e.g. East Shewa"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Woreda</label>
                            <input
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                                value={assocForm.woreda}
                                onChange={(e) => setAssocForm({ ...assocForm, woreda: e.target.value })}
                                placeholder="e.g. Bishoftu"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Contact Phone</label>
                            <input
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                                value={assocForm.contactPhone}
                                onChange={(e) => setAssocForm({ ...assocForm, contactPhone: e.target.value })}
                                placeholder="e.g. +251 9..."
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Association Admin</label>
                        <select
                            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all appearance-none"
                            value={assocForm.adminUserId}
                            onChange={(e) => setAssocForm({ ...assocForm, adminUserId: e.target.value })}
                        >
                            <option value="" disabled>Select Administrator</option>
                            {farmers?.map((farmer: any) => (
                                <option className='bg-background text-foreground' key={farmer.id} value={farmer.id}>
                                    {farmer.fullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Mission Description</label>
                        <textarea
                            className="w-full h-32 bg-background border border-border rounded-lg p-4 text-sm font-bold focus:border-primary outline-none transition-all resize-none"
                            value={assocForm.description}
                            onChange={(e) => setAssocForm({ ...assocForm, description: e.target.value })}
                            placeholder="Describe organizational scope..."
                        />
                    </div>
                </div>
            </GlassModal>
        </div>
    );
};
