import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { FarmerDetailPage } from '../features/farmers/pages/FarmerDetailPage';

export const farmerDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'farmers/$id',
    component: FarmerDetailPage,
});
