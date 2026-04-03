import type { Shipment, ShipmentTrackingDetail } from "../types/shipment";


export interface ShipmentRepository {
    getShipments(status?: string, keyword?: string, skip?: number, limit?: number): Promise<Shipment[]>;
    getShipmentById(id: string): Promise<Shipment>;
    getShipmentTracking(id: string): Promise<ShipmentTrackingDetail>;
    getShipmentsByOrderId(orderId: string): Promise<Shipment[]>;
    createShipment(data: Partial<Shipment>): Promise<Shipment>;
    updateShipment(id: string, data: Partial<Shipment>): Promise<Shipment>;
}
