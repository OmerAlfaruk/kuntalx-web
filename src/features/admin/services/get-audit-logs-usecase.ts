import type { AuditLog } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetAuditLogsUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(params?: { skip?: number; limit?: number; from_date?: string; to_date?: string; keyword?: string }): Promise<AuditLog[]> {
        return this.repository.getAuditLogs(params);
    }
}
