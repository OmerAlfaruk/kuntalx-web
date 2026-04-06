import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { OrderRepositoryImpl } from '../api/order-repository-impl';
import {
    GetMyOrdersUseCase,
    GetOrderDetailUseCase,
    CreateOrderUseCase,
    UpdateOrderStatusUseCase,
    PayOrderUseCase,
    InitiatePaymentUseCase,

    SimulateConfirmPaymentUseCase
} from '../services';
import type { CreateOrderDto } from '../types/dto/create-order.dto';

const repository = new OrderRepositoryImpl();
const getMyOrdersUseCase = new GetMyOrdersUseCase(repository);
const getOrderDetailUseCase = new GetOrderDetailUseCase(repository);
const createOrderUseCase = new CreateOrderUseCase(repository);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(repository);
const payOrderUseCase = new PayOrderUseCase(repository);
const initiatePaymentUseCase = new InitiatePaymentUseCase(repository);

const simulateConfirmUseCase = new SimulateConfirmPaymentUseCase(repository);

export const useMyOrders = (status?: string, fromDate?: string, toDate?: string, keyword?: string, skip?: number, limit?: number) => {
    return useQuery({
        queryKey: ['my-orders', status, fromDate, toDate, keyword, skip, limit],
        queryFn: () => getMyOrdersUseCase.execute(status, fromDate, toDate, keyword, skip, limit),
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateOrder = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrderDto) => createOrderUseCase.execute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            toast.success('Order created successfully');
        },
    });
};

export const useOrderDetails = (id?: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            if (!id) return null;
            return getOrderDetailUseCase.execute(id);
        },
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            return updateOrderStatusUseCase.execute(id, status);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            queryClient.invalidateQueries({ queryKey: ['assoc-payment-orders'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success(`Order status updated to ${variables.status}`);
        },
        onError: () => toast.error('Failed to update status'),
    });
};

export const usePayOrder = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return payOrderUseCase.execute(id);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            toast.success('Payment initiated successfully');
        },
    });
};

export const useInitiatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, method, transactionRef }: { orderId: string, method: string, transactionRef?: string }) => {
            return initiatePaymentUseCase.execute(orderId, method, transactionRef);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            queryClient.invalidateQueries({ queryKey: ['assoc-payment-orders'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
    });
};

export const useVerifyPayment = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        // Uses /payments/simulate-confirm/{reference} — works when PAYMENT_SIMULATION_MODE=True
        mutationFn: async (reference: string) => {
            return simulateConfirmUseCase.execute(reference);
        },
        onSuccess: (data) => {
            if (data?.order_id) {
                queryClient.invalidateQueries({ queryKey: ['order', data.order_id] });
            }
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            queryClient.invalidateQueries({ queryKey: ['assoc-payment-orders'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Payment confirmed successfully');
        },
    });
};
