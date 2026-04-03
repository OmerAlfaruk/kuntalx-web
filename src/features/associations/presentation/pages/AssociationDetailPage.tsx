import { useParams, useNavigate } from '@tanstack/react-router';
import { StatCard, Badge, KuntalLoader } from '../../../../shared/components/UI';
import { useAuth } from '../../../../lib/auth-context';
import { useAssociationDetail } from '../hooks/use-associations';

import { useI18n } from '../../../../lib/i18n-context';
import { useAssociationAggregations } from '../../../aggregations';

export const AssociationDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useI18n();

    const { data: assoc, isLoading, error } = useAssociationDetail(id);

    if (isLoading) {
        return <KuntalLoader />;
    }

    if (error || !assoc) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-3xl shadow-sm">
                    ⚠️
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">{t('associations.notFound')}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                        {t('associations.notFoundDesc')}
                    </p>
                </div>
                <button
                    onClick={() => navigate({ to: '..' })}
                    className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                >
                    {t('associations.returnToDirectory')}
                </button>
            </div>
        );
    }

    const isPlatformAdmin = user?.role === 'platform_admin';
    const isOwnerAdmin = user?.role === 'association_admin' && user?.id === assoc.adminUserId;

    const { data: recentAggregations = [] } = useAssociationAggregations(id as string);

    return (
        <div className="space-y-16 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex items-start gap-6">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="h-12 w-12 rounded-md bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm group"
                    >
                        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    </button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase italic">{assoc.name}</h1>
                            <Badge variant="success" className="h-6 px-3 text-[10px] uppercase font-bold tracking-widest">
                                {t('associations.operational')}
                            </Badge>
                        </div>
                        <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-3 opacity-60 italic">
                            <span>{assoc.region} {t('associations.jurisdictionalZone')}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span>{t('associations.nodeRegistry')}: {new Date(assoc.createdAt).getFullYear()}</span>
                        </p>
                    </div>
                </div>

                {/* Role-Based Actions */}
                <div className="flex flex-wrap items-center gap-4">
                    {isPlatformAdmin && (
                        <>
                            <button className="h-11 px-6 rounded-md bg-card border border-border/60 text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm">
                                {t('associations.complianceReview')}
                            </button>
                            <button className="h-11 px-8 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                                <span>📢</span> {t('associations.systemNotice')}
                            </button>
                        </>
                    )}
                    {isOwnerAdmin && (
                        <>
                            <button className="h-11 px-6 rounded-md bg-card border border-border/60 text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-muted/50 transition-all shadow-sm">
                                {t('associations.manageProfile')}
                            </button>
                            <button className="h-11 px-8 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-2">
                                <span>+</span> {t('associations.initiateBatch')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title={t('associations.activeProducers')}
                    value={assoc.metrics?.totalFarmers || assoc.membershipCount || 0}
                    icon="👥"
                    description={t('associations.federatedMembers')}
                />
                <StatCard
                    title={t('associations.liveBatches')}
                    value={assoc.metrics?.activeAggregations || assoc.activeAggregationsCount || 0}
                    icon="🌾"
                    description={t('associations.inFlightCycles')}
                />
                <StatCard
                    title={t('associations.aggregateVolume')}
                    value={`${(assoc.metrics?.totalVolumeKuntal || 0).toLocaleString()} qt`}
                    icon="📊"
                    description={t('associations.totalCommodityFlow')}
                />
                <StatCard
                    title={t('associations.entityValue')}
                    value={`ETB ${(assoc.metrics?.totalValueEtb || assoc.totalSales || 0).toLocaleString()}`}
                    icon="💰"
                    description={t('associations.grossTradeVolume')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Active Aggregations Section */}
                    <div className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-border/60 flex justify-between items-center bg-muted/20">
                             <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest flex items-center gap-3 italic">
                                <span className="text-xl">🚜</span> {t('associations.activeAggregationProtocols')}
                            </h3>
                            {isOwnerAdmin && (
                                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all italic">
                                    {t('associations.historicalArchive')} →
                                </button>
                            )}
                        </div>

                        <div className="p-0">
                            {recentAggregations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted/10 border-b border-border/60 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest italic">
                                            <tr>
                                                <th className="px-6 py-4">{t('associations.protocolId')}</th>
                                                <th className="px-6 py-4">{t('associations.commodity')}</th>
                                                <th className="px-6 py-4">{t('associations.progress')}</th>
                                                <th className="px-6 py-4 text-center">{t('common.status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs divide-y divide-border/40">
                                            {recentAggregations.map((agg) => (
                                                <tr key={agg.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => navigate({ to: '/aggregations/$id', params: { id: agg.id } })}>
                                                    <td className="px-6 py-4">
                                                        <span className="font-extrabold text-foreground uppercase tracking-wider italic">
                                                            P-{(agg.id as string).substring(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-extrabold text-muted-foreground uppercase tracking-wider italic">
                                                            {agg.cropTypeName?.split(' ')[0]}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%` }} />
                                                            </div>
                                                            <span className="text-[10px] font-extrabold text-foreground italic">
                                                                {Math.round(((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant={agg.status === 'collecting' ? 'warning' : 'success'} className="text-[9px] uppercase font-bold tracking-widest">
                                                            {agg.status.replace(/_/g, ' ')}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-muted/5 flex flex-col items-center opacity-70">
                                    <span className="text-4xl mb-6 grayscale opacity-50">📂</span>
                                     <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest mb-2 italic">{t('associations.noActiveTraces')}</h4>
                                    <p className="text-[10px] text-muted-foreground max-w-xs mx-auto font-extrabold uppercase tracking-wider italic">
                                        {t('associations.noActiveTracesDesc')}
                                    </p>
                                    {isOwnerAdmin && (
                                        <button className="mt-8 px-6 py-2 border border-border/60 text-foreground text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-muted transition-all">
                                            {t('associations.authorizeNewProtocol')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Contributing Farmers - Privacy Locked */}
                    <div className="bg-card rounded-xl border border-border/60 overflow-hidden shadow-sm relative">
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center border border-border/40 rounded-xl m-2">
                            <span className="text-3xl mb-4 opacity-70">🔒</span>
                            <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-2 italic">{t('associations.secureRegistryProtocol')}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-sm italic leading-relaxed">
                                {t('associations.secureRegistryDesc')}
                            </p>
                        </div>
                        <div className="opacity-30 pointer-events-none filter blur-sm">
                            <div className="p-8 border-b border-border/60 bg-muted/20">
                                 <h3 className="text-xs font-extrabold text-foreground uppercase tracking-widest flex items-center gap-3 italic">
                                    <span className="text-xl">🏆</span> Leading Producer Nodes
                                </h3>
                            </div>
                            <div className="p-8 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-muted" />
                                            <div>
                                                <div className="w-24 h-3 bg-muted rounded mb-1" />
                                                <div className="w-16 h-2 bg-muted/50 rounded" />
                                            </div>
                                        </div>
                                        <div className="w-12 h-4 bg-muted rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-12">
                    {/* Admin Profile Card */}
                    <div className="bg-card p-10 rounded-xl border border-border/60 text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="w-24 h-24 bg-muted border border-border/60 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl relative shadow-inner group-hover:scale-105 transition-transform duration-500">
                            👤
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-card rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm">✓</div>
                        </div>
                        <h4 className="text-xl font-black text-foreground mb-1 uppercase italic">Admin {assoc.adminUserId.slice(0, 8)}</h4>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-8 opacity-60">{t('associations.operationalCommand')}</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-5 p-4 bg-muted/30 rounded-lg border border-border/40 hover:border-primary/20 transition-all text-left group/item shadow-sm">
                                <div className="w-10 h-10 bg-card rounded flex items-center justify-center text-xl border border-border/60 group-hover/item:text-primary transition-colors">📱</div>
                                 <div>
                                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50 italic">{t('associations.communications')}</p>
                                    <p className="font-extrabold text-sm text-foreground tracking-tight italic uppercase">{assoc.contactPhone || 'SECURE_CHANNEL'}</p>
                                </div>
                            </div>
                        </div>

                        {(!isOwnerAdmin) && (
                            <button className="w-full mt-8 h-12 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                {t('associations.establishConnection')}
                            </button>
                        )}
                    </div>

                    {/* Registry Meta Data */}
                    <div className="p-8 rounded-xl bg-foreground text-background shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 rounded-full -mr-16 -mt-16" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t('associations.systemRegistryMeta')}</h3>
                        <div className="space-y-6">
                            
                            {/* Regional Vector Data */}
                            <div className="flex items-center gap-5 p-4 bg-background/5 rounded-lg border border-background/10">
                                <span className="text-2xl opacity-60">📍</span>
                                <div>
                                    <p className="text-[10px] font-extrabold opacity-30 uppercase tracking-widest mb-1 italic">{t('associations.spatialCoordinates')}</p>
                                    <p className="font-extrabold text-xs uppercase tracking-tight italic opacity-90 leading-tight">
                                        {assoc.region} Region<br/>
                                        <span className="opacity-60 text-[10px]">{assoc.zone} ZONE, {assoc.woreda} WOREDA</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-4 bg-background/5 rounded-lg border border-background/10">
                                <span className="text-2xl opacity-60">📅</span>
                                 <div>
                                    <p className="text-[10px] font-extrabold opacity-30 uppercase tracking-widest mb-0.5 italic">{t('associations.commencement')}</p>
                                    <p className="font-extrabold text-lg uppercase tracking-tight italic">{new Date(assoc.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-4 bg-background/5 rounded-lg border border-background/10">
                                <span className="text-2xl opacity-60">🔐</span>
                                <div>
                                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-0.5">{t('associations.cryptographicHash')}</p>
                                    <p className="font-bold font-mono text-[10px] break-all opacity-80">{assoc.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

