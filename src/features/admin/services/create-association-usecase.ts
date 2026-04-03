import type { Association } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class CreateAssociationUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(data: Partial<Association>): Promise<Association> {
        return this.repository.createAssociation(data);
    }
}
