import React, { memo } from 'react';
import { Badge } from '../../../shared/components/UI';

interface FleetVehicle {
    shipmentVehicleId: string;
    vehicleNumber: string;
    shipmentStatus: string;
    originAssociation: string;
    cargoQuantity: number;
    cargoType: string;
    destinationBuyer: string;
    location?: {
        deviceTimestamp: string;
    };
}

interface FleetVehicleListProps {
    vehicles: FleetVehicle[];
    selectedVehicleId: string | null;
    onSelectVehicle: (id: string) => void;
}

export const FleetVehicleList: React.FC<FleetVehicleListProps> = memo(({
    vehicles,
    selectedVehicleId,
    onSelectVehicle
}) => {
    if (vehicles.length === 0) {
        return (
            <div className="text-center py-12 px-6">
                <div className="text-4xl mb-4 text-muted-foreground/20">📍</div>
                <p className="text-sm font-medium text-muted-foreground">No active shipments in transit at the moment.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:space-y-4">
            {vehicles.map((vehicle) => (
                <button
                    key={vehicle.shipmentVehicleId}
                    onClick={() => onSelectVehicle(vehicle.shipmentVehicleId)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedVehicleId === vehicle.shipmentVehicleId
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 -translate-y-1'
                        : 'bg-card/40 border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:translate-x-1'
                        }`}
                >
                    {selectedVehicleId === vehicle.shipmentVehicleId && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    )}
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[11px] font-display font-bold text-foreground uppercase tracking-widest leading-none">{vehicle.vehicleNumber}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">L-Track Signal Active</p>
                        </div>
                        <Badge variant={vehicle.shipmentStatus === 'delayed' ? 'error' : 'success'} className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-widest border-0">
                            {vehicle.shipmentStatus}
                        </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 mt-4">
                        <div className="flex items-center gap-3 text-[10px] text-foreground font-medium bg-muted/20 p-2 rounded-lg border border-border/10">
                            <span className="text-sm opacity-60">📤</span>
                            <span className="truncate flex-1">{vehicle.originAssociation}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-primary font-bold bg-primary/5 p-2 rounded-lg border border-primary/10">
                            <span className="text-sm">⌬</span>
                            <span className="flex-1 font-display tracking-tight whitespace-nowrap">{vehicle.cargoQuantity} QT {vehicle.cargoType}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-foreground font-medium bg-muted/20 p-2 rounded-lg border border-border/10">
                            <span className="text-sm opacity-60">📥</span>
                            <span className="truncate flex-1">{vehicle.destinationBuyer}</span>
                        </div>
                    </div>

                    {vehicle.location && (
                        <div className="mt-5 pt-3 border-t border-border/20 flex justify-between items-center text-[9px]">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Live Telemetry
                            </div>
                            <span className="text-muted-foreground/60 font-mono tracking-tighter">{new Date(vehicle.location.deviceTimestamp).toLocaleTimeString()}</span>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
});
