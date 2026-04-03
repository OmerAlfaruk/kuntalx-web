import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { FleetMapPage } from '../features/fleet/pages/FleetMapPage';

export const fleetMapRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'fleet-map',
    component: FleetMapPage,
});
