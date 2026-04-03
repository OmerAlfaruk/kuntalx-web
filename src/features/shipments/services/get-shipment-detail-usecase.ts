import type { Shipment } from '../types/shipment';
import type { ShipmentRepository } from '../api/shipment-repository';

export class GetShipmentDetailUseCase {
    private repository: ShipmentRepository;
    constructor(repository: ShipmentRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Shipment> {
        return this.repository.getShipmentById(id);
    }
}
