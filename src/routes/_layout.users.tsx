import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { UsersPage } from '../features/users/pages/UsersPage';

export const usersRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'users',
    component: UsersPage,
});
