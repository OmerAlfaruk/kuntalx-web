import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { StatCard, Badge, GlassModal } from '../../../shared/components/UI';
import { useAuth } from '../../../lib/auth-context';
import { useFarmers } from '../hooks/use-farmers';
import { FarmersList } from '../components/FarmersList';
import { FarmerActionButtons } from '../components/FarmerActionButtons';

const columnHelper = createColumnHelper<any>();

export const FarmersPage = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFarmer, setSelectedFarmer] = useState<any | null>(null);

    const { data: farmers = [], isLoading } = useFarmers(searchTerm);

    const columns = useMemo(() => [
        columnHelper.accessor(row => row.name, {
            id: 'name',
            header: () => "Farmer",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('phone', {
            header: () => "Phone",
        }),
        columnHelper.accessor('woreda', {
            header: () => "Jurisdiction",
        }),
        columnHelper.accessor('capacity', {
            header: () => "Capacity",
        }),
        columnHelper.accessor('status', {
            header: () => "Status",
        }),
    ], []);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: farmers,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const activeCount = useMemo(() => farmers.filter(f => f.status === 'active').length, [farmers]);
    const totalYieldCapacity = useMemo(() => farmers.reduce((sum, f) => sum + (Number(f.capacity) || 0), 0), [farmers]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        table.setPageIndex(0);
    }, [table]);

    const handleRegisterClick = useCallback(() => {
        // Handle registration modal logic (skeleton ready)
    }, []);

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Producer Registry</p>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Farmers</h1>
                </div>
                <FarmerActionButtons onRegister={handleRegisterClick} userRole={user?.role || ''} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Nodes"
                    value={farmers.length}
                    icon="👥"
                    description="Federated producers"
                />
                <StatCard
                    title="Active Trace"
                    value={activeCount}
                    icon="✅"
                    description="Verified status"
                />
                <StatCard
                    title="Net Capacity"
                    value={`${totalYieldCapacity.toLocaleString()} qt`}
                    icon="🌾"
                    description="Aggregate yield potential"
                />
                <StatCard
                    title="Pending"
                    value={farmers.filter(f => f.status === 'pending').length}
                    icon="⏳"
                    description="Awaiting authentication"
                />
            </div>

            {/* List Interface */}
            <div className="pt-4">
                <FarmersList
                    table={table}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearch}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    setSelectedFarmer={setSelectedFarmer}
                    filteredCount={farmers.length}
                />
            </div>

            {/* Detail Identity Identity */}
            <GlassModal
                isOpen={!!selectedFarmer}
                onClose={() => setSelectedFarmer(null)}
                title="Farmer Identity"
                maxWidth="max-w-3xl"
                footer={
                    <div className="flex gap-3 w-full justify-end">
                        <button
                            onClick={() => setSelectedFarmer(null)}
                            className="px-6 py-2 rounded-lg hover:bg-background-soft text-[10px] font-bold uppercase tracking-widest border border-border transition-colors"
                        >
                            Dismiss
                        </button>
                        {selectedFarmer?.status === 'pending' && (
                            <button className="px-6 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-2">
                                Verify Credentials
                            </button>
                        )}
                        {selectedFarmer?.status === 'active' && (
                            <button className="px-6 py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2">
                                Universal Edit
                            </button>
                        )}
                    </div>
                }
            >
                {selectedFarmer && (
                    <div className="space-y-12 py-4">
                        <div className="flex gap-8 items-center border-b border-border/50 pb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl text-primary font-bold">
                                {(selectedFarmer.name && selectedFarmer.name[0]) || 'F'}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">NODE: {selectedFarmer.id.substring(0, 12)}</p>
                                <h2 className="text-3xl font-bold text-foreground tracking-tight">{selectedFarmer.name}</h2>
                                <div className="pt-1">
                                    <Badge variant={selectedFarmer.status === 'active' ? 'success' : 'warning'} className="text-[10px] px-3 font-bold uppercase tracking-widest rounded-full">
                                        {selectedFarmer.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Identity Details</h3>
                                <div className="space-y-6 bg-background-soft/50 rounded-2xl p-6 border border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Phone Number</p>
                                        <p className="font-bold text-lg text-foreground">{selectedFarmer.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Registration Date</p>
                                        <p className="font-bold text-lg text-foreground">
                                            {selectedFarmer.joinDate ? new Date(selectedFarmer.joinDate).toLocaleDateString() : 'Legacy Record'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Location</p>
                                        <p className="font-bold text-lg text-foreground">{selectedFarmer.woreda}, {selectedFarmer.region}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Capacity Matrix</h3>
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 flex justify-between items-center group shadow-minimal">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Farm Size</p>
                                            <p className="font-bold text-2xl text-foreground">{selectedFarmer.farmSize} <span className="text-xs font-normal opacity-40 ml-1">HA</span></p>
                                        </div>
                                        <div className="text-2xl text-muted-foreground/30">🗺️</div>
                                    </div>
                                    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 flex justify-between items-center group shadow-minimal">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Yield Capacity</p>
                                            <p className="font-bold text-3xl text-primary">{selectedFarmer.capacity} <span className="text-xs font-normal opacity-40 ml-1">QT</span></p>
                                        </div>
                                        <div className="text-2xl text-primary/30">🌾</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-foreground text-background dark:bg-white dark:text-primary p-8 rounded-2xl flex items-center justify-between shadow-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">Compliance Verified</p>
                                </div>
                                <p className="text-sm font-bold tracking-tight opacity-90 uppercase">Authenticated for regional trade network protocols.</p>
                            </div>
                            <div className="w-12 h-12 bg-background/10 rounded-xl flex items-center justify-center text-xl border border-background/20 opacity-60">
                                🛡️
                            </div>
                        </div>
                    </div>
                )}
            </GlassModal>
        </div>
    );
};

