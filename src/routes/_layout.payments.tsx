import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { PaymentTrackingPage } from '../features/payments/pages/PaymentTrackingPage';

export const paymentTrackingRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'payments',
    component: PaymentTrackingPage,
});
