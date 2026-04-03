import type { OrderRepository } from '../api/order-repository';

export class InitiatePaymentUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(orderId: string, method: string, transactionRef?: string): Promise<any> {
        return this.repository.initiatePayment(orderId, method, transactionRef);
    }
}
