import type { AuthRepository, VerificationResponse } from '../api/auth-repository';

export class VerifyOtpUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(phone: string, code: string): Promise<VerificationResponse> {
        return this.repository.verifyOtp(phone, code);
    }
}
