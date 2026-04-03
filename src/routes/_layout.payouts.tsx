import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { PayoutsPage } from '../features/payouts/pages/PayoutsPage';

export const payoutsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'payouts',
    component: PayoutsPage,
});
