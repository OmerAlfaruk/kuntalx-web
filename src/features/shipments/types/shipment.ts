export const ShipmentStatus = {
    PENDING: 'pending',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    DELAYED: 'delayed',
    CANCELLED: 'cancelled'
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export interface ShipmentVehicle {
    id: string;
    shipmentId: string;
    vehicleNumber: string;
    driverName?: string;
    driverPhone?: string;
    capacityKuntal?: number;
    loadedQuantityKuntal?: number;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
    currentPosition?: {
        latitude: number;
        longitude: number;
        speed?: number;
        deviceTimestamp: string;
    };
}

export interface Shipment {
    id: string;
    orderId: string;
    aggregationId?: string;
    transportProvider?: string;
    departureDate?: string;
    expectedArrivalDate?: string;
    actualArrivalDate?: string;
    status: ShipmentStatus;
    trackingNotes?: string;
    delayReason?: string;
    createdAt: string;
    updatedAt?: string;
    vehicles: ShipmentVehicle[];
}

export interface ShipmentTrackingTimeline {
    status: string;
    label: string;
    timestamp?: string;
    description?: string;
    isCompleted: boolean;
}

export interface ShipmentTrackingDetail extends Shipment {
    timeline: ShipmentTrackingTimeline[];
}
