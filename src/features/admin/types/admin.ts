export interface User {
    id: string;
    phone: string;
    email?: string;
    fullName: string;
    role: 'buyer' | 'association_admin' | 'platform_admin' | 'farmer';
    isActive: boolean;
    status: string;
    associationId?: string;
    profileId?: string;
    profileType?: 'farmer' | 'buyer' | 'association';
    preferredLanguage?: string;
    profilePictureUrl?: string;
    farmerData?: {
        defaultPayoutMethod?: string;
        payoutPaymentDetails?: string;
        cbeAccountNumber?: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface Association {
    id: string;
    name: string;
    region: string;
    zone?: string;
    woreda: string;
    description?: string;
    contactPhone?: string;
    cbeAccountNumber?: string;
    adminUserId: string;
    membershipCount: number;
    activeAggregationsCount?: number;
    totalSales?: number;
    metrics?: {
        totalFarmers: number;
        activeAggregations: number;
        totalVolumeKuntal: number;
        totalValueEtb: number;
    };
    createdAt: string;
}

export interface AssociationCreationRequest {
    id: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    name: string;
    region: string;
    zone: string;
    woreda: string;
    contactPhone: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CropType {
    id: string;
    name: string;
    description?: string;
    unit: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    userName?: string;
    details?: any; // maps to 'changes' in backend
}

export interface PlatformStats {
    totalFarmers: number;
    totalBuyers: number;
    activeAggregations: number;
    totalAssociations: number;
    totalOrders: number;
    pendingOrders: number;
    totalSalesVolume: number;
    pendingPayouts: number;
    aggregationsByStatus: Record<string, number>;
}
