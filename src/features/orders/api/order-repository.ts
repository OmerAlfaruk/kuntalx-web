import type { Order } from '../types/order';
import type { CreateOrderDto } from '../types/dto/create-order.dto';

export interface OrderRepository {
    getMyOrders(status?: string, fromDate?: string, toDate?: string, keyword?: string, skip?: number, limit?: number): Promise<Order[]>;
    getOrderDetail(id: string): Promise<Order>;
    createOrder(order: CreateOrderDto): Promise<Order>;
    cancelOrder(id: string): Promise<Order>;
    updateStatus(id: string, status: string): Promise<Order>;
    payOrder(id: string): Promise<Order>;
    initiatePayment(orderId: string, method: string, transactionRef?: string): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    simulateConfirmPayment(reference: string): Promise<any>;
}
