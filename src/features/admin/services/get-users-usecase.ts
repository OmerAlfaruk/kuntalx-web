import type { User } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetUsersUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(params?: { role?: string; skip?: number; limit?: number; keyword?: string }): Promise<User[]> {
        return this.repository.getUsers(params);
    }
}
