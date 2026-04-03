import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';

export const analyticsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'analytics',
    component: AnalyticsPage,
});
