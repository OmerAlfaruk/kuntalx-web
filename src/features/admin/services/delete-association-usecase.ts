import type { AdminRepository } from '../api/admin-repository';

export class DeleteAssociationUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<void> {
        return this.repository.deleteAssociation(id);
    }
}
