import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { AdminRepositoryImpl } from '../../admin';
import type { Association } from '../../admin';
import {
    GetAssociationsUseCase,
    GetAssociationDetailUseCase,
    CreateAssociationUseCase,
    UpdateAssociationUseCase,
    DeleteAssociationUseCase
} from '../../admin';

const repo = new AdminRepositoryImpl();
const getAssociationsUseCase = new GetAssociationsUseCase(repo);
const getAssociationDetailUseCase = new GetAssociationDetailUseCase(repo);
const createAssociationUseCase = new CreateAssociationUseCase(repo);
const updateAssociationUseCase = new UpdateAssociationUseCase(repo);
const deleteAssociationUseCase = new DeleteAssociationUseCase(repo);

export const useAssociations = (keyword?: string) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const associationsQuery = useQuery({
        queryKey: ['associations', keyword],
        queryFn: () => getAssociationsUseCase.execute(keyword),
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<Association>) => createAssociationUseCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associations'] });
            toast.success('Association created successfully');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Association> }) =>
            updateAssociationUseCase.execute(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associations'] });
            toast.success('Association updated successfully');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAssociationUseCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['associations'] });
            toast.success('Association deleted successfully');
        },
    });

    return {
        associations: associationsQuery.data ?? [],
        isLoading: associationsQuery.isLoading,
        error: associationsQuery.error,
        createAssociation: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateAssociation: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteAssociation: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};

export const useAssociationDetail = (id?: string) => {
    return useQuery({
        queryKey: ['associations', id],
        queryFn: () => {
            if (!id) throw new Error('ID is required');
            return getAssociationDetailUseCase.execute(id);
        },
        enabled: !!id,
    });
};
