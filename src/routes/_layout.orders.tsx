import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { OrdersPage } from '../features/orders/pages/OrdersPage';

export const ordersRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'orders',
    component: OrdersPage,
});
