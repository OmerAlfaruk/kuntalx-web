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
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedVehicleId === vehicle.shipmentVehicleId
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-card border-border hover:border-primary/50'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-foreground">{vehicle.vehicleNumber}</p>
                        <Badge variant={vehicle.shipmentStatus === 'delayed' ? 'error' : 'outline'} className="text-xs">
                            {vehicle.shipmentStatus}
                        </Badge>
                    </div>
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-4 text-center">📤</span>
                            <span className="truncate">{vehicle.originAssociation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                            <span className="w-4 text-center text-primary">📦</span>
                            <span>{vehicle.cargoQuantity} QT {vehicle.cargoType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="w-4 text-center">📥</span>
                            <span className="truncate">{vehicle.destinationBuyer}</span>
                        </div>
                    </div>

                    {vehicle.location && (
                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground font-mono italic">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Sync
                            </div>
                            <span className="text-muted-foreground/60">{new Date(vehicle.location.deviceTimestamp).toLocaleTimeString()}</span>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
});
