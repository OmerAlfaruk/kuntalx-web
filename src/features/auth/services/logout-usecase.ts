import type { AuthRepository } from '../api/auth-repository';

export class LogoutUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(): Promise<void> {
        return this.repository.logout();
    }
}
