import type { AuthRepository, AuthResponse } from '../api/auth-repository';

export class LoginUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(phone: string, pin: string): Promise<AuthResponse> {
        // Here we could add validation logic if needed
        return this.repository.login(phone, pin);
    }
}
