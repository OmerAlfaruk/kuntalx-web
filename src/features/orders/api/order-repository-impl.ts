
import type { Order } from '../types/order';
import type { CreateOrderDto } from '../types/dto/create-order.dto';
import type { OrderRepository } from './order-repository';
import { AggregationApiDataSource } from '../../aggregations/api/aggregation-repository-impl';
import { apiClient } from '../../../lib/api-client';

export class OrderRepositoryImpl implements OrderRepository {
    async getMyOrders(status?: string, fromDate?: string, toDate?: string, keyword?: string, skip?: number, limit?: number): Promise<Order[]> {
        const data = await apiClient.get<any[]>('/orders/', {
            status: status === 'all' ? undefined : status,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
            keyword: keyword || undefined,
            skip: skip || undefined,
            limit: limit || undefined
        });
        return data.map(this.mapToEntity);
    }

    async getOrderDetail(id: string): Promise<Order> {
        const data = await apiClient.get<any>(`/orders/${id}`);
        return this.mapToEntity(data);
    }

    async createOrder(order: CreateOrderDto): Promise<Order> {
        const payload = {
            aggregation_id: order.aggregationId,
            requested_quantity_kuntal: order.requestedQuantityKuntal,
            price_per_kuntal: order.pricePerKuntal,
            delivery_window_start: order.deliveryWindowStart,
            delivery_window_end: order.deliveryWindowEnd,
            quality_requirements: order.qualityRequirements
        };
        const response = await apiClient.post<any>('/orders/', payload);
        return this.mapToEntity(response);
    }

    async cancelOrder(id: string): Promise<Order> {
        const response = await apiClient.delete<any>(`/orders/${id}`);
        return this.mapToEntity(response);
    }

    async updateStatus(id: string, status: string): Promise<Order> {
        const data = await apiClient.patch<any>(`/orders/${id}/status`, {}, {
            params: { status: status }
        });
        return this.mapToEntity(data);
    }

    async payOrder(id: string): Promise<Order> {
        const response = await apiClient.post<any>(`/orders/${id}/pay`, {});
        return this.mapToEntity(response);
    }

    async initiatePayment(orderId: string, method: string, transactionRef?: string): Promise<any> {
        return apiClient.post('/payments/initiate', { 
            order_id: orderId, 
            payment_method: method,
            transaction_reference: transactionRef
        });
    }

    async verifyPayment(reference: string): Promise<any> {
        return apiClient.post('/payments/verify', { reference });
    }

    async simulateConfirmPayment(reference: string): Promise<any> {
        // Only works when PAYMENT_SIMULATION_MODE=True on the backend.
        // Confirms a pending payment so the full order flow can be tested.
        return apiClient.post(`/payments/simulate-confirm/${reference}`);
    }

    private mapToEntity(data: any): Order {
        return {
            id: data.id,
            buyerId: data.buyer_id,
            aggregationId: data.aggregation_id,
            requestedQuantityKuntal: data.requested_quantity_kuntal,
            pricePerKuntal: data.price_per_kuntal,
            totalPrice: data.total_price,
            createdAt: data.created_at,
            deletedAt: data.deleted_at,
            aggregation: data.aggregation ? AggregationApiDataSource.mapToAggregation(data.aggregation) : undefined,
            status: data.status,
            paymentStatus: data.payment_status,
            buyerName: data.buyer?.business_name || data.buyer?.user?.full_name || data.buyer_name,
            buyerPhone: data.buyer?.user?.phone,
            buyerEmail: data.buyer?.user?.email,
            referenceCode: data.reference_code,
            woreda: data.woreda,
            contactPhone: data.contact_phone,
        };
    }
}
