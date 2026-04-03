import type { Aggregation, AggregationItem, CropType } from '../types/aggregation';

export interface AggregationRepository {
  getOpenAggregations(params?: {
    skip?: number;
    limit?: number;
    cropTypeId?: string;
    minQuantity?: number;
    keyword?: string;
    region?: string;
  }): Promise<Aggregation[]>;

  getAggregationDetail(id: string): Promise<Aggregation>;

  createAggregation(aggregation: Omit<Aggregation, 'id' | 'createdAt' | 'updatedAt' | 'items'>): Promise<Aggregation>;
  
  deleteAggregation(id: string): Promise<void>;

  contributeToAggregation(aggregationId: string, item: Omit<AggregationItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'farmerName'>): Promise<AggregationItem>;

  updateAggregationStatus(id: string, status: Aggregation['status']): Promise<Aggregation>;

  verifyAggregationItem(
    aggregationId: string,
    itemId: string,
    verifiedQuantity: number,
    qualityGrade: NonNullable<AggregationItem['qualityGrade']>,
    notes?: string
  ): Promise<AggregationItem>;

  updateAggregationItemStatus(
    aggregationId: string,
    itemId: string,
    status: AggregationItem['status'],
    notes?: string
  ): Promise<AggregationItem>;

  getMyAggregations(params?: { skip?: number; limit?: number; keyword?: string }): Promise<Aggregation[]>;
  
  getAssociationAggregations(associationId: string, params?: { skip?: number; limit?: number; keyword?: string }): Promise<Aggregation[]>;

  getCropTypes(): Promise<CropType[]>;
}