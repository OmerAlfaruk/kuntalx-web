import { apiClient } from '../../../lib/api-client';
import type { Shipment, ShipmentTrackingDetail } from '../types/shipment';
import type { ShipmentRepository } from './shipment-repository';

export class ShipmentRepositoryImpl implements ShipmentRepository {
    async getShipments(status?: string, keyword?: string, skip?: number, limit?: number): Promise<Shipment[]> {
        const response = await apiClient.get<any[]>('/shipments/', {
            status: status === 'all' ? undefined : status,
            keyword: keyword || undefined,
            skip: skip || undefined,
            limit: limit || undefined
        });
        return response.map(this.mapToEntity);
    }

    async getShipmentById(id: string): Promise<Shipment> {
        const data = await apiClient.get<any>(`/shipments/${id}`);
        return this.mapToEntity(data);
    }

    async getShipmentTracking(id: string): Promise<ShipmentTrackingDetail> {
        const data = await apiClient.get<any>(`/shipments/${id}/tracking`);
        const shipment = this.mapToEntity(data);
        return {
            ...shipment,
            timeline: (data.timeline || []).map((t: any) => ({
                status: t.status,
                label: t.label,
                timestamp: t.timestamp,
                description: t.description,
                isCompleted: t.is_completed
            }))
        };
    }

    async getShipmentsByOrderId(orderId: string): Promise<Shipment[]> {
        const data = await apiClient.get<any[]>(`/shipments/order/${orderId}`);
        return data.map(this.mapToEntity);
    }

    async createShipment(data: any): Promise<Shipment> {
        const mappedData = {
            order_id: data.orderId,
            aggregation_id: data.aggregationId,
            transport_provider: data.transportProvider,
            departure_date: data.departureDate,
            expected_arrival_date: data.expectedArrivalDate,
            tracking_notes: data.trackingNotes,
            status: data.status,
            vehicles: (data.vehicles || []).map((v: any) => ({
                vehicle_number: v.vehicleNumber,
                driver_name: v.driverName,
                driver_phone: v.driverPhone,
            }))
        };
        const response = await apiClient.post<any>('/shipments', mappedData);
        return this.mapToEntity(response);
    }

    async updateShipment(id: string, data: Partial<any>): Promise<Shipment> {
        const response = await apiClient.put<any>(`/shipments/${id}`, data);
        return this.mapToEntity(response);
    }

    private mapToEntity(data: any): Shipment {
        return {
            id: data.id,
            orderId: data.order_id,
            aggregationId: data.aggregation_id,
            transportProvider: data.transport_provider,
            departureDate: data.departure_date,
            expectedArrivalDate: data.expected_arrival_date,
            actualArrivalDate: data.actual_arrival_date,
            status: data.status,
            trackingNotes: data.tracking_notes,
            delayReason: data.delay_reason,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            vehicles: (data.vehicles || []).map((v: any) => ({
                id: v.id,
                shipmentId: v.shipment_id,
                vehicleNumber: v.vehicle_number,
                driverName: v.driver_name,
                driverPhone: v.driver_phone,
                capacityKuntal: v.capacity_kuntal,
                loadedQuantityKuntal: v.loaded_quantity_kuntal,
                notes: v.notes,
                createdAt: v.created_at,
                updatedAt: v.updated_at,
                currentPosition: v.current_position ? {
                    latitude: v.current_position.latitude,
                    longitude: v.current_position.longitude,
                    speed: v.current_position.speed,
                    deviceTimestamp: v.current_position.device_timestamp,
                } : undefined
            }))
        };
    }
}

export const shipmentRepository = new ShipmentRepositoryImpl();
