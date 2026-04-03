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
                <PageHeader title="Global Fleet Map" description="Loading real-time surveillance surveillance..." />
                <div className="flex-1 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-card rounded-xl border border-border shadow-minimal animate-pulse flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold tracking-widest"> Synchronizing Grid... </div>
                    <div className="w-full lg:w-[350px] space-y-4">
                        <SkeletonList rows={8} />
                    </div>
                </div>
            </div>
        );
    }

    if (!icons) return null;

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col space-y-4 sm:space-y-6 animate-in fade-in duration-500 pb-6">
            <PageHeader
                title="Fleet Navigation"
                description="Real-time monitoring of active shipments and delivery routes across the platform."
                actions={
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-card border border-border rounded-lg shadow-sm w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Active Monitoring</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-border" />
                        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {activeVehicles.length} Active Vehicles
                        </span>
                        {/* Mobile panel toggle */}
                        <button
                            className="lg:hidden ml-auto h-8 px-3 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-primary/20"
                            onClick={() => setIsPanelOpen(v => !v)}
                        >
                            🚛 {isPanelOpen ? 'Hide' : 'List'} ({activeVehicles.length})
                        </button>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 overflow-hidden min-h-[500px] lg:min-h-0">
                {/* Map Container */}
                <div className="flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-0 rounded-xl overflow-hidden border border-border shadow-minimal relative bg-card">
                    <MapContainer
                        center={initialCenter}
                        zoom={6}
                        zoomControl={false}
                        className="w-full h-full z-0"
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
                                        <div className="p-2">
                                            <p className="font-bold text-sm text-primary mb-1">{vehicle.vehicleNumber}</p>
                                            <p className="text-xs text-muted-foreground font-medium mb-2">{vehicle.cargoType} • {vehicle.cargoQuantity} QT</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={vehicle.shipmentStatus === 'delayed' ? 'error' : 'success'} className="text-xs py-0">
                                                    {vehicle.shipmentStatus.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>

                    {/* Overlay Info for empty locations */}
                    {activeVehicles.filter((v: any) => !v.location).length > 0 && (
                        <div className="absolute top-4 left-4 z-[1000] bg-background/90 backdrop-blur-md p-3 rounded-lg border border-border shadow-minimal">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Positioning Sync</p>
                            <div className="flex -space-x-2">
                                {activeVehicles.filter((v: any) => !v.location).map((v: any) => (
                                    <div key={v.shipmentVehicleId} title={v.vehicleNumber} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                        {v.vehicleNumber.slice(-2)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Panel — always visible on lg, toggleable on mobile */}
                <div className={`w-full lg:w-[350px] bg-card rounded-xl border border-border shadow-minimal flex flex-col overflow-hidden shrink-0 transition-all duration-300 
                    ${isPanelOpen ? 'max-h-[400px] lg:max-h-none' : 'max-h-0 lg:max-h-none overflow-hidden lg:overflow-visible'}`}>
                    <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-widest">
                            <span>🚛</span> {isLoading ? 'Syncing...' : 'Active Fleet'}
                        </h3>
                        {!isLoading && <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{activeVehicles.length} Units</span>}
                    </div>

                    {isLoading ? (
                        <div className="p-4">
                            <SkeletonList rows={6} />
                        </div>
                    ) : (
                        <FleetVehicleList
                            vehicles={activeVehicles}
                            selectedVehicleId={selectedVehicleId}
                            onSelectVehicle={handleSelectVehicle}
                        />
                    )}

                    <div className="p-4 border-t border-border bg-muted/10">
                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">Telemetry Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


