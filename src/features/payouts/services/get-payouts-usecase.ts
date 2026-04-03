import type { Payout } from '../types/payout';
import type { PayoutRepository } from '../api/payout-repository';

export class GetPayoutsUseCase {
    private repository: PayoutRepository;
    constructor(repository: PayoutRepository) {
        this.repository = repository;
    }

    async execute(userRole: string, keyword?: string, skip?: number, limit?: number): Promise<Payout[]> {
        return this.repository.getPayouts(userRole, keyword, skip, limit);
    }
}
