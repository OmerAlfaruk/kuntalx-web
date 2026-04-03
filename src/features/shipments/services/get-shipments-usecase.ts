import type { Shipment } from '../types/shipment';
import type { ShipmentRepository } from '../api/shipment-repository';

export class GetShipmentsUseCase {
    private repository: ShipmentRepository;
    constructor(repository: ShipmentRepository) {
        this.repository = repository;
    }

    async execute(status?: string, keyword?: string, skip?: number, limit?: number): Promise<Shipment[]> {
        return this.repository.getShipments(status, keyword, skip, limit);
    }
}
