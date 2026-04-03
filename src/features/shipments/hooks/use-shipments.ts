import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../lib/toast-context';
import { shipmentRepository as repository } from '../api/shipment-repository-impl';
import {
    GetShipmentsUseCase,
    GetShipmentDetailUseCase,
    GetShipmentTrackingUseCase,
    CreateShipmentUseCase
} from '../services';

const getShipmentsUseCase = new GetShipmentsUseCase(repository);
const getShipmentDetailUseCase = new GetShipmentDetailUseCase(repository);
const getShipmentTrackingUseCase = new GetShipmentTrackingUseCase(repository);
const createShipmentUseCase = new CreateShipmentUseCase(repository);

export const useShipments = (status?: string, keyword?: string, skip?: number, limit?: number) => {
    return useQuery({
        queryKey: ['shipments', status, keyword, skip, limit],
        queryFn: () => getShipmentsUseCase.execute(status, keyword, skip, limit),
    });
};

export const useShipmentDetail = (id: string) => {
    return useQuery({
        queryKey: ['shipment', id],
        queryFn: () => getShipmentDetailUseCase.execute(id),
        enabled: !!id,
    });
};

export const useShipmentTracking = (id: string) => {
    return useQuery({
        queryKey: ['shipment-tracking', id],
        queryFn: () => getShipmentTrackingUseCase.execute(id),
        enabled: !!id,
    });
};

export const useCreateShipment = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => createShipmentUseCase.execute(data),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['shipments'] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            if (data?.order_id) {
                queryClient.invalidateQueries({ queryKey: ['order', data.order_id] });
            }
            toast.success('Shipment created successfully');
        },
    });
};
