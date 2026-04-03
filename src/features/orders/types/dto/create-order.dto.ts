export interface CreateOrderDto {
    aggregationId: string;
    requestedQuantityKuntal: number;
    pricePerKuntal: number;
    deliveryWindowStart?: string;
    deliveryWindowEnd?: string;
    qualityRequirements?: string;
}
