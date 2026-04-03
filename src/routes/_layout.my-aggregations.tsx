import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { MyAggregationsPage } from '../features/aggregations/pages/MyAggregationsPage';

export const myAggregationsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'my-aggregations',
    component: MyAggregationsPage,
});
