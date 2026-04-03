import type { Order } from '../types/order';
import type { OrderRepository } from '../api/order-repository';

export class PayOrderUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Order> {
        return this.repository.payOrder(id);
    }
}
