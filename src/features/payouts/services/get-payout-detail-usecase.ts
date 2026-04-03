import type { Payout } from '../types/payout';
import type { PayoutRepository } from '../api/payout-repository';

export class GetPayoutDetailUseCase {
    private repository: PayoutRepository;
    constructor(repository: PayoutRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Payout> {
        return this.repository.getPayoutDetail(id);
    }
}
