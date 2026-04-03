import type { AuthRepository, MeResponse } from '../api/auth-repository';

export class GetMeUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(): Promise<MeResponse> {
        return this.repository.getMe();
    }
}
