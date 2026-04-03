import { apiClient } from '../../../lib/api-client';
import type { Payout } from '../types/payout';
import type { PayoutRepository } from './payout-repository';

export class PayoutRepositoryImpl implements PayoutRepository {
    async getPayouts(userRole: string, keyword?: string, skip?: number, limit?: number): Promise<Payout[]> {
        const params = {
            keyword: keyword || undefined,
            skip: skip || undefined,
            limit: limit || undefined
        };

        let endpoint = '/payouts/my-payouts';
        if (userRole === 'association_admin') {
            endpoint = '/payouts/association';
        } else if (userRole === 'platform_admin') {
            endpoint = '/payouts/';
        }

        const data = await apiClient.get<any[]>(endpoint, params);
        return data.map(this.mapToEntity);
    }

    async getPayoutDetail(id: string): Promise<Payout> {
        const response = await apiClient.get<any>(`/payouts/${id}`);
        return this.mapToEntity(response);
    }

    async distributePayout(orderId: string): Promise<void> {
        await apiClient.post(`/payouts/orders/${orderId}/distribute`);
    }

    async updatePayout(id: string, status: string, transactionRef?: string): Promise<Payout> {
        const response = await apiClient.patch<any>(`/payouts/${id}`, { 
            status, 
            transaction_reference: transactionRef 
        });
        return this.mapToEntity(response);
    }

    private mapToEntity(data: any): Payout {
        return {
            id: data.id,
            farmerName: data.farmer_name || `Farmer ${data.farmer_id?.substring(0, 6) || ''}`,
            orderId: data.order_id || data.transaction_reference || 'N/A',
            aggTitle: data.aggregation_title || 'Aggregated Return',
            amount: data.amount,
            currency: data.currency || 'ETB',
            status: data.status || 'pending',
            date: data.paid_at || data.created_at
                ? new Date(data.paid_at || data.created_at).toLocaleDateString()
                : new Date().toLocaleDateString(),
            source: {
                orderId: data.order_id || 'N/A',
                aggregationTitle: data.aggregation_title || 'Aggregation Pool',
                contributionQuantity: data.contributed_quantity_kuntal || 0,
                qualityGrade: data.quality_grade || 'A',
            },
            breakdown: {
                baseAmount: data.base_amount || data.amount,
                qualityBonus: data.quality_bonus || 0,
                deductions: data.deductions || 0,
                pricePerKuntal: data.price_per_kuntal || 0,
            },
            auditLogs: data.audit_logs?.map((log: any) => ({
                id: log.id,
                action: log.action,
                timestamp: new Date(log.timestamp).toLocaleString(),
                userName: log.user_name,
                changes: log.changes,
            }))
        };
    }
}
