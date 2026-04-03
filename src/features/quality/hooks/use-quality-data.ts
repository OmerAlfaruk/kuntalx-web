import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import {
    GetQualityInspectionsUseCase,
    CreateQualityInspectionUseCase
} from '../services';

export interface QualityInspection {
    id: string;
    aggregationId: string;
    inspectorId: string;
    moistureContent: number;
    purityPercentage: number;
    foreignMatterPercentage: number;
    grade: 'A' | 'B' | 'C' | 'REJECTED';
    inspectorNotes?: string;
    createdAt: string;
}

export interface QualityInspectionCreate {
    aggregationId: string;
    moistureContent: number;
    purityPercentage: number;
    foreignMatterPercentage: number;
    grade: string;
    inspectorNotes?: string;
}

const getQualityInspectionsUseCase = new GetQualityInspectionsUseCase();
const createQualityInspectionUseCase = new CreateQualityInspectionUseCase();

export const useQualityInspections = (keyword?: string) => {
    return useQuery<QualityInspection[]>({
        queryKey: ['quality-inspections', keyword],
        queryFn: () => getQualityInspectionsUseCase.execute(keyword),
    });
};

export const useCreateQualityInspection = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: QualityInspectionCreate) => createQualityInspectionUseCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quality-inspections'] });
            toast.success('Quality inspection recorded successfully');
        },
    });
};
