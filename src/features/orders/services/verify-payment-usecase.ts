import type { OrderRepository } from '../api/order-repository';

export class VerifyPaymentUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    async execute(reference: string): Promise<any> {
        return this.repository.verifyPayment(reference);
    }
}

export class SimulateConfirmPaymentUseCase {
    private repository: OrderRepository;
    constructor(repository: OrderRepository) {
        this.repository = repository;
    }

    /** Calls /payments/simulate-confirm/{reference} — only works when PAYMENT_SIMULATION_MODE=True */
    async execute(reference: string): Promise<any> {
        return this.repository.simulateConfirmPayment(reference);
    }
}
