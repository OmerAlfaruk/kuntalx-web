import { createRoute, Outlet } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { MainLayout } from '../shared/components/MainLayout';

export const appRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'app',
    component: () => (
        <MainLayout>
            <Outlet />
        </MainLayout>
    ),
});
