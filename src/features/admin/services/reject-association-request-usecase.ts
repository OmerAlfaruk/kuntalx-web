import type { AdminRepository } from '../api/admin-repository';

export class RejectAssociationRequestUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(requestId: string): Promise<void> {
        return this.repository.rejectAssociationRequest(requestId);
    }
}
