import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { indexRoute } from './index';
import { loginRoute } from './login';
import { registerRoute } from './register';
import { appRoute } from './_layout';
import { NotFoundPage } from '../shared/pages/NotFoundPage';
import { dashboardRoute } from './_layout.index';
import { aggregationsRoute } from './_layout.aggregations';
import { aggregationDetailRoute } from './_layout.aggregations.$id';
import { ordersRoute } from './_layout.orders';
import { orderDetailRoute } from './_layout.orders.$id';
import { analyticsRoute } from './_layout.analytics';
import { settingsRoute } from './_layout.settings';
import { associationRequestsRoute } from './_layout.requests';
import { usersRoute } from './_layout.users';
import { associationsRoute } from './_layout.associations';
import { associationDetailRoute } from './_layout.associations.$id';
import { cropTypesRoute } from './_layout.crop-types';
import { auditLogsRoute } from './_layout.audit-logs';
import { shipmentsRoute } from './_layout.shipments';
import { shipmentDetailRoute } from './_layout.shipments.$id';
import { payoutsRoute } from './_layout.payouts';
import { payoutDetailRoute } from './_layout.payouts.$id';
import { farmersRoute } from './_layout.farmers';
import { farmerDetailRoute } from './_layout.farmers.$id';
import { myAggregationsRoute } from './_layout.my-aggregations';
import { placeOrderRoute } from './_layout.place-order.$poolId';
import { qualityControlRoute } from './_layout.quality-control';
import { fleetMapRoute } from './_layout.fleet-map';
import { paymentTrackingRoute } from './_layout.payments';
import { assocMembershipRequestsRoute } from './_layout.assoc-requests';

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    appRoute.addChildren([
        dashboardRoute,
        aggregationsRoute,
        aggregationDetailRoute,
        ordersRoute,
        orderDetailRoute,
        analyticsRoute,
        settingsRoute,
        associationRequestsRoute,
        usersRoute,
        associationsRoute,
        associationDetailRoute,
        cropTypesRoute,
        auditLogsRoute,
        shipmentsRoute,
        shipmentDetailRoute,
        payoutsRoute,
        payoutDetailRoute,
        farmersRoute,
        farmerDetailRoute,
        myAggregationsRoute,
        placeOrderRoute,
        qualityControlRoute,
        fleetMapRoute,
        paymentTrackingRoute,
        assocMembershipRequestsRoute,
    ]),
]);

export const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => <NotFoundPage />,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
