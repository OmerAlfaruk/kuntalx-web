import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AssociationRequestsPage } from '../features/admin/pages/AssociationRequestsPage';

export const associationRequestsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'requests',
    component: AssociationRequestsPage,
});
