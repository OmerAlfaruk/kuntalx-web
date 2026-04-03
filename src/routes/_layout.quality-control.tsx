import { createRoute } from '@tanstack/react-router';
import { appRoute } from './_layout';
import { QualityControlPage } from '../features/quality/pages/QualityControlPage';

export const qualityControlRoute = createRoute({
    getParentRoute: () => appRoute,
    path: 'quality-control',
    component: QualityControlPage,
});
