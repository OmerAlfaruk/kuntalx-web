import type { QualityInspection, QualityInspectionCreate } from '../hooks/use-quality-data';
import { apiClient } from '../../../lib/api-client';

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

export class CreateQualityInspectionUseCase {
    async execute(data: QualityInspectionCreate): Promise<QualityInspection> {
        const payload = {
            aggregation_id: data.aggregationId,
            moisture_content: data.moistureContent,
            purity_percentage: data.purityPercentage,
            foreign_matter_percentage: data.foreignMatterPercentage,
            grade: data.grade,
            inspector_notes: data.inspectorNotes,
        };
        const response = await apiClient.post<any>('/quality', payload);
        return mapToEntity(response);
    }
}
