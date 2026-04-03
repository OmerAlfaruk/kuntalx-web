import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Shipment } from '../../shipments/types/shipment';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TrackingMapProps {
    shipment: Shipment;
}

export const TrackingMap = ({ shipment }: TrackingMapProps) => {
    const vehicles = shipment.vehicles || [];

    // Default center (Ethiopia coords if no vehicles)
    const defaultCenter: [number, number] = [9.1450, 40.4897];

    // Collect all coordinates for bounds and markers
    const allPositions: [number, number][] = [];
    const markers = vehicles.map(v => {
        if (v.currentPosition) {
            const pos: [number, number] = [v.currentPosition.latitude, v.currentPosition.longitude];
            allPositions.push(pos);
            return {
                id: v.id,
                position: pos,
                vehicleNumber: v.vehicleNumber,
                driverName: v.driverName
            };
        }
        return null;
    }).filter(m => m !== null);

    // If we have positions, calculate bounds or center
    const center = allPositions.length > 0 ? allPositions[0] : defaultCenter;

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border bg-muted/10 relative group [&_.leaflet-layer]:filter [&_.leaflet-layer]:grayscale-[50%] [&_.leaflet-layer]:contrast-[1.2] [&_.leaflet-layer]:brightness-[0.9]">
            <div className="absolute top-4 left-4 z-[1000] bg-background/80 backdrop-blur-md border border-border p-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Tactical Uplink Active</span>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                dragging={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map(marker => (
                    <Marker key={marker!.id} position={marker!.position}>
                        <Popup>
                            <div className="p-1">
                                <p className="font-bold text-sm mb-1">{marker!.vehicleNumber}</p>
                                <p className="text-xs text-muted-foreground">{marker!.driverName || 'Verified Driver'}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Draw polylines if we have location history (if added to entities later) */}
            </MapContainer>

            {/* Overlay Grid lines for "Tactical" look */}
            <div className="absolute inset-0 pointer-events-none border-2 border-primary/5 z-[400] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 border-[20px] border-primary/5 pointer-events-none"></div>
            </div>
        </div>
    );
};

