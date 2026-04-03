import type { AdminRepository } from '../api/admin-repository';

export class ApproveAssociationRequestUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(requestId: string, adminData: { fullName: string; phone: string; email?: string }): Promise<void> {
        return this.repository.approveAssociationRequest(requestId, adminData);
    }
}
