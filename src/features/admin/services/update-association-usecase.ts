import type { Association } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class UpdateAssociationUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(id: string, data: Partial<Association>): Promise<Association> {
        return this.repository.updateAssociation(id, data);
    }
}
