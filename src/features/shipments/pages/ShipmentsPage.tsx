import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useAuth } from '../../../lib/auth-context';
import { PageHeader, StatCard, GlassModal, KuntalLoader, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useShipments, useCreateShipment } from '../hooks/use-shipments';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { Shipment } from '../types/shipment';
import { ShipmentsList } from '../components/ShipmentsList';

const columnHelper = createColumnHelper<Shipment>();

export const ShipmentsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: shipments = [], isLoading } = useShipments(undefined, debouncedSearchTerm);
    const { mutateAsync: createShipment, isPending: isCreating } = useCreateShipment();

    type VehicleEntry = { vehiclePlate: string; driverName: string; driverPhone: string };
    const emptyVehicle = (): VehicleEntry => ({ vehiclePlate: '', driverName: '', driverPhone: '' });

    const [shipmentForm, setShipmentForm] = useState({
        orderId: '',
        estimatedDelivery: '',
    });
    const [vehicles, setVehicles] = useState<VehicleEntry[]>([emptyVehicle()]);

    const updateVehicle = useCallback((index: number, field: keyof VehicleEntry, value: string) => {
        setVehicles(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
    }, []);

    const addVehicle = useCallback(() => {
        setVehicles(prev => [...prev, emptyVehicle()]);
    }, []);

    const removeVehicle = useCallback((index: number) => {
        setVehicles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const showFullLoader = isLoading && (shipments as Shipment[]).length === 0;

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => "ID",
        }),
        columnHelper.accessor('orderId', {
            header: () => "Order",
        }),
        columnHelper.accessor('expectedArrivalDate', {
            header: () => "Estimated Arrival",
        }),
        columnHelper.accessor('status', {
            header: () => "Status",
        }),
    ], []);

    const filteredShipments = useMemo(() => {
        return (shipments as Shipment[]).filter((s) =>
            activeTab === 'active'
                ? ['pending', 'in_transit'].includes(s.status)
                : ['delivered', 'delayed', 'cancelled'].includes(s.status)
        );
    }, [shipments, activeTab]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filteredShipments,
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

    const handleCreateShipment = useCallback(async () => {
        try {
            const payload = {
                orderId: shipmentForm.orderId,
                expectedArrivalDate: shipmentForm.estimatedDelivery,
                vehicles: vehicles
                    .filter(v => v.vehiclePlate.trim())
                    .map(v => ({
                        vehicleNumber: v.vehiclePlate,
                        driverName: v.driverName,
                        driverPhone: v.driverPhone,
                    })),
            };
            await createShipment(payload);
            setIsCreateModalOpen(false);
            setShipmentForm({ orderId: '', estimatedDelivery: '' });
            setVehicles([emptyVehicle()]);
        } catch (error) {
            console.error('Failed to create shipment', error);
        }
    }, [shipmentForm, vehicles, createShipment]);

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <PageHeader
                title="Shipments"
                description={user?.role === 'association_admin'
                    ? "Coordinate logistics and monitor active produce deliveries across the network."
                    : "Track live shipments and estimated arrival times for incoming assets."}
                actions={
                    user?.role === 'association_admin' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-10 px-6 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <span>🚛</span>
                            Schedule Delivery
                        </button>
                    )
                }
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by Plate, Driver, or Order ID..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={1} /> : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        title="Active Loads"
                        value={shipments.filter((s: Shipment) => s.status !== 'delivered' && s.status !== 'cancelled').length}
                        icon="🚚"
                        description="Currently coordinated"
                    />
                    <StatCard
                        title="In Transit"
                        value={shipments.filter((s: Shipment) => s.status === 'in_transit').length}
                        icon="🛣️"
                        description="Moving produce"
                    />
                    <StatCard
                        title="Delivered"
                        value={shipments.filter((s: Shipment) => s.status === 'delivered').length}
                        icon="✅"
                        description="Successfully completed"
                    />
                    <StatCard
                        title="Avg Cycle"
                        value="4.2d"
                        icon="⏱️"
                        description="Calculated average"
                    />
                </div>
            )}

            <div className="flex gap-8 border-b border-border/50">
                <button
                    onClick={() => {
                        setActiveTab('active');
                        table.setPageIndex(0);
                    }}
                    className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'active' ? 'text-primary' : 'text-muted-foreground/60 hover:text-foreground'
                        }`}
                >
                    Live Operations
                    {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => {
                        setActiveTab('history');
                        table.setPageIndex(0);
                    }}
                    className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground/60 hover:text-foreground'
                        }`}
                >
                    History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
            </div>

            {showFullLoader ? <SkeletonList rows={5} /> : (
                <div className="card-minimal overflow-hidden">
                    <ShipmentsList 
                        table={table} 
                        isLoading={isLoading}
                        navigate={navigate} 
                    />
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={filteredShipments.length}
                        pageSize={pageSize}
                        onPageChange={(page) => table.setPageIndex(page - 1)}
                    />
                </div>
            )}

            <GlassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Schedule Delivery"
                maxWidth="max-w-3xl"
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="px-6 py-2 rounded-lg hover:bg-background-soft text-[10px] font-bold uppercase tracking-widest border border-border transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isCreating}
                            onClick={handleCreateShipment}
                            className="px-8 py-2 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            {isCreating ? (
                                <KuntalLoader variant="small" />
                            ) : (
                                <>Confirm Deployment</>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-10 py-2">
                    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 flex gap-6 items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl text-primary">
                            🚚
                        </div>
                        <div className="space-y-1 flex-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">New Assignment</p>
                            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">Enter logistics details to coordinate transport from the regional hub to the buyer terminal.</p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Order ID Attachment</label>
                        <input
                            type="text"
                            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="e.g. ORD-1004"
                            value={shipmentForm.orderId}
                            onChange={(e) => setShipmentForm({ ...shipmentForm, orderId: e.target.value })}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Logistics Nodes ({vehicles.length})</h3>
                            <button
                                onClick={addVehicle}
                                className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                            >
                                + Add Vehicle
                            </button>
                        </div>

                        <div className="space-y-4">
                            {vehicles.map((vehicle, i) => (
                                <div key={i} className="p-6 rounded-xl border border-border bg-background-soft/30 space-y-6 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">Unit {i + 1}</span>
                                        {vehicles.length > 1 && (
                                            <button
                                                onClick={() => removeVehicle(i)}
                                                className="text-muted-foreground hover:text-rose-500 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Plate</label>
                                            <input
                                                type="text"
                                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none transition-all"
                                                placeholder="ETH-A-2234"
                                                value={vehicle.vehiclePlate}
                                                onChange={(e) => updateVehicle(i, 'vehiclePlate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Driver</label>
                                            <input
                                                type="text"
                                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-xs font-bold focus:border-primary outline-none transition-all"
                                                placeholder="Name"
                                                value={vehicle.driverName}
                                                onChange={(e) => updateVehicle(i, 'driverName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Contact</label>
                                            <input
                                                type="tel"
                                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-xs font-bold focus:border-primary outline-none transition-all"
                                                placeholder="+251 9..."
                                                value={vehicle.driverPhone}
                                                onChange={(e) => updateVehicle(i, 'driverPhone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Estimated Arrival</label>
                        <input
                            type="date"
                            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-bold focus:border-primary outline-none transition-all"
                            value={shipmentForm.estimatedDelivery}
                            onChange={(e) => setShipmentForm({ ...shipmentForm, estimatedDelivery: e.target.value })}
                        />
                    </div>
                </div>
            </GlassModal>
        </div>
    );
};
