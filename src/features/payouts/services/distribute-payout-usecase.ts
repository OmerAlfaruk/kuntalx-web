import type { PayoutRepository } from '../api/payout-repository';

export class DistributePayoutUseCase {
    private repository: PayoutRepository;
    constructor(repository: PayoutRepository) {
        this.repository = repository;
    }

    async execute(orderId: string): Promise<void> {
        return this.repository.distributePayout(orderId);
    }
}
