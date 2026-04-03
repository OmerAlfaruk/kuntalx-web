import type { Payout } from '../types/payout';

export interface PayoutRepository {
    getPayouts(userRole: string, keyword?: string, skip?: number, limit?: number): Promise<Payout[]>;
    getPayoutDetail(id: string): Promise<Payout>;
    distributePayout(orderId: string): Promise<void>;
    updatePayout(id: string, status: string, transactionRef?: string): Promise<Payout>;
}
