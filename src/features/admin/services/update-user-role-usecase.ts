import type { User } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class UpdateUserRoleUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(userId: string, role: string): Promise<User> {
        return this.repository.updateUserRole(userId, role);
    }
}
