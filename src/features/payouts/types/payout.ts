export interface Payout {
    id: string;
    farmerName: string;
    orderId: string;
    aggTitle: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'paid' | 'failed';
    date: string;
    createdAt?: string;
    paymentMethod?: 'bank_transfer' | 'telebirr';
    source: {
        orderId: string;
        aggregationTitle: string;
        contributionQuantity: number;
        qualityGrade: string;
    };
    breakdown: {
        baseAmount: number;
        qualityBonus: number;
        deductions: number;
        pricePerKuntal: number;
    };
    auditLogs?: AuditLog[];
}

export interface AuditLog {
    id: string;
    action: string;
    timestamp: string;
    userName?: string;
    changes?: Record<string, any>;
}
