import { useParams, useNavigate } from '@tanstack/react-router';
import { StatCard, Badge } from '../../../shared/components/UI';
import { SkeletonDetail } from '../../../shared/components/Skeletons';
import { useAuth } from '../../../lib/auth-context';
import { useAssociationDetail } from '../hooks/use-associations';
import { useAssociationAggregations } from '../../aggregations/hooks/use-aggregations';
import { useI18n } from '../../../lib/i18n-context';

export const AssociationDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useI18n();

    const { data: assoc, isLoading, error } = useAssociationDetail(id);
    const { data: recentAggregations = [] } = useAssociationAggregations(id as string);

    if (isLoading) {
        return (
            <div className="p-8">
                <SkeletonDetail />
            </div>
        );
    }

    if (error || !assoc) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
                <div className="w-16 h-16 bg-background-soft rounded-full flex items-center justify-center text-2xl mb-6">🔍</div>
                <h3 className="text-xl font-bold mb-2">{t('associations.notFound')}</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm">
                    {t('associations.notFoundDesc')}
                </p>
                <button
                    onClick={() => navigate({ to: '..' })}
                    className="h-10 px-6 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all"
                >
                    {t('associations.returnToDirectory')}
                </button>
            </div>
        );
    }

    const isPlatformAdmin = user?.role === 'platform_admin';
    const isOwnerAdmin = user?.role === 'association_admin' && user?.id === assoc.adminUserId;

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-background-soft border border-border shadow-minimal hover:bg-primary hover:text-white transition-all group active:scale-95"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
                    </button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{assoc.name}</h1>
                            <Badge variant="success" className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                                {t('associations.active')}
                            </Badge>
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest flex items-center gap-3 leading-none">
                            <span>{assoc.region} Branch</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>Registry Node since {new Date(assoc.createdAt).getFullYear()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {isPlatformAdmin && (
                        <>
                            <button className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest bg-background-soft border border-border rounded-xl shadow-minimal hover:bg-primary hover:text-white transition-all active:scale-95">
                                Audit Log
                            </button>
                            <button className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-xl shadow-minimal hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-95">
                                <span>✉️</span>
                                Broadcast
                            </button>
                        </>
                    )}
                    {isOwnerAdmin && (
                        <>
                            <button className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest bg-background-soft border border-border rounded-xl shadow-minimal hover:bg-primary hover:text-white transition-all active:scale-95">
                                Settings
                            </button>
                            <button className="h-11 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-xl shadow-minimal hover:bg-primary/90 transition-all active:scale-95">
                                New Collection
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title={t('associations.activeProducers')}
                    value={assoc.metrics?.totalFarmers || assoc.membershipCount || 0}
                    icon="👥"
                    description="Federated network"
                />
                <StatCard
                    title={t('associations.liveBatches')}
                    value={assoc.metrics?.activeAggregations || assoc.activeAggregationsCount || 0}
                    icon="🌾"
                    description="Operational cycles"
                />
                <StatCard
                    title={t('associations.aggregateVolume')}
                    value={`${(assoc.metrics?.totalVolumeKuntal || 0).toLocaleString()} qt`}
                    icon="📊"
                    description="Flow registered"
                />
                <StatCard
                    title={t('associations.entityValue')}
                    value={`ETB ${(assoc.metrics?.totalValueEtb || assoc.totalSales || 0).toLocaleString()}`}
                    icon="💰"
                    description="Value generated"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Protocol Feed */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="card-minimal overflow-hidden">
                        <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 leading-none">
                                Active Aggregations
                            </h3>
                            <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:opacity-75 transition-opacity">
                                Registry History
                            </button>
                        </div>

                        <div className="p-0">
                            {recentAggregations.length > 0 ? (
                                <div className="divide-y divide-border/30">
                                    {recentAggregations.map((agg) => (
                                        <div key={agg.id} className="px-10 py-5 hover:bg-background-soft transition-all group cursor-pointer flex items-center justify-between" onClick={() => navigate({ to: '/aggregations/$id', params: { id: agg.id } })}>
                                            <div className="flex items-center gap-10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Protocol ID</p>
                                                    <p className="font-bold text-[13px] tracking-widest text-primary mt-1">#{(agg.id as string).substring(0, 8)}</p>
                                                </div>
                                                <div className="space-y-1 hidden sm:block">
                                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Commodity</p>
                                                    <p className="font-bold text-[13px] text-foreground mt-1">{agg.cropTypeName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12">
                                                <div className="space-y-1.5 hidden md:block">
                                                    <div className="flex justify-between items-center mb-1 gap-20">
                                                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Fulfillment</span>
                                                        <span className="text-[10px] font-bold text-foreground tabular-nums leading-none">{Math.round(((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1 bg-background-soft rounded-full overflow-hidden border border-border/30 p-[0.5px]">
                                                        <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]" style={{ width: `${Math.min(100, ((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%` }} />
                                                    </div>
                                                </div>
                                                <Badge variant={agg.status === 'collecting' ? 'warning' : 'success'} className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest leading-none shrink-0 min-w-[100px] text-center flex justify-center">
                                                    {agg.status.replace(/_/g, ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center opacity-40">
                                    <span className="text-4xl mb-6 block">📂</span>
                                    <h4 className="text-sm font-bold uppercase tracking-widest mb-2">No Active Collections</h4>
                                    <p className="text-[10px] font-medium tracking-widest uppercase">Everything is up to date.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Information Security */}
                    <div className="card-minimal p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[280px] text-center">
                        <span className="text-3xl mb-4 relative z-10">🛡️</span>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2 relative z-10">Data Privacy</h4>
                        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest max-w-sm relative z-10 leading-relaxed">
                            Personal details of association members are protected and only accessible to authorized administrators.
                        </p>
                        <button className="mt-8 h-10 px-8 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all relative z-10">Request Access</button>
                    </div>
                </div>

                {/* Information Sidebar */}
                <div className="space-y-10">
                    <div className="card-minimal overflow-hidden">
                        <div className="p-10 space-y-10">
                            <div className="flex items-center gap-6 pb-8 border-b border-border/50">
                                <div className="w-16 h-16 bg-background-soft border border-border rounded-2xl flex items-center justify-center text-3xl shadow-minimal">
                                    🏢
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-xl leading-tight text-foreground">{assoc.name}</p>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80 leading-none mt-1">Admin Center</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Security Registry</p>
                                    <div className="flex items-center gap-4 p-5 bg-background-soft border border-border/50 rounded-2xl hover:border-primary/20 transition-all cursor-pointer group shadow-minimal">
                                        <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center text-sm group-hover:bg-primary group-hover:text-white transition-all shadow-minimal">📱</div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Phone Node</p>
                                            <p className="font-bold text-[13px] tracking-widest text-foreground mt-1">{assoc.contactPhone || 'No contact listed'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 pt-8 mt-8 border-t border-border/50">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Network Infrastructure</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Regional Zone</span>
                                            <span className="text-[11px] font-bold text-foreground text-right">{assoc.region}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Commission Date</span>
                                            <span className="text-[11px] font-bold text-foreground text-right">{new Date(assoc.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">Treasury (CBE)</span>
                                            <span className="text-[11px] font-bold text-foreground tracking-widest text-right">{assoc.cbeAccountNumber || 'NOT LINKED'}</span>
                                        </div>
                                        <div className="pt-6 space-y-2">
                                            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Protocol Signature</p>
                                            <p className="font-mono text-[9px] text-muted-foreground/40 break-all leading-tight">{assoc.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-minimal overflow-hidden">
                        <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">Registry Control</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 gap-4">
                            <button className="h-12 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest bg-background-soft hover:bg-primary hover:text-white transition-all active:scale-95 shadow-minimal">
                                Aggregation History
                            </button>
                            <button className="h-12 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest bg-background-soft hover:bg-primary hover:text-white transition-all active:scale-95 shadow-minimal">
                                Federated Members
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

