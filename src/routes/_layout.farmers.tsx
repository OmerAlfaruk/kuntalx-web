import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { FarmersPage } from '../features/farmers/pages/FarmersPage';

export const farmersRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'farmers',
    component: FarmersPage,
});
