import type { QualityInspection } from '../hooks/use-quality-data';
import { apiClient } from '../../../lib/api-client';

// Note: Quality feature is using direct apiClient in hook presently. 
// I should probably define a repository for it too, or at least use the UseCase pattern with the current logic.
// According to the plan, I'll create the Use Cases.

const mapToEntity = (data: any): QualityInspection => ({
    id: data.id,
    aggregationId: data.aggregation_id,
    inspectorId: data.inspector_id,
    moistureContent: data.moisture_content,
    purityPercentage: data.purity_percentage,
    foreignMatterPercentage: data.foreign_matter_percentage,
    grade: data.grade,
    inspectorNotes: data.inspector_notes,
    createdAt: data.created_at,
});

export class GetQualityInspectionsUseCase {
    async execute(keyword?: string): Promise<QualityInspection[]> {
        const data = await apiClient.get<any[]>('/quality', {
            keyword: keyword || undefined
        });
        return data.map(mapToEntity);
    }
}
