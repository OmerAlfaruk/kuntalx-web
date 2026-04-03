import { useNavigate, useParams } from '@tanstack/react-router';
import {
    useAggregationDetail,
    useUpdateAggregationStatus,
    useVerifyAggregationItem
} from '../hooks/use-aggregations';
import { useAuth } from '../../../lib/auth-context';
import { type Aggregation, type AggregationItem } from '../types/aggregation';
import { useState, useCallback } from 'react';
import { AggregationInventory } from '../components/AggregationInventory';
import { AggregationDetailHeader } from '../components/AggregationDetailHeader';
import { AggregationDetailHero } from '../components/AggregationDetailHero';
import { AggregationDetailMetrics } from '../components/AggregationDetailMetrics';
import { AggregationDetailSpecs } from '../components/AggregationDetailSpecs';
import { AggregationDetailOps } from '../components/AggregationDetailOps';
import { VerificationTerminal } from '../components/VerificationTerminal';
import { SkeletonDetail } from '../../../shared/components/Skeletons';

export const AggregationDetailPage = () => {
    const { id = '' } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: aggregation, isLoading, error } = useAggregationDetail(id);
    const { mutateAsync: updateStatus } = useUpdateAggregationStatus();
    const { mutateAsync: verifyItem, isPending: isVerifying } = useVerifyAggregationItem();

    // Verification State (from original web implementation)
    const [verifyingItem, setVerifyingItem] = useState<AggregationItem | null>(null);
    const [verifyForm, setVerifyForm] = useState({
        verifiedQuantity: '',
        qualityGrade: 'B',
        notes: ''
    });

    const isForbidden = (error as any)?.response?.status === 403;
    const isAssociationAdmin = Boolean(
        user?.role === 'association_admin' &&
        user?.associationId &&
        String(user.associationId) === String(aggregation?.associationId)
    );
    const isPlatformAdmin = user?.role === 'platform_admin';
    const isBuyer = user?.role === 'buyer';
    const isMiniFarmer = Boolean(user?.role === 'farmer' && user?.farmerData?.isMiniAssociation);
    const isOwner = Boolean(isMiniFarmer && user?.id === aggregation?.ownerId);
    
    // Standalone producers cannot manually change status (always ready_for_sale)
    const canManageAggregation = Boolean(isAssociationAdmin || isPlatformAdmin);

    const handleStatusChange = useCallback(async (newStatus: string) => {
        try {
            await updateStatus([id, newStatus as Aggregation['status']]);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    }, [id, updateStatus]);

    const handleVerifyItem = useCallback(async () => {
        if (!verifyingItem || !aggregation) return;
        try {
            await verifyItem([
                aggregation.id,
                verifyingItem.id,
                Number(verifyForm.verifiedQuantity) || verifyingItem.quantityKuntal,
                verifyForm.qualityGrade as any,
                verifyForm.notes
            ]);
            setVerifyingItem(null);
            setVerifyForm({ verifiedQuantity: '', qualityGrade: 'B', notes: '' });
        } catch (error) {
            console.error('Failed to verify item', error);
        }
    }, [verifyingItem, aggregation, verifyItem, verifyForm]);

    if (isLoading) return (
        <div className="space-y-10">
            <div className="h-64 w-full card-minimal animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 card-minimal animate-pulse" />)}
            </div>
            <SkeletonDetail />
        </div>
    );

    if (!aggregation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-10 card-minimal">
                <div className="text-6xl mb-8 opacity-20">{isForbidden ? '🔐' : '📂'}</div>
                <h2 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tight">
                    {isForbidden ? 'Access Restricted' : 'Collection Pool Not Found'}
                </h2>
                <p className="text-muted-foreground mb-10 font-medium max-w-md mx-auto">
                    {isForbidden
                        ? 'You do not have the required permissions to view this collection detail.'
                        : 'The collection pool you are looking for does not exist or has been removed.'}
                </p>
                <button
                    onClick={() => navigate({ to: '/aggregations' })}
                    className="h-12 px-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-minimal hover:bg-primary/90 transition-all"
                >
                    Return to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 sm:space-y-20 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">

            <AggregationDetailHeader
                aggregation={aggregation}
                canManage={canManageAggregation}
                handleStatusChange={handleStatusChange}
            />

            <AggregationDetailHero aggregation={aggregation} />

            <AggregationDetailMetrics aggregation={aggregation} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-16">
                    <AggregationDetailSpecs aggregation={aggregation} />

                    {((isAssociationAdmin || isPlatformAdmin) && !isOwner) && (
                        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="flex items-center justify-between border-b border-border/60 pb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Fulfillment History</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Producer contribution list</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 bg-background-soft px-4 py-2 rounded-lg border border-border">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                                    <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Live Updates</span>
                                </div>
                            </div>

                            <AggregationInventory
                                aggregation={aggregation}
                                isAdmin={canManageAggregation}
                                isBuyer={isBuyer}
                                onVerify={(item) => setVerifyingItem(item)}
                            />
                        </section>
                    )}
                </div>

                <div className="lg:col-span-4 self-start sticky top-24">
                    <AggregationDetailOps aggregation={aggregation} user={user} />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-20 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                <p>© 2026 KuntalX Ethiopia. Secure Trade Hub.</p>
                <div className="flex items-center gap-4">
                    <span className="tracking-widest">Trade verification active</span>
                </div>
            </div>

            {/* Verification Terminal Overlay */}
            {verifyingItem && (
                <VerificationTerminal
                    item={verifyingItem}
                    verifyForm={verifyForm}
                    setVerifyForm={setVerifyForm}
                    handleVerifyItem={handleVerifyItem}
                    onAbort={() => setVerifyingItem(null)}
                    isVerifying={isVerifying}
                />
            )}
        </div>
    );
};

