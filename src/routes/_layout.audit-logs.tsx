import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { AuditLogsPage } from '../features/admin/pages/AuditLogsPage';

export const auditLogsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'audit-logs',
    component: AuditLogsPage,
});
