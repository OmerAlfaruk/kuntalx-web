import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { LandingPage } from '../features/marketing/pages/LandingPage';

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
});
