import React, { useState } from 'react';
import { GlassModal, KuntalLoader } from '../../../shared/components/UI';
import { useCreateShipment } from '../hooks/use-shipments';
import type { Order } from '../../orders/types/order';

interface ShipmentFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

interface Vehicle {
    vehicle_number: string;
    driver_name: string;
    driver_phone: string;
}

export const ShipmentFormDialog: React.FC<ShipmentFormDialogProps> = ({
    isOpen,
    onClose,
    order
}) => {
    const { mutate: createShipment, isPending } = useCreateShipment();
    const [transportProvider, setTransportProvider] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [expectedArrivalDate, setExpectedArrivalDate] = useState('');
    const [trackingNotes, setTrackingNotes] = useState('');
    const [vehicles, setVehicles] = useState<Vehicle[]>([{ vehicle_number: '', driver_name: '', driver_phone: '' }]);

    const handleAddVehicle = () => {
        setVehicles([...vehicles, { vehicle_number: '', driver_name: '', driver_phone: '' }]);
    };

    const handleRemoveVehicle = (index: number) => {
        if (vehicles.length > 1) {
            setVehicles(vehicles.filter((_, i) => i !== index));
        }
    };

    const handleVehicleChange = (index: number, field: keyof Vehicle, value: string) => {
        const newVehicles = [...vehicles];
        newVehicles[index][field] = value;
        setVehicles(newVehicles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const shipmentData = {
            orderId: order.id,
            aggregationId: order.aggregationId,
            transportProvider: transportProvider,
            departureDate: new Date(departureDate).toISOString(),
            expectedArrivalDate: new Date(expectedArrivalDate).toISOString(),
            trackingNotes: trackingNotes,
            // status is set by the backend when shipment is created
            vehicles: vehicles
                .filter(v => v.vehicle_number.trim() !== '')
                .map(v => ({
                    vehicleNumber: v.vehicle_number,
                    driverName: v.driver_name,
                    driverPhone: v.driver_phone
                }))
        };

        createShipment(shipmentData, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const footer = (
        <div className="flex gap-4">
            <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-border font-bold uppercase tracking-wider text-xs hover:bg-muted transition-all"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="shipment-form"
                disabled={isPending}
                className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase italic tracking-wider text-xs hover:bg-primary-soft transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
                {isPending ? <KuntalLoader variant="small" /> : 'Create Shipment 🚛'}
            </button>
        </div>
    );

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Generate Shipment"
            footer={footer}
            maxWidth="max-w-3xl"
        >
            <form id="shipment-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-xs font-black italic text-primary uppercase tracking-wider">Order Reference</p>
                    <p className="text-xl font-bold">#{order.id.substring(0, 8)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mr-2">Transport Provider</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Ethiopia Logistics Corp"
                            className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                            value={transportProvider}
                            onChange={(e) => setTransportProvider(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mr-2">Departure Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-foreground dark:scheme-dark"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground mr-2">Expected Arrival</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-foreground dark:scheme-dark"
                            value={expectedArrivalDate}
                            onChange={(e) => setExpectedArrivalDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Vehicle Roster</label>
                        <button
                            type="button"
                            onClick={handleAddVehicle}
                            className="text-xs font-black text-primary uppercase tracking-wider hover:underline"
                        >
                            + Add Vehicle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {vehicles.map((vehicle, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-muted/10 border border-border/30 relative">
                                {vehicles.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVehicle(index)}
                                        className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Plate Number</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="AA 12345"
                                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/10"
                                            value={vehicle.vehicle_number}
                                            onChange={(e) => handleVehicleChange(index, 'vehicle_number', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Driver Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/10"
                                            value={vehicle.driver_name}
                                            onChange={(e) => handleVehicleChange(index, 'driver_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Phone</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="09..."
                                            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/10"
                                            value={vehicle.driver_phone}
                                            onChange={(e) => handleVehicleChange(index, 'driver_phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Tracking Notes</label>
                    <textarea
                        rows={3}
                        className="w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        placeholder="Additional details for the buyer..."
                        value={trackingNotes}
                        onChange={(e) => setTrackingNotes(e.target.value)}
                    />
                </div>
            </form>
        </GlassModal>
    );
};

