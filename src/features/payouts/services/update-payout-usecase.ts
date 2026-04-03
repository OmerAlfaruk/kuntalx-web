import type { PayoutRepository } from '../api/payout-repository';
import type { Payout } from '../types/payout';

export class UpdatePayoutUseCase {
    private repository: PayoutRepository;

    constructor(repository: PayoutRepository) {
        this.repository = repository;
    }

    async execute(id: string, status: string, transactionRef?: string): Promise<Payout> {
        return this.repository.updatePayout(id, status, transactionRef);
    }
}
