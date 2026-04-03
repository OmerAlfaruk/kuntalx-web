import type { Order } from '../types/order';
import type { OrderRepository } from '../api/order-repository';

export class UpdateOrderStatusUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(id: string, status: string): Promise<Order> {
        return this.repository.updateStatus(id, status);
    }
}
