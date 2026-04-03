import type { Aggregation } from '../../aggregations/types/aggregation';

export type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'in_progress'
    | 'in_transit'
    | 'delivered'
    | 'fulfilled'
    | 'cancelled'
    | 'disputed';

export interface Order {
    id: string;
    buyerId: string;
    aggregationId: string;
    requestedQuantityKuntal: number;
    pricePerKuntal: number;
    totalPrice: number;
    deliveryWindowStart?: string;
    deliveryWindowEnd?: string;
    qualityRequirements?: string;
    createdAt: string;
    deletedAt?: string;
    aggregation?: Aggregation;
    status: OrderStatus;
    paymentStatus?: string;
    buyerName?: string;
    buyerPhone?: string;
    buyerEmail?: string;
    referenceCode?: string;
    woreda?: string;
    contactPhone?: string;
}
