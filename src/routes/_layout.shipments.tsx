import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { ShipmentsPage } from '../features/shipments/pages/ShipmentsPage';

export const shipmentsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'shipments',
    component: ShipmentsPage,
});
