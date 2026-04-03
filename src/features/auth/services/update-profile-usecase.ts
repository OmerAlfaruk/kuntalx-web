import type { AuthRepository } from '../api/auth-repository';

export class UpdateProfileUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(data: { fullName?: string; email?: string; preferredLanguage?: string; farmerData?: any }) {
        return this.repository.updateMe(data as any);
    }
}
