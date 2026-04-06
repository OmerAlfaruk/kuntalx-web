import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useActiveFleet } from '../../dashboard/hooks/use-dashboard-data';
import { PageHeader, Badge } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { FleetVehicleList } from '../components/FleetVehicleList';

// Custom truck icons - initialized lazily
const getIcons = () => {
    return {
        truck: new L.Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35],
        }),
        delayedTruck: new L.Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [0, -35],
            className: 'filter-sepia'
        })
    };
};

export const FleetMapPage = () => {
    const { data, isLoading } = useActiveFleet();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [icons, setIcons] = useState<ReturnType<typeof getIcons> | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        // Fix for default leaflet marker icons in React/Vite
        if (L.Icon.Default) {
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
        setIcons(getIcons());
    }, []);

    const activeVehicles = useMemo(() => data?.vehicles || [], [data?.vehicles]);

    const handleSelectVehicle = useCallback((id: string) => {
        setSelectedVehicleId(id);
        setIsPanelOpen(true);
    }, []);

    // Initial center: Ethiopia (Addis Ababa area)
    const initialCenter: [number, number] = [9.012, 38.751];

    if (isLoading && !icons) {
        return (
            <div className="min-h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-500 pb-6">
                <PageHeader title="Global Fleet Map" description="Loading real-time fleet map..." />
                <div className="flex-1 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-background rounded-2xl border border-border shadow-minimal animate-pulse flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold tracking-widest"> Synchronization... </div>
                    <div className="w-full lg:w-[350px] space-y-4">
                        <SkeletonList rows={8} />
                    </div>
                </div>
            </div>
        );
    }

    if (!icons) return null;

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-6">
            <PageHeader
                title="Fleet Command"
                description="Real-time multi-vector monitoring of active logistical assets and regional delivery routes."
                actions={
                    <div className="flex flex-wrap items-center gap-4 px-6 py-3 bg-background-soft border border-border rounded-xl shadow-minimal w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Active Tracking</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            {activeVehicles.length} Vehicles
                        </span>
                        {/* Mobile panel toggle */}
                        <button
                            className="lg:hidden ml-auto h-9 px-5 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-minimal"
                            onClick={() => setIsPanelOpen(v => !v)}
                        >
                            <span>≡</span> {isPanelOpen ? 'HIDE PANEL' : 'SHOW VEHICLES'}
                        </button>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden min-h-[500px] lg:min-h-0">
                {/* Map Container */}
                <div className="flex-1 min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden border border-border shadow-minimal relative bg-background">
                    <MapContainer
                        center={initialCenter}
                        zoom={6}
                        zoomControl={false}
                        className="w-full h-full z-0 contrast-[1]"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomright" />

                        {icons && activeVehicles.map((vehicle: any) => (
                            vehicle.location && (
                                <Marker
                                    key={vehicle.shipmentVehicleId}
                                    position={[vehicle.location.latitude, vehicle.location.longitude]}
                                    icon={vehicle.shipmentStatus === 'delayed' ? icons.delayedTruck : icons.truck}
                                    eventHandlers={{
                                        click: () => {
                                            setSelectedVehicleId(vehicle.shipmentVehicleId);
                                            setIsPanelOpen(true);
                                        },
                                    }}
                                >
                                    <Popup className="premium-popup">
                                        <div className="p-4 bg-background border border-border rounded-xl space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Vehicle Plate</p>
                                                <p className="text-sm font-bold text-foreground truncate">{vehicle.vehicleNumber}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Payload</p>
                                                    <p className="text-[12px] font-bold text-foreground uppercase tracking-widest">{vehicle.cargoQuantity} QT</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Status</p>
                                                    <Badge variant={vehicle.shipmentStatus === 'delayed' ? 'error' : 'success'} className="text-[9px] h-5 px-3 tracking-widest">
                                                        {vehicle.shipmentStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>

                    {/* Overlay Info for empty locations */}
                    {activeVehicles.filter((v: any) => !v.location).length > 0 && (
                        <div className="absolute top-6 left-6 z-[1000] bg-background border border-border p-5 rounded-2xl shadow-minimal animate-in slide-in-from-left-4 duration-500">
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">Location Pending</p>
                            <div className="flex -space-x-3 items-center">
                                {activeVehicles.filter((v: any) => !v.location).map((v: any) => (
                                    <div key={v.shipmentVehicleId} title={v.vehicleNumber} className="w-10 h-10 rounded-full bg-background-soft border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground relative transition-all hover:z-10 shadow-sm">
                                        {v.vehicleNumber.slice(-2)}
                                    </div>
                                ))}
                                <span className="ml-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Syncing...</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* Info Panel — always visible on lg, toggleable on mobile */}
                <div className={`w-full lg:w-[400px] bg-background border border-border rounded-2xl flex flex-col overflow-hidden shrink-0 transition-all duration-700 shadow-minimal
                    ${isPanelOpen ? 'max-h-[500px] lg:max-h-none' : 'max-h-0 lg:max-h-none overflow-hidden lg:overflow-visible'}`}>
                    <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background-soft/50">
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-[13px] text-foreground flex items-center gap-3">
                                {isLoading ? 'SYNCING...' : 'FLEET DIRECTORY'}
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Active assignments</p>
                        </div>
                        {!isLoading && <Badge variant="primary" className="text-[10px] px-3">{activeVehicles.length} UNITS</Badge>}
                    </div>

                    {isLoading ? (
                        <div className="p-8">
                            <SkeletonList rows={8} />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden">
                            <FleetVehicleList
                                vehicles={activeVehicles}
                                selectedVehicleId={selectedVehicleId}
                                onSelectVehicle={handleSelectVehicle}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
