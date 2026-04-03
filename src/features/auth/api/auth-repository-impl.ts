import { apiClient } from '../../../lib/api-client';
import type { BuyerRegistrationData, FarmerUpdateData } from '../types';
import type {
    AuthRepository,
    AuthResponse,
    OtpResponse,
    VerificationResponse,
    RegisterRequest,
    MeResponse,
    ForgotPinResponse,
    UserFromBackend,

} from './auth-repository';

export class AuthRepositoryImpl implements AuthRepository {
    async checkPhone(phone: string): Promise<boolean> {
        try {
            const response = await apiClient.post<any>('/auth/check-phone', { phone });
            return response.exists as boolean;
        } catch (error: any) {
            // Handle 404 naturally since 'user not found' might just be standard missing
            if (error.response?.status === 404 || error.response?.status === 400) {
                return false;
            }
            throw error;
        }
    }

    async login(phone: string, pin: string): Promise<AuthResponse> {
        const response = await apiClient.post<any>('/auth/login', { phone, pin });
        return this.mapToAuthResponse(response);
    }

    async logout(): Promise<void> {
        return apiClient.post('/auth/logout');
    }

    async requestOtp(phone: string): Promise<OtpResponse> {
        return apiClient.post<OtpResponse>('/auth/request-otp', { phone });
    }

    async verifyOtp(phone: string, code: string): Promise<VerificationResponse> {
        const response = await apiClient.post<any>('/auth/verify-otp', { phone, code });
        return {
            registrationToken: response.registration_token
        };
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const payload = {
            registration_token: data.registrationToken,
            phone: data.phone,
            full_name: data.fullName,
            email: data.email,
            pin: data.pin,
            preferred_language: data.preferredLanguage,
            role: data.role,
            buyer_data: data.buyerData ? this.mapBuyerDataToBackend(data.buyerData) : undefined,
            farmer_data: data.farmerData ? this.mapFarmerDataToBackend(data.farmerData) : undefined
        };
        const response = await apiClient.post<any>('/auth/register', payload);
        return this.mapToAuthResponse(response);
    }

    async getMe(): Promise<MeResponse> {
        const response = await apiClient.get<any>('/auth/me');
        return this.mapToMeResponse(response);
    }

    async forgotPin(phone: string): Promise<OtpResponse> {
        return apiClient.post<OtpResponse>('/auth/forgot-pin', { phone });
    }

    async verifyForgotPinOtp(phone: string, code: string): Promise<ForgotPinResponse> {
        const response = await apiClient.post<any>('/auth/verify-forgot-pin-otp', { phone, code });
        return {
            pinResetToken: response.pin_reset_token
        };
    }

    async resetPin(token: string, newPin: string): Promise<OtpResponse> {
        return apiClient.post<OtpResponse>('/auth/reset-pin', { token, new_pin: newPin });
    }

    async updateMe(data: Partial<UserFromBackend>): Promise<UserFromBackend> {
        const payload: any = {
            full_name: data.fullName,
            email: data.email,
            preferred_language: data.preferredLanguage,
        };
        if (data.farmerData) {
            payload.farmer_data = this.mapFarmerDataToBackend(data.farmerData);
        }
        const response = await apiClient.put<any>('/users/me', payload);
        return this.mapUserFromBackend(response);
    }

    async changePin(oldPin: string, newPin: string): Promise<OtpResponse> {
        return apiClient.post<OtpResponse>('/auth/change-pin', { old_pin: oldPin, new_pin: newPin });
    }

    private mapToAuthResponse(data: any): AuthResponse {
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenType: data.token_type,
            user: this.mapUserFromBackend(data.user),
            profileId: data.profile_id,
            profileType: data.profile_type
        };
    }

    private mapToMeResponse(data: any): MeResponse {
        return {
            user: this.mapUserFromBackend(data.user),
            profileId: data.profile_id,
            profileType: data.profile_type
        };
    }

    private mapUserFromBackend(data: any): UserFromBackend {
        return {
            id: data.id,
            phone: data.phone,
            email: data.email,
            fullName: data.full_name,
            role: data.role,
            preferredLanguage: data.preferred_language,
            associationId: data.association_id,
            profilePictureUrl: data.profile_picture_url,
            farmerData: (data.farmer_data || data.farmer_profile) 
                ? this.mapFarmerDataFromBackend(data.farmer_data || data.farmer_profile) 
                : undefined
        };
    }

    private mapFarmerDataFromBackend(data: any): FarmerUpdateData {
        return {
            defaultPayoutMethod: data.default_payout_method,
            payoutPaymentDetails: data.payout_payment_details,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            kebele: data.kebele,
            farmSizeHectares: data.farm_size_hectares,
            productionCapacityKuntal: data.production_capacity_kuntal,
            isMiniAssociation: data.is_mini_association
        };
    }

    private mapFarmerDataToBackend(data: FarmerUpdateData): any {
        return {
            default_payout_method: data.defaultPayoutMethod,
            payout_payment_details: data.payoutPaymentDetails,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            kebele: data.kebele,
            farm_size_hectares: data.farmSizeHectares,
            production_capacity_kuntal: data.productionCapacityKuntal,
            is_mini_association: data.isMiniAssociation
        };
    }

    private mapBuyerDataToBackend(data: BuyerRegistrationData): any {
        return {
            business_name: data.businessName,
            buyer_type: data.buyerType,
            region: data.region,
            woreda: data.woreda,
            contact_phone: data.contactPhone,
            license_number: data.licenseNumber
        };
    }
}
