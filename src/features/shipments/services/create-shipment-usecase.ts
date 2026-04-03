import type { Shipment } from '../types/shipment';
import type { ShipmentRepository } from '../api/shipment-repository';

export class CreateShipmentUseCase {
    private repository: ShipmentRepository;
    constructor(repository: ShipmentRepository) {
        this.repository = repository;
    }

    async execute(data: any): Promise<Shipment> {
        return this.repository.createShipment(data);
    }
}
