import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

export const dashboardRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/dashboard',
    component: DashboardPage,
});
