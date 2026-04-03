import type { PlatformStats } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetPlatformStatsUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(): Promise<PlatformStats> {
        return this.repository.getPlatformStats();
    }
}
