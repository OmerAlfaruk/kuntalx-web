import type { AuthRepository } from '../api/auth-repository';

export class ChangePinUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(oldPin: string, newPin: string) {
        return this.repository.changePin(oldPin, newPin);
    }
}
