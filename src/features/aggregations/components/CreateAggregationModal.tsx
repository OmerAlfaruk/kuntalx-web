import React, { useState } from 'react';
import { CustomSelect, KuntalLoader } from '../../../shared/components/UI';
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="card-minimal w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                    <h2 className="text-[14px] font-bold text-foreground tracking-tight">Create Aggregation Pool</h2>
                    <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Initialize a new produce collection</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Title</label>
                            <input
                                type="text"
                                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="e.g. Harvest 2024 Batch A"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Crop Type</label>
                            <CustomSelect
                                value={formData.cropTypeId}
                                onChange={(val) => setFormData({ ...formData, cropTypeId: val })}
                                options={cropOptions}
                                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Description</label>
                            <textarea
                                className="w-full min-h-[100px] p-4 bg-background border border-border rounded-xl text-[13px] font-medium text-foreground focus:border-primary/50 outline-none transition-all resize-none placeholder:text-muted-foreground/30"
                                placeholder="Detail the quality, origin, and specific traits of this pool..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Target Volume (Quintals)</label>
                                <input
                                    type="number"
                                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all"
                                    value={formData.targetQuantityKuntal}
                                    onChange={(e) => setFormData({ ...formData, targetQuantityKuntal: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Floor Price (ETB/qt)</label>
                                <input
                                    type="number"
                                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all"
                                    value={formData.pricePerKuntal}
                                    onChange={(e) => setFormData({ ...formData, pricePerKuntal: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Expected Delivery Date</label>
                                <input
                                    type="date"
                                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-muted-foreground focus:border-primary/50 outline-none transition-all"
                                    value={formData.expectedDeliveryDate}
                                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Region / Origin</label>
                                <input
                                    type="text"
                                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="e.g. Sidama"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Cover Image URL</label>
                            <input
                                type="url"
                                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-[13px] font-bold text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="https://..."
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {createMutation.isPending ? <KuntalLoader variant="small" /> : 'Create Pool'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
