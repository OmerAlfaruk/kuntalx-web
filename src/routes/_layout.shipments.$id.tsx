import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { ShipmentDetailPage } from '../features/shipments/pages/ShipmentDetailPage';

export const shipmentDetailRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'shipments/$id',
    component: ShipmentDetailPage,
});
