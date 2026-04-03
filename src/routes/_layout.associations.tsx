import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AssociationsPage } from '../features/associations/pages/AssociationsPage';

export const associationsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'associations',
    component: AssociationsPage,
});
