import type { AuthRepository, OtpResponse } from '../api/auth-repository';

export class RequestOtpUseCase {
    private repository: AuthRepository;

    constructor(repository: AuthRepository) {
        this.repository = repository;
    }

    async execute(phone: string): Promise<OtpResponse> {
        return this.repository.requestOtp(phone);
    }
}
