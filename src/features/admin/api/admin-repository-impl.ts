import { apiClient } from '../../../lib/api-client';
import type { User, Association, AssociationCreationRequest, CropType, AuditLog, PlatformStats } from '../types/admin';
import type { AdminRepository } from './admin-repository';

export class AssociationApiDataSource {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static mapToAssociation(data: any): Association {
        return {
            id: data.id,
            name: data.name,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            description: data.description,
            contactPhone: data.contact_phone,
            cbeAccountNumber: data.cbe_account_number,
            adminUserId: data.admin_user_id,
            membershipCount: data.membership_count || 0,
            activeAggregationsCount: data.active_aggregations_count || 0,
            totalSales: data.total_sales,
            metrics: data.metrics ? {
                totalFarmers: data.metrics.total_farmers || 0,
                activeAggregations: data.metrics.active_aggregations || 0,
                totalVolumeKuntal: data.metrics.total_volume_kuntal || 0,
                totalValueEtb: data.metrics.total_value_etb || 0,
            } : undefined,
            createdAt: data.created_at,
        };
    }

    public static mapToCreationRequest(data: any): AssociationCreationRequest {
        return {
            id: data.id,
            farmerId: data.farmer_id,
            farmerName: data.farmer_name,
            farmerPhone: data.farmer_phone,
            name: data.name,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            contactPhone: data.contact_phone,
            description: data.description,
            status: data.status,
            adminNotes: data.admin_notes,
            rejectionReason: data.rejection_reason,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static mapToUser(data: any): User {
        return {
            id: data.id,
            email: data.email,
            phone: data.phone,
            fullName: data.full_name,
            role: data.role,
            isActive: data.is_active,
            status: data.status,
            associationId: data.association_id,
            profilePictureUrl: data.profile_picture_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static mapToCropType(data: any): CropType {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            unit: data.unit,
            isActive: data.is_active,
            createdAt: data.created_at,
        };
    }

    public static mapToAuditLog(data: any): AuditLog {
        return {
            id: data.id,
            timestamp: data.timestamp,
            action: data.action,
            entityType: data.entity_type,
            entityId: data.entity_id,
            userId: data.user_id,
            userName: data.user_name || 'System',
            details: data.changes,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static mapToPlatformStats(data: any): PlatformStats {
        return {
            totalFarmers: data.total_farmers,
            totalBuyers: data.total_buyers,
            activeAggregations: data.active_aggregations,
            totalAssociations: data.total_associations,
            totalOrders: data.total_orders,
            pendingOrders: data.pending_orders,
            totalSalesVolume: data.total_sales_volume,
            pendingPayouts: data.pending_payouts,
            aggregationsByStatus: data.aggregations_by_status,
        };
    }
}

export class AdminRepositoryImpl implements AdminRepository {
    async getPlatformStats(): Promise<PlatformStats> {
        const data = await apiClient.get<any>('/admin/stats');
        return AssociationApiDataSource.mapToPlatformStats(data);
    }

    async getUsers(params?: { role?: string; skip?: number; limit?: number; keyword?: string }): Promise<User[]> {
        const data = await apiClient.get<any[]>('/users/', params);
        return data.map(AssociationApiDataSource.mapToUser);
    }

    async updateUserRole(userId: string, role: string): Promise<User> {
        const responseData = await apiClient.put<any>(`/users/${userId}/role`, { role });
        return AssociationApiDataSource.mapToUser(responseData);
    }

    async deactivateUser(userId: string): Promise<User> {
        const responseData = await apiClient.delete<any>(`/users/${userId}`);
        return AssociationApiDataSource.mapToUser(responseData);
    }

    async getAssociations(params?: { region?: string; woreda?: string; keyword?: string }): Promise<Association[]> {
        const data = await apiClient.get<any[]>('/associations/', params);
        return data.map(AssociationApiDataSource.mapToAssociation);
    }

    async getAssociationDetail(id: string): Promise<Association> {
        const data = await apiClient.get<any>(`/associations/${id}`);
        return AssociationApiDataSource.mapToAssociation(data);
    }

    async createAssociation(data: Partial<Association>): Promise<Association> {
        const payload = {
            name: data.name,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            description: data.description,
            contact_phone: data.contactPhone?.replace(/[\s()-]/g, ''),
            admin_user_id: data.adminUserId,
        };
        const responseData = await apiClient.post<any>('/associations/', payload);
        return AssociationApiDataSource.mapToAssociation(responseData);
    }

    async updateAssociation(id: string, data: Partial<Association>): Promise<Association> {
        const payload = {
            name: data.name,
            region: data.region,
            zone: data.zone,
            woreda: data.woreda,
            description: data.description,
            contact_phone: data.contactPhone?.replace(/[\s()-]/g, ''),
            cbe_account_number: data.cbeAccountNumber,
        };
        const responseData = await apiClient.put<any>(`/associations/${id}`, payload);
        return AssociationApiDataSource.mapToAssociation(responseData);
    }

    async deleteAssociation(id: string): Promise<void> {
        return apiClient.delete(`/associations/${id}`);
    }

    async getAssociationCreationRequests(params?: { keyword?: string }): Promise<AssociationCreationRequest[]> {
        const data = await apiClient.get<any[]>('/association-creation-requests', params);
        return data.map(AssociationApiDataSource.mapToCreationRequest);
    }

    async approveAssociationRequest(requestId: string, adminData: { fullName: string; phone: string; email?: string }): Promise<void> {
        const payload = {
            full_name: adminData.fullName,
            phone: adminData.phone,
            email: adminData.email
        };
        return apiClient.put(`/association-creation-requests/${requestId}/approve`, payload);
    }

    async rejectAssociationRequest(requestId: string): Promise<void> {
        return apiClient.put(`/association-creation-requests/${requestId}/reject`);
    }

    async getCropTypes(params?: { keyword?: string }): Promise<CropType[]> {
        const data = await apiClient.get<any[]>('/crop-types/', params);
        return data.map(AssociationApiDataSource.mapToCropType);
    }

    async createCropType(data: Partial<CropType>): Promise<CropType> {
        const payload = {
            name: data.name,
            description: data.description,
            unit: data.unit,
        };
        const responseData = await apiClient.post<any>('/crop-types/', payload);
        return AssociationApiDataSource.mapToCropType(responseData);
    }

    async updateCropType(id: string, data: Partial<CropType>): Promise<CropType> {
        const payload = {
            name: data.name,
            description: data.description,
            unit: data.unit,
            is_active: data.isActive,
        };
        const responseData = await apiClient.put<any>(`/crop-types/${id}`, payload);
        return AssociationApiDataSource.mapToCropType(responseData);
    }

    async deleteCropType(id: string): Promise<void> {
        return apiClient.delete(`/crop-types/${id}`);
    }

    async getAuditLogs(params?: { skip?: number; limit?: number; from_date?: string; to_date?: string; keyword?: string }): Promise<AuditLog[]> {
        const response = await apiClient.get<any[]>('/admin/logs', {
            skip: params?.skip,
            limit: params?.limit,
            from_date: params?.from_date,
            to_date: params?.to_date,
            keyword: params?.keyword
        });
        return response.map(AssociationApiDataSource.mapToAuditLog);
    }
}
