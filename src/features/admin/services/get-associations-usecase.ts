import type { Association } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetAssociationsUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(keyword?: string): Promise<Association[]> {
        return this.repository.getAssociations({ keyword });
    }
}
