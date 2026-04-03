export interface OtpResponse {
    message: string;
}

export interface VerificationResponse {
    registrationToken: string;
}

export interface BuyerRegistrationData {
    businessName: string;
    buyerType: 'wholesaler' | 'retailer' | 'processor';
    region?: string;
    woreda?: string;
    contactPhone?: string;
    licenseNumber?: string;
}

export interface FarmerUpdateData {
    defaultPayoutMethod?: string;
    payoutPaymentDetails?: string;
    region?: string;
    zone?: string;
    woreda?: string;
    kebele?: string;
    farmSizeHectares?: number;
    productionCapacityKuntal?: number;
    isMiniAssociation?: boolean;
}

export interface RegisterRequest {
    registrationToken: string;
    phone: string;
    fullName: string;
    email?: string;
    pin: string;
    preferredLanguage: string;
    role: 'buyer' | 'farmer';
    buyerData?: BuyerRegistrationData;
    farmerData?: FarmerUpdateData;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: UserFromBackend;
    profileId?: string;
    profileType?: 'farmer' | 'buyer' | 'association';
}

export interface UserFromBackend {
    id: string;
    phone: string;
    email?: string;
    fullName: string;
    role: string;
    preferredLanguage: string;
    associationId?: string;
    profilePictureUrl?: string;
    farmerData?: FarmerUpdateData;
}

export interface MeResponse {
    user: UserFromBackend;
    profileId?: string;
    profileType?: 'farmer' | 'buyer' | 'association';
}

export interface ForgotPinResponse {
    pinResetToken: string;
}
