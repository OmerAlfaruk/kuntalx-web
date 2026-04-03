import type { AssociationCreationRequest } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetAssociationCreationRequestsUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(): Promise<AssociationCreationRequest[]> {
        return this.repository.getAssociationCreationRequests();
    }
}
