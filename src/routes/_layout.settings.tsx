import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { SettingsPage } from '../features/settings/pages/SettingsPage';

export const settingsRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'settings',
    component: SettingsPage,
});
