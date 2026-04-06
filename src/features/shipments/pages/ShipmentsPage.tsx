import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { useAuth } from '../../../lib/auth-context';
import { PageHeader, StatCard, KuntalLoader, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useShipments, useCreateShipment } from '../hooks/use-shipments';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { Shipment } from '../types/shipment';
import { ShipmentsList } from '../components/ShipmentsList';
import { motion } from 'framer-motion';

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
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <PageHeader
                title="Logistics"
                description="Coordinate transport workflows and monitor real-time produce delivery across the network."
                actions={
                    user?.role === 'association_admin' && (
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="h-10 px-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="text-sm">+</span>
                                Schedule Delivery
                            </button>
                        </div>
                    )
                }
            />

            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by plate, driver, or order ID..."
                    className="w-full h-14 bg-background-soft border border-border rounded-2xl pl-14 pr-6 text-[13px] font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={1} /> : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-4">
                    <StatCard
                        title="Active Loads"
                        value={shipments.filter((s: Shipment) => s.status !== 'delivered' && s.status !== 'cancelled').length}
                        icon="🚚"
                        description="Assigned containers"
                        delay={0.1}
                    />
                    <StatCard
                        title="In Transit"
                        value={shipments.filter((s: Shipment) => s.status === 'in_transit').length}
                        icon="🛣️"
                        description="Live moving assets"
                        delay={0.2}
                    />
                    <StatCard
                        title="Delivered"
                        value={shipments.filter((s: Shipment) => s.status === 'delivered').length}
                        icon="✅"
                        description="Completed trade cycles"
                        delay={0.3}
                    />
                    <StatCard
                        title="Efficiency"
                        value="98.2%"
                        icon="⏱️"
                        description="On-time delivery index"
                        delay={0.4}
                    />
                </div>
            )}

            <div className="flex gap-8 border-b border-border/50 px-2 mb-6">
                <button
                    onClick={() => {
                        setActiveTab('active');
                        table.setPageIndex(0);
                    }}
                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'active' ? 'text-primary' : 'text-muted-foreground/40 hover:text-foreground'
                        }`}
                >
                    Live Operations
                    {activeTab === 'active' && <motion.div layoutId="shipmentTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => {
                        setActiveTab('history');
                        table.setPageIndex(0);
                    }}
                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground/40 hover:text-foreground'
                        }`}
                >
                    Archive
                    {activeTab === 'history' && <motion.div layoutId="shipmentTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
            </div>

            {showFullLoader ? <SkeletonList rows={5} /> : (
                <div className="card-minimal overflow-hidden">
                    <div className="px-8 py-5 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Directory</h2>
                    </div>
                    <ShipmentsList
                        table={table}
                        isLoading={isLoading}
                        navigate={navigate}
                    />
                    <div className="border-t border-border/50">
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={filteredShipments.length}
                            pageSize={pageSize}
                            onPageChange={(page) => table.setPageIndex(page - 1)}
                        />
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Schedule Delivery</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Assign logistics for an order</p>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-background border border-border/50 p-6 rounded-2xl flex gap-6 items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl text-primary shrink-0">
                                    🚚
                                </div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">New Assignment</p>
                                    <p className="text-[13px] text-foreground font-medium">Enter logistics details to coordinate transport from the regional hub to the buyer terminal.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Order Reference</label>
                                <input
                                    type="text"
                                    className="w-full h-12 bg-background-soft border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="e.g. ORD-1004"
                                    value={shipmentForm.orderId}
                                    onChange={(e) => setShipmentForm({ ...shipmentForm, orderId: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Transport Units ({vehicles.length})</h3>
                                    <button
                                        onClick={addVehicle}
                                        className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                                    >
                                        + Add Vehicle
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {vehicles.map((vehicle, i) => (
                                        <div key={i} className="p-6 rounded-2xl border border-border/50 bg-background-soft/50 space-y-6 relative group">
                                            <div className="flex items-center justify-between pb-2 border-b border-border/30">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Unit {i + 1}</span>
                                                {vehicles.length > 1 && (
                                                    <button
                                                        onClick={() => removeVehicle(i)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Plate</label>
                                                    <input
                                                        type="text"
                                                        className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
                                                        placeholder="ETH-A-2234"
                                                        value={vehicle.vehiclePlate}
                                                        onChange={(e) => updateVehicle(i, 'vehiclePlate', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Driver</label>
                                                    <input
                                                        type="text"
                                                        className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
                                                        placeholder="Name"
                                                        value={vehicle.driverName}
                                                        onChange={(e) => updateVehicle(i, 'driverName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Contact</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Estimated Arrival</label>
                                <input
                                    type="date"
                                    className="w-full h-12 bg-background-soft border border-border rounded-xl px-4 text-[13px] font-bold text-muted-foreground focus:border-primary/50 outline-none transition-all"
                                    value={shipmentForm.estimatedDelivery}
                                    onChange={(e) => setShipmentForm({ ...shipmentForm, estimatedDelivery: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isCreating || !shipmentForm.orderId}
                                onClick={handleCreateShipment}
                                className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <KuntalLoader variant="small" />
                                ) : (
                                    <>Confirm Deployment</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
