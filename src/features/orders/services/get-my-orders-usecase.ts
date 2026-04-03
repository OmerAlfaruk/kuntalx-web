import type { Order } from '../types/order';
import type { OrderRepository } from '../api/order-repository';

export class GetMyOrdersUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(status?: string, fromDate?: string, toDate?: string, keyword?: string, skip?: number, limit?: number): Promise<Order[]> {
        return this.repository.getMyOrders(status, fromDate, toDate, keyword, skip, limit);
    }
}
