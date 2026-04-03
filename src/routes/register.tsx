import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { RegisterPage } from '../features/auth/pages/RegisterPage';

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: RegisterPage,
});
