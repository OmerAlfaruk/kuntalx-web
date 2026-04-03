import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout.tsx';
import { AssociationDetailPage } from '../features/associations/pages/AssociationDetailPage';

export const associationDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/associations/$id',
    component: AssociationDetailPage,
});
