import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { PayoutDetailPage } from '../features/payouts/pages/PayoutDetailPage';

export const payoutDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'payouts/$id',
    component: PayoutDetailPage,
});
