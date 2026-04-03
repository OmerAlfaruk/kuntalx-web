import type {
    User,
    Association,
    AssociationCreationRequest,
    CropType,
    AuditLog,
    PlatformStats
} from '../types/admin';

export interface AdminRepository {
    // Stats
    getPlatformStats(): Promise<PlatformStats>;

    // Users
    getUsers(params?: { role?: string; skip?: number; limit?: number; keyword?: string }): Promise<User[]>;
    updateUserRole(userId: string, role: string): Promise<User>;
    deactivateUser(userId: string): Promise<User>;

    // Associations
    getAssociations(params?: { region?: string; woreda?: string; keyword?: string }): Promise<Association[]>;
    getAssociationDetail(id: string): Promise<Association>;
    createAssociation(data: Partial<Association>): Promise<Association>;
    updateAssociation(id: string, data: Partial<Association>): Promise<Association>;
    deleteAssociation(id: string): Promise<void>;

    // Association Requests
    getAssociationCreationRequests(params?: { keyword?: string }): Promise<AssociationCreationRequest[]>;
    approveAssociationRequest(requestId: string, adminData: { fullName: string; phone: string; email?: string }): Promise<void>;
    rejectAssociationRequest(requestId: string): Promise<void>;

    // Crop Types
    getCropTypes(params?: { keyword?: string }): Promise<CropType[]>;
    createCropType(data: Partial<CropType>): Promise<CropType>;
    updateCropType(id: string, data: Partial<CropType>): Promise<CropType>;
    deleteCropType(id: string): Promise<void>;

    // Audit Logs
    getAuditLogs(params?: { skip?: number; limit?: number; from_date?: string; to_date?: string; keyword?: string }): Promise<AuditLog[]>;
}
