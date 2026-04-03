import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { MarketplacePage } from '../features/aggregations';

export const aggregationsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'aggregations',
    component: MarketplacePage,
});
