import { apiClient } from '../../../lib/api-client';
import type { Aggregation, AggregationItem, CropType } from '../types/aggregation';
import type { AggregationRepository } from './aggregation-repository';

export class AggregationApiDataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static mapToItem(data: any): AggregationItem {
    return {
      id: data.id,
      aggregationId: data.aggregation_id,
      farmerId: data.farmer_id,
      farmerName: data.farmer_name,
      farmerPhone: data.farmer_phone,
      quantityKuntal: data.quantity_kuntal,
      verifiedQuantityKuntal: data.verified_quantity_kuntal,
      qualityGrade: data.quality_grade,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static mapToAggregation(data: any): Aggregation {
    return {
      id: data.id,
      cropTypeId: data.crop_type_id,
      cropTypeName: data.crop_name,
      targetQuantityKuntal: data.target_quantity_kuntal,
      totalQuantityKuntal: data.total_quantity_kuntal,
      availableQuantity: data.available_quantity,
      expectedDeliveryDate: data.expected_delivery_date,
      aggregationType: data.aggregation_type,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      ownerId: data.owner_id,
      associationId: data.association_id,
      associationName: data.association_name,
      status: data.status,
      pricePerKuntal: data.price_per_kuntal,
      qualityGrade: data.quality_grade,
      region: data.region,
      associationCbeAccount: data.association_cbe_account,
      sellerName: data.seller_name,
      sellerPhone: data.seller_phone,
      items: (data.items as any[])?.map(AggregationApiDataSource.mapToItem),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getOpenAggregations(params?: {
    skip?: number;
    limit?: number;
    cropTypeId?: string;
    minQuantity?: number;
    keyword?: string;
    region?: string;
  }): Promise<Aggregation[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiClient.get<any[]>('/aggregations/open', { params });
    return data.map(AggregationApiDataSource.mapToAggregation);
  }

  async getAggregationDetail(id: string): Promise<Aggregation> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiClient.get<any>(`/aggregations/${id}`);
    return AggregationApiDataSource.mapToAggregation(data);
  }

  async createAggregation(aggregation: Omit<Aggregation, 'id' | 'createdAt' | 'updatedAt' | 'items'>): Promise<Aggregation> {
    const payload = {
      title: aggregation.title,
      description: aggregation.description,
      crop_type_id: aggregation.cropTypeId,
      target_quantity_kuntal: aggregation.targetQuantityKuntal,
      expected_delivery_date: aggregation.expectedDeliveryDate,
      aggregation_type: aggregation.aggregationType,
      price_per_kuntal: aggregation.pricePerKuntal,
      image_url: aggregation.imageUrl,
      quality_grade: aggregation.qualityGrade,
      association_id: aggregation.associationId,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiClient.post<any>('/aggregations/', payload);
    return AggregationApiDataSource.mapToAggregation(data);
  }

  async deleteAggregation(id: string): Promise<void> {
    await apiClient.delete(`/aggregations/${id}`);
  }

  async contributeToAggregation(aggregationId: string, item: Omit<AggregationItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'farmerName'>): Promise<AggregationItem> {
    // Backend expects farmer_id and quantity_kuntal
    const payload = {
      farmer_id: item.farmerId,
      quantity_kuntal: item.quantityKuntal,
      notes: item.notes,
      quality_grade: item.qualityGrade
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiClient.post<any>(`/aggregations/${aggregationId}/items`, payload);
    return AggregationApiDataSource.mapToItem(data);
  }

  async updateAggregationStatus(id: string, status: Aggregation['status']): Promise<Aggregation> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await apiClient.patch<any>(`/aggregations/${id}/status`, null, {
      params: { status }
    });
    return AggregationApiDataSource.mapToAggregation(data);
  }

  async verifyAggregationItem(
    aggregationId: string,
    itemId: string,
    verifiedQuantity: number,
    qualityGrade: NonNullable<AggregationItem['qualityGrade']>,
    notes?: string
  ): Promise<AggregationItem> {
    const data = await apiClient.patch<any>(`/aggregations/${aggregationId}/items/${itemId}/verify`, {
      verified_quantity_kuntal: verifiedQuantity,
      quality_grade: qualityGrade,
      ...(notes && { notes }),
    });
    return AggregationApiDataSource.mapToItem(data);
  }

  async updateAggregationItemStatus(
    aggregationId: string,
    itemId: string,
    status: AggregationItem['status'],
    notes?: string
  ): Promise<AggregationItem> {
    const data = await apiClient.patch<any>(`/aggregations/${aggregationId}/items/${itemId}/status`, {
      status,
      ...(notes && { notes }),
    });
    return AggregationApiDataSource.mapToItem(data);
  }

  async getMyAggregations(params?: { skip?: number; limit?: number; keyword?: string }): Promise<Aggregation[]> {
    const data = await apiClient.get<Aggregation[]>('/aggregations/me', {
      skip: params?.skip,
      limit: params?.limit,
      keyword: params?.keyword
    });
    return data.map(AggregationApiDataSource.mapToAggregation);
  }

  async getAssociationAggregations(associationId: string, params?: { skip?: number; limit?: number; keyword?: string }): Promise<Aggregation[]> {
    const data = await apiClient.get<Aggregation[]>(`/associations/${associationId}/aggregations`, {
      skip: params?.skip,
      limit: params?.limit,
      keyword: params?.keyword
    });
    return data.map(AggregationApiDataSource.mapToAggregation);
  }

  private static mapToCropType(data: any): CropType {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      unit: data.unit,
      isActive: data.is_active,
      createdAt: data.created_at,
    };
  }

  async getCropTypes(): Promise<CropType[]> {
    const data = await apiClient.get<any[]>('/crop-types/');
    return data.map(AggregationApiDataSource.mapToCropType);
  }
}

export class AggregationRepositoryImpl implements AggregationRepository {
  private apiDataSource: AggregationApiDataSource;

  constructor() {
    this.apiDataSource = new AggregationApiDataSource();
  }

  async getOpenAggregations(params?: {
    skip?: number;
    limit?: number;
    cropTypeId?: string;
    minQuantity?: number;
    keyword?: string;
    region?: string;
  }): Promise<Aggregation[]> {
    return this.apiDataSource.getOpenAggregations(params);
  }

  async getAggregationDetail(id: string): Promise<Aggregation> {
    return this.apiDataSource.getAggregationDetail(id);
  }

  async createAggregation(aggregation: Omit<Aggregation, 'id' | 'createdAt' | 'updatedAt' | 'items'>): Promise<Aggregation> {
    return this.apiDataSource.createAggregation(aggregation);
  }

  async deleteAggregation(id: string): Promise<void> {
    return this.apiDataSource.deleteAggregation(id);
  }

  async contributeToAggregation(aggregationId: string, item: Omit<AggregationItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'farmerName'>): Promise<AggregationItem> {
    return this.apiDataSource.contributeToAggregation(aggregationId, item);
  }

  async updateAggregationStatus(id: string, status: Aggregation['status']): Promise<Aggregation> {
    return this.apiDataSource.updateAggregationStatus(id, status);
  }

  async verifyAggregationItem(
    aggregationId: string,
    itemId: string,
    verifiedQuantity: number,
    qualityGrade: NonNullable<AggregationItem['qualityGrade']>,
    notes?: string
  ): Promise<AggregationItem> {
    return this.apiDataSource.verifyAggregationItem(aggregationId, itemId, verifiedQuantity, qualityGrade, notes);
  }

  async updateAggregationItemStatus(
    aggregationId: string,
    itemId: string,
    status: AggregationItem['status'],
    notes?: string
  ): Promise<AggregationItem> {
    return this.apiDataSource.updateAggregationItemStatus(aggregationId, itemId, status, notes);
  }

  async getMyAggregations(params?: { skip?: number; limit?: number }): Promise<Aggregation[]> {
    return this.apiDataSource.getMyAggregations(params);
  }

  async getAssociationAggregations(associationId: string, params?: { skip?: number; limit?: number }): Promise<Aggregation[]> {
    return this.apiDataSource.getAssociationAggregations(associationId, params);
  }

  async getCropTypes(): Promise<CropType[]> {
    return this.apiDataSource.getCropTypes();
  }
}