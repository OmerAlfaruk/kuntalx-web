import { Badge } from '../../../shared/components/UI';
import type { AggregationStatus } from '../types/aggregation';

export const AggregationStatusChip = ({ status, className = "" }: { status: AggregationStatus | string, className?: string }) => {
    switch (status) {
        case 'draft':
            return <Badge variant="outline" className={className}>Draft</Badge>;
        case 'collecting':
            return <Badge variant="primary" className={className}>Collecting</Badge>;
        case 'ready_for_sale':
            return <Badge variant="success" className={className}>Ready For Sale</Badge>;
        case 'reserved':
        case 'funded':
            return <Badge variant="gold" className={className}>Funded</Badge>;
        case 'fulfilled':
        case 'completed':
            return <Badge variant="secondary" className={className}>Completed</Badge>;
        case 'cancelled':
            return <Badge variant="error" className={className}>Cancelled</Badge>;
        default:
            return <Badge variant="outline" className={className}>{status?.replace(/_/g, ' ')}</Badge>;
    }
};
