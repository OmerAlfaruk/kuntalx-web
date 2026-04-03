import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AssocMembershipRequestsPage } from '../features/associations/pages/AssocMembershipRequestsPage';

export const assocMembershipRequestsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'assoc-requests',
    component: AssocMembershipRequestsPage,
});
