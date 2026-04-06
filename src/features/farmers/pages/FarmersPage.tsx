import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { StatCard, Badge } from '../../../shared/components/UI';
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
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50">
                <div className="space-y-1">
                    <h1 className="text-[28px] font-bold text-foreground tracking-tight">Farmers</h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry of federated producers and verified yield capacity</p>
                </div>
                <FarmerActionButtons onRegister={handleRegisterClick} userRole={user?.role || ''} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                <StatCard
                    title="Total Farmers"
                    value={farmers.length}
                    icon="👥"
                    description="Federated producers"
                    delay={0.1}
                />
                <StatCard
                    title="Active"
                    value={activeCount}
                    icon="✅"
                    description="Verified status"
                    delay={0.2}
                />
                <StatCard
                    title="Net Capacity"
                    value={`${totalYieldCapacity.toLocaleString()} qt`}
                    icon="🌾"
                    description="Aggregate potential"
                    delay={0.3}
                />
                <StatCard
                    title="Pending"
                    value={farmers.filter(f => f.status === 'pending').length}
                    icon="⏳"
                    description="Awaiting authentication"
                    delay={0.4}
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
            {selectedFarmer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Farmer Detail</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Review producer credentials</p>
                        </div>
                        
                        <div className="p-8 space-y-12 overflow-y-auto custom-scrollbar">
                            <div className="flex gap-6 items-center border-b border-border/50 pb-8">
                                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-xl text-primary font-bold shrink-0 shadow-minimal">
                                    {(selectedFarmer.name && selectedFarmer.name[0]) || 'F'}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">#{selectedFarmer.id.substring(0, 12)}</p>
                                    <h2 className="text-[20px] font-bold text-foreground tracking-tight">{selectedFarmer.name}</h2>
                                    <div className="pt-1">
                                        <Badge variant={selectedFarmer.status === 'active' ? 'success' : 'warning'}>
                                            {selectedFarmer.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Identity Details</h3>
                                    <div className="space-y-6 bg-background-soft rounded-2xl p-6 border border-border/50">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Phone Number</p>
                                            <p className="font-bold text-[14px] text-foreground tracking-tight">{selectedFarmer.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Registration Date</p>
                                            <p className="font-bold text-[14px] text-foreground tracking-tight">
                                                {selectedFarmer.joinDate ? new Date(selectedFarmer.joinDate).toLocaleDateString() : 'Legacy Record'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Location</p>
                                            <p className="font-bold text-[14px] text-foreground tracking-tight">{selectedFarmer.woreda}, {selectedFarmer.region}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Capacity Matrix</h3>
                                    <div className="space-y-3">
                                        <div className="bg-background border border-border rounded-2xl p-6 flex justify-between items-center shadow-minimal">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Farm Size</p>
                                                <p className="font-bold text-[18px] text-foreground tracking-tight">{selectedFarmer.farmSize} <span className="text-[11px] font-bold text-muted-foreground ml-1">HA</span></p>
                                            </div>
                                            <div className="text-2xl text-muted-foreground/30">🗺️</div>
                                        </div>
                                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex justify-between items-center shadow-minimal">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Yield Capacity</p>
                                                <p className="font-bold text-[22px] text-primary tracking-tight">{selectedFarmer.capacity} <span className="text-[11px] font-bold text-primary/50 ml-1">QT</span></p>
                                            </div>
                                            <div className="text-2xl opacity-80">🌾</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-background-soft border border-border/50 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Compliance Verified</p>
                                    </div>
                                    <p className="text-[11px] font-medium text-muted-foreground">Authenticated for regional trade network protocols.</p>
                                </div>
                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-lg text-emerald-500 shrink-0">
                                    🛡️
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0 justify-end">
                            <button
                                onClick={() => setSelectedFarmer(null)}
                                className="h-11 px-8 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                            >
                                Close
                            </button>
                            {selectedFarmer?.status === 'pending' && (
                                <button className="h-11 px-8 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-minimal">
                                    Verify Farmer
                                </button>
                            )}
                            {selectedFarmer?.status === 'active' && (
                                <button className="h-11 px-8 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all shadow-minimal">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
