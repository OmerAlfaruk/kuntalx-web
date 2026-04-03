import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { AdminRepositoryImpl } from '../api/admin-repository-impl';
import type { CropType } from '../types/admin';

const repo = new AdminRepositoryImpl();

export const useCropTypes = (keyword?: string) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: cropTypes = [], isLoading } = useQuery({
        queryKey: ['crop-types', keyword],
        queryFn: () => repo.getCropTypes({ keyword })
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<CropType>) => repo.createCropType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crop-types'] });
            toast.success('Crop type created successfully');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CropType> }) => repo.updateCropType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crop-types'] });
            toast.success('Crop type updated successfully');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => repo.deleteCropType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['crop-types'] });
            toast.success('Crop type deleted successfully');
        }
    });

    return {
        cropTypes,
        isLoading,
        createCropType: createMutation.mutateAsync,
        updateCropType: updateMutation.mutateAsync,
        deleteCropType: deleteMutation.mutateAsync
    };
};

export const useAuditLogs = (params?: any) => {
    return useQuery<any[]>({
        queryKey: ['audit-logs', params],
        queryFn: () => repo.getAuditLogs(params)
    });
};
