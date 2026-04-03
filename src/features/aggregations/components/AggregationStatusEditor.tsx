import { CustomSelect } from '../../../shared/components/UI';
import type { AggregationStatus } from '../types/aggregation';

interface Props {
    currentStatus: AggregationStatus | string;
    onStatusChange: (newStatus: string) => void;
    isLoading?: boolean;
}

export const AggregationStatusEditor = ({ currentStatus, onStatusChange, isLoading }: Props) => {
    const options = [
        { value: 'draft', label: 'Draft' },
        { value: 'collecting', label: 'Collecting' },
        { value: 'ready_for_sale', label: 'Ready for Sale' },
        { value: 'funded', label: 'Funded' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div className={`w-full ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <CustomSelect
                value={currentStatus}
                onChange={onStatusChange}
                options={options}
                placeholder="EDIT STATUS"
                className="bg-card border-border/50 text-xs font-bold uppercase tracking-widest p-3 rounded-lg"
            />
        </div>
    );
};
