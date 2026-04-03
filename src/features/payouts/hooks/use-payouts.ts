import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { useAuth } from '../../../lib/auth-context';
import { PayoutRepositoryImpl } from '../api/payout-repository-impl';
import {
    GetPayoutsUseCase,
    GetPayoutDetailUseCase,
    DistributePayoutUseCase,
    UpdatePayoutUseCase
} from '../services';
import type { Payout } from '../types/payout';

const repository = new PayoutRepositoryImpl();
const getPayoutsUseCase = new GetPayoutsUseCase(repository);
const getPayoutDetailUseCase = new GetPayoutDetailUseCase(repository);
const distributePayoutUseCase = new DistributePayoutUseCase(repository);
const updatePayoutUseCase = new UpdatePayoutUseCase(repository);

export const usePayouts = (keyword?: string, skip?: number, limit?: number) => {
    const { user } = useAuth();

    return useQuery<Payout[]>({
        queryKey: ['payouts', keyword, skip, limit, user?.role],
        queryFn: () => {
            if (!user?.role) return [];
            return getPayoutsUseCase.execute(user.role, keyword, skip, limit);
        },
        enabled: !!user,
    });
};

export const useDistributePayout = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) => distributePayoutUseCase.execute(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            toast.success('Payout distributed successfully');
        },
    });
};

export const useUpdatePayoutStatus = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, transactionRef }: { id: string, status: string, transactionRef?: string }) => 
            updatePayoutUseCase.execute(id, status, transactionRef),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            queryClient.invalidateQueries({ queryKey: ['payout', variables.id] });
            toast.success(`Payout marked as ${variables.status}`);
        },
        onError: () => toast.error('Failed to update payout status'),
    });
};

export const usePayoutDetail = (id?: string) => {
    const { user } = useAuth();

    return useQuery<Payout | null>({
        queryKey: ['payout', id],
        queryFn: async () => {
            if (!id) return null;
            return getPayoutDetailUseCase.execute(id);
        },
        enabled: !!id && !!user,
    });
};

export type { Payout };
