import type {
    OtpResponse,
    VerificationResponse,
    RegisterRequest,
    AuthResponse,
    MeResponse,
    ForgotPinResponse,
    UserFromBackend
} from '../types';

export type {
    OtpResponse,
    VerificationResponse,
    RegisterRequest,
    AuthResponse,
    MeResponse,
    ForgotPinResponse,
    UserFromBackend
};

export interface AuthRepository {
    checkPhone(phone: string): Promise<boolean>;
    login(phone: string, pin: string): Promise<AuthResponse>;
    logout(): Promise<void>;
    requestOtp(phone: string): Promise<OtpResponse>;
    verifyOtp(phone: string, code: string): Promise<VerificationResponse>;
    register(data: RegisterRequest): Promise<AuthResponse>;
    getMe(): Promise<MeResponse>;
    forgotPin(phone: string): Promise<OtpResponse>;
    verifyForgotPinOtp(phone: string, code: string): Promise<ForgotPinResponse>;
    resetPin(token: string, newPin: string): Promise<OtpResponse>;
    updateMe(data: Partial<UserFromBackend>): Promise<UserFromBackend>;
    changePin(oldPin: string, newPin: string): Promise<OtpResponse>;
}
