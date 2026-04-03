import type { ShipmentTrackingDetail } from '../types/shipment';
import type { ShipmentRepository } from '../api/shipment-repository';

export class GetShipmentTrackingUseCase {
    private repository: ShipmentRepository;
    constructor(repository: ShipmentRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<ShipmentTrackingDetail> {
        return this.repository.getShipmentTracking(id);
    }
}
