import type { Order } from '../types/order';
import type { OrderRepository } from '../api/order-repository';

export class CancelOrderUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Order> {
        return this.repository.cancelOrder(id);
    }
}
