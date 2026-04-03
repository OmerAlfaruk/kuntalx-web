import type { AuthRepository } from '../api/auth-repository';

export class CheckPhoneUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(phone: string): Promise<boolean> {
        return this.repository.checkPhone(phone);
    }
}
