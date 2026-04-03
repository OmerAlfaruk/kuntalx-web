import type { AuthRepository, AuthResponse, RegisterRequest } from '../api/auth-repository';

export class RegisterBuyerUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(data: RegisterRequest): Promise<AuthResponse> {
        return this.repository.register(data);
    }
}
