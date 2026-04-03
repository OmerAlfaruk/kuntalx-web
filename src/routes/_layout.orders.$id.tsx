import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';

export const orderDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'orders/$id',
    component: OrderDetailPage,
});
