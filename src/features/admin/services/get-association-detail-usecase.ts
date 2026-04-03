import type { Association } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetAssociationDetailUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<Association> {
        return this.repository.getAssociationDetail(id);
    }
}
