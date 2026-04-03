import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

export const homeRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/',
    component: DashboardPage,
});
