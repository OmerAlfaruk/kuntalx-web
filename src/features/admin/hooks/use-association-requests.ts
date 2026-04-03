import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRepositoryImpl } from '../api/admin-repository-impl';

const repo = new AdminRepositoryImpl();

export const useAssociationRequests = (keyword?: string) => {
    const queryClient = useQueryClient();

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['association-requests', keyword],
        queryFn: () => repo.getAssociationCreationRequests({ keyword })
    });

    const approveMutation = useMutation({
        mutationFn: ({ requestId, adminData }: { requestId: string; adminData: any }) => 
            repo.approveAssociationRequest(requestId, adminData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['association-requests'] })
    });

    const rejectMutation = useMutation({
        mutationFn: (requestId: string) => repo.rejectAssociationRequest(requestId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['association-requests'] })
    });

    return {
        requests,
        isLoading,
        approve: approveMutation.mutateAsync,
        reject: rejectMutation.mutateAsync
    };
};
