import type { Order } from '../types/order';
import type { OrderRepository } from '../api/order-repository';

export class CreateOrderUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(data: any): Promise<Order> {
        return this.repository.createOrder(data);
    }
}
