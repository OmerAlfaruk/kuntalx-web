import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { AdminRepositoryImpl } from '../../admin';
import {
    GetUsersUseCase,
    UpdateUserRoleUseCase,
    DeactivateUserUseCase
} from '../../admin';

const repo = new AdminRepositoryImpl();
const getUsersUseCase = new GetUsersUseCase(repo);
const updateUserRoleUseCase = new UpdateUserRoleUseCase(repo);
const deactivateUserUseCase = new DeactivateUserUseCase(repo);

export const useUsers = (filters?: { role?: string; skip?: number; limit?: number; keyword?: string }) => {
    const toast = useToast();
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey: ['users', filters],
        queryFn: () => getUsersUseCase.execute(filters),
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            updateUserRoleUseCase.execute(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User role updated successfully');
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: (userId: string) => deactivateUserUseCase.execute(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deactivated successfully');
        },
    });

    return {
        users: usersQuery.data ?? [],
        isLoading: usersQuery.isLoading,
        error: usersQuery.error,
        updateRole: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
        deactivate: deactivateMutation.mutateAsync,
        isDeactivating: deactivateMutation.isPending,
    };
};
