export const AggregationStatus = {
  DRAFT: 'draft',
  COLLECTING: 'collecting',
  READY_FOR_SALE: 'ready_for_sale',
  RESERVED: 'reserved',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
} as const;

export type AggregationStatus = (typeof AggregationStatus)[keyof typeof AggregationStatus];

export interface AggregationItem {
  id: string;
  aggregationId: string;
  farmerId: string;
  farmerName?: string;
  farmerPhone?: string;
  quantityKuntal: number;
  verifiedQuantityKuntal?: number;
  qualityGrade?: 'A' | 'B' | 'C';
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Aggregation {
  id: string;
  cropTypeId: string;
  cropTypeName?: string;
  targetQuantityKuntal: number;
  totalQuantityKuntal: number;
  availableQuantity?: number;
  expectedDeliveryDate: string;
  aggregationType: 'individual' | 'mini_association' | 'full_association';
  title?: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  associationId?: string;
  associationName?: string;
  status: 'draft' | 'collecting' | 'ready_for_sale' | 'fulfilled' | 'reserved' | 'cancelled';
  pricePerKuntal?: number;
  qualityGrade?: 'A' | 'B' | 'C';
  region?: string;
  contactPhone?: string;
  associationCbeAccount?: string;
  daysRemaining?: number;
  items?: AggregationItem[];
  createdAt: string;
  updatedAt?: string;
  // Seller identity
  sellerName?: string;
  sellerPhone?: string;
}

export interface CropType {
  id: string;
  name: string;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'buyer' | 'association_admin' | 'platform_admin' | 'farmer';
  profileId?: string;
  profileType?: 'farmer' | 'buyer' | 'association';
  preferredLanguage: string;
  associationId?: string;
  farmerData?: {
    defaultPayoutMethod?: string;
    payoutPaymentDetails?: string;
  };
}