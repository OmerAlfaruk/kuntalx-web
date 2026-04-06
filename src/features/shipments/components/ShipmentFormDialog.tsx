import React, { useState } from 'react';
import { KuntalLoader } from '../../../shared/components/UI';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="card-minimal w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                    <h2 className="text-[14px] font-bold text-foreground tracking-tight">Generate Shipment</h2>
                    <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Assign logistics details</p>
                </div>

                <form id="shipment-form" onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                        <div className="bg-background border border-border/50 p-6 rounded-2xl flex gap-6 items-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl text-primary shrink-0">
                                🚚
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Order Reference</p>
                                <p className="text-[18px] font-bold text-foreground tracking-tight">#{order.id.substring(0, 8)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Transport Provider</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ethiopia Logistics Corp"
                                    className="w-full h-12 bg-background-soft border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                    value={transportProvider}
                                    onChange={(e) => setTransportProvider(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Departure Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full h-12 bg-background-soft border border-border rounded-xl px-4 text-[13px] font-bold text-muted-foreground focus:border-primary/50 outline-none transition-all"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Expected Arrival</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full h-12 bg-background-soft border border-border rounded-xl px-4 text-[13px] font-bold text-muted-foreground focus:border-primary/50 outline-none transition-all"
                                    value={expectedArrivalDate}
                                    onChange={(e) => setExpectedArrivalDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Transport Units ({vehicles.length})</h3>
                                <button
                                    type="button"
                                    onClick={handleAddVehicle}
                                    className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                                >
                                    + Add Vehicle
                                </button>
                            </div>

                            <div className="space-y-4">
                                {vehicles.map((vehicle, index) => (
                                    <div key={index} className="p-6 rounded-2xl border border-border/50 bg-background-soft/50 space-y-6 relative group">
                                        <div className="flex items-center justify-between pb-2 border-b border-border/30">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Unit {index + 1}</span>
                                            {vehicles.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVehicle(index)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Plate Number</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="ETH-AA-12345"
                                                    className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
                                                    value={vehicle.vehicle_number}
                                                    onChange={(e) => handleVehicleChange(index, 'vehicle_number', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Driver Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Full Name"
                                                    className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
                                                    value={vehicle.driver_name}
                                                    onChange={(e) => handleVehicleChange(index, 'driver_name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Phone</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="09..."
                                                    className="w-full h-11 bg-background border border-border rounded-xl px-4 text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/20"
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
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Tracking Notes</label>
                            <textarea
                                rows={3}
                                className="w-full bg-background-soft border border-border rounded-xl px-4 py-3 text-[13px] font-bold focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                                placeholder="Additional details for the buyer..."
                                value={trackingNotes}
                                onChange={(e) => setTrackingNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="shipment-form"
                            disabled={isPending}
                            className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isPending ? <KuntalLoader variant="small" /> : 'Confirm Shipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
