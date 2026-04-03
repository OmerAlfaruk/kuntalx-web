import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { PlaceOrderPage } from '../features/orders/pages/PlaceOrderPage';

export const placeOrderRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'place-order/$poolId',
    component: PlaceOrderPage,
});
