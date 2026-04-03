import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AggregationDetailPage } from '../features/aggregations/pages/AggregationDetailPage';

export const aggregationDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'aggregations/$id',
    component: AggregationDetailPage,
});
