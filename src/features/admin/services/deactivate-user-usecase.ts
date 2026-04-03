import type { User } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class DeactivateUserUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(userId: string): Promise<User> {
        return this.repository.deactivateUser(userId);
    }
}
