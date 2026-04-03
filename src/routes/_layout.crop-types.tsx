import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { CropTypesPage } from '../features/admin/pages/CropTypesPage';

export const cropTypesRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'crop-types',
    component: CropTypesPage,
});
