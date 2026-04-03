import { useParams, useNavigate } from '@tanstack/react-router';
import { StatCard } from '../../../shared/components/UI';
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border shadow-minimal hover:bg-background-soft transition-all"
                    >
                        ←
                    </button>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{assoc.name}</h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {t('associations.active')}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-medium flex items-center gap-3">
                            <span>{assoc.region} Branch</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span>Member since {new Date(assoc.createdAt).getFullYear()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {isPlatformAdmin && (
                        <>
                            <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-border rounded-lg shadow-minimal hover:bg-background-soft transition-all">
                                Compliance Review
                            </button>
                            <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg shadow-minimal hover:bg-primary/90 transition-all flex items-center gap-2">
                                Broadcast Message
                            </button>
                        </>
                    )}
                    {isOwnerAdmin && (
                        <>
                            <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-border rounded-lg shadow-minimal hover:bg-background-soft transition-all">
                                Admin Interface
                            </button>
                            <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg shadow-minimal hover:bg-primary/90 transition-all">
                                Start Aggregation
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
                        <div className="p-8 border-b border-border/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🚜</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                                    Active Aggregations
                                </h3>
                            </div>
                            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-75 transition-opacity">
                                View History
                            </button>
                        </div>

                        <div className="p-0">
                            {recentAggregations.length > 0 ? (
                                <div className="divide-y divide-border/30">
                                    {recentAggregations.map((agg) => (
                                        <div key={agg.id} className="p-6 hover:bg-background-soft transition-all group cursor-pointer flex items-center justify-between" onClick={() => navigate({ to: '/aggregations/$id', params: { id: agg.id } })}>
                                            <div className="flex items-center gap-6">
                                                <div className="w-10 h-10 bg-background-soft rounded-lg flex items-center justify-center text-lg group-hover:bg-primary/10 group-hover:text-primary transition-all">📦</div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">ID</p>
                                                    <p className="font-bold text-sm tracking-widest">#{(agg.id as string).substring(0, 8)}</p>
                                                </div>
                                                <div className="space-y-1 hidden sm:block border-l border-border/50 pl-6">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Commodity</p>
                                                    <p className="font-bold text-sm">{agg.cropTypeName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="space-y-1 hidden md:block">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Progress</span>
                                                        <span className="text-[10px] font-bold text-foreground">{Math.round(((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1 w-24 bg-background-soft rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, ((agg.totalQuantityKuntal || 0) / (agg.targetQuantityKuntal || 1)) * 100)}%` }} />
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${agg.status === 'collecting' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                                                    {agg.status.replace(/_/g, ' ')}
                                                </span>
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
                    <div className="card-minimal p-8 space-y-8">
                        <div className="flex items-center gap-5 pb-6 border-b border-border/50">
                            <div className="w-14 h-14 bg-background-soft border border-border rounded-full flex items-center justify-center text-2xl shadow-minimal">
                                🏢
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-lg leading-tight">{assoc.name}</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80">Admin Center</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Contact Information</p>
                                <div className="flex items-center gap-4 p-4 bg-background border border-border/50 rounded-xl hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="w-8 h-8 bg-background-soft rounded-lg flex items-center justify-center text-sm group-hover:bg-primary/10 group-hover:text-primary transition-all">📱</div>
                                    <p className="font-bold text-sm tracking-widest">{assoc.contactPhone || 'No phone listed'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">System Registry</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground/60 font-medium">Regional Point</span>
                                        <span className="font-bold">{assoc.region}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground/60 font-medium">Node Registry</span>
                                        <span className="font-bold">{new Date(assoc.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-2">
                                        <span className="text-muted-foreground/60 font-medium tracking-tight whitespace-nowrap">Bank Account (CBE)</span>
                                        <span className="font-bold tracking-widest">{assoc.cbeAccountNumber || 'NOT LINKED'}</span>
                                    </div>
                                    <div className="pt-4 space-y-1.5 overflow-hidden">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">System Hash</p>
                                        <p className="font-mono text-[9px] text-muted-foreground/40 break-all">{assoc.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-minimal p-6 bg-primary/[0.02] border-primary/10">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">Management</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="h-11 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-background-soft transition-all">
                                Aggregation History
                            </button>
                            <button className="h-11 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-background-soft transition-all">
                                Member List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

