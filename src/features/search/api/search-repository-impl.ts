import { apiClient } from '../../../lib/api-client';
import type { SearchResult } from '../types/search-result';
import type { SearchRepository } from './search-repository';

export class SearchRepositoryImpl implements SearchRepository {
    async search(keyword: string, limit: number = 5): Promise<SearchResult> {
        const data = await apiClient.get<any>('/search', { keyword, limit });

        return {
            aggregations: (data.aggregations || []).map(this.mapToAggregation),
            associations: (data.associations || []).map(this.mapToAssociationMinimal)
        };
    }

    private mapToAggregation(data: any): any {
        return {
            id: data.id,
            cropTypeId: data.crop_type_id,
            cropTypeName: data.crop_name,
            targetQuantityKuntal: data.target_quantity_kuntal,
            totalQuantityKuntal: data.total_quantity_kuntal,
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
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    }

    private mapToAssociationMinimal(data: any): any {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            region: data.region
        };
    }
}
