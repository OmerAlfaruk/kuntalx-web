import React, { useState } from 'react';
import { GlassModal, CustomSelect } from '../../../shared/components/UI';
import { useCreateAggregation, useCropTypes } from '../hooks/use-aggregations';
import { useAuth } from '../../../lib/auth-context';

interface CreateAggregationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateAggregationModal: React.FC<CreateAggregationModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { data: cropTypes } = useCropTypes();
    const createMutation = useCreateAggregation();

    const isMini = user?.farmerData?.isMiniAssociation;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cropTypeId: '',
        targetQuantityKuntal: 0,
        pricePerKuntal: 0,
        expectedDeliveryDate: new Date().toISOString().split('T')[0],
        aggregationType: 'full_association' as const,
        region: '',
        imageUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.cropTypeId || formData.targetQuantityKuntal <= 0) {
            alert('Please fill in required fields correctly.');
            return;
        }

        const selectedCrop = cropTypes?.find(c => c.id === formData.cropTypeId);

        try {
            await createMutation.mutateAsync({
                ...formData,
                cropTypeName: selectedCrop?.name,
                ownerId: user?.id || '',
                associationId: user?.associationId,
                associationName: isMini ? (user?.fullName || 'Individual Producer') : 'Local Association',
                // status and totalQuantityKuntal are managed by the backend — do not override
                aggregationType: isMini ? 'mini_association' : formData.aggregationType,
            });
            onClose();
        } catch (error) {
            console.error('Failed to create aggregation:', error);
            alert(`Failed to ${isMini ? 'add product' : 'create pool'}. Please try again.`);
        }
    };

    const cropOptions = cropTypes?.map(c => ({
        value: c.id,
        label: c.name
    })) || [];

    return (
        <GlassModal
            isOpen={isOpen}
            onClose={onClose}
            title="Declare New Produce Pool"
            footer={
                <div className="flex gap-4 w-full justify-end">
                    <button onClick={onClose} type="button" className="h-14 px-8 bg-card text-foreground rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-secondary/10 transition-all border border-border">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending}
                        className="h-14 px-8 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-4 group"
                    >
                        {createMutation.isPending ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Create Pool</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                    </button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Internal Title</label>
                    <input
                        type="text"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        placeholder="e.g. Harvest 2024 Batch A"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Crop Type</label>
                    <CustomSelect
                        value={formData.cropTypeId}
                        onChange={(val) => setFormData({ ...formData, cropTypeId: val })}
                        options={cropOptions}
                        className="w-full h-14 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Market Narrative (Description)</label>
                    <textarea
                        className="w-full min-h-[120px] p-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-medium text-foreground resize-none"
                        placeholder="Detail the quality, origin, and specific traits of this pool..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Target Volume (qt)</label>
                    <input
                        type="number"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        value={formData.targetQuantityKuntal}
                        onChange={(e) => setFormData({ ...formData, targetQuantityKuntal: Number(e.target.value) })}
                        required
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Floor Price (ETB/qt)</label>
                    <input
                        type="number"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        value={formData.pricePerKuntal}
                        onChange={(e) => setFormData({ ...formData, pricePerKuntal: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Delivery Target</label>
                    <input
                        type="date"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        value={formData.expectedDeliveryDate}
                        onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Region / Origin</label>
                    <input
                        type="text"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        placeholder="e.g. Sidama"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Representational Image URL</label>
                    <input
                        type="url"
                        className="w-full h-14 px-4 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-foreground"
                        placeholder="https://..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>
            </form>
        </GlassModal>
    );
};
