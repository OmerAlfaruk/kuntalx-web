import { useParams, useNavigate } from '@tanstack/react-router';
import { StatCard } from '../../../shared/components/UI';
import { SkeletonDetail } from '../../../shared/components/Skeletons';
import { useFarmerDetail } from '../hooks/use-farmers';

export const FarmerDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { data: farmer, isLoading } = useFarmerDetail(id);

    if (isLoading) {
        return <SkeletonDetail />;
    }

    if (!farmer) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                <div className="w-16 h-16 bg-background-soft rounded-full flex items-center justify-center text-2xl mb-6">🔍</div>
                <h3 className="text-xl font-bold mb-2">Profile not identified</h3>
                <p className="text-sm text-muted-foreground mb-8">The requested farmer record could not be synchronized.</p>
                <button
                    onClick={() => navigate({ to: '..' })}
                    className="h-10 px-6 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all"
                >
                    Back to Farmers
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
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
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {farmer.name}
                            </h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {farmer.status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                            Terminal ID: {id || farmer.id} — Associated since {new Date(farmer.joinDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-border rounded-lg shadow-minimal hover:bg-background-soft transition-all">Verify Registry</button>
                    <button className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-lg shadow-minimal hover:bg-primary/90 transition-all">Direct Contact</button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Land Resource"
                    value={`${farmer.farmSize} ha`}
                    icon="🌾"
                    description="Total land area"
                />
                <StatCard
                    title="Yield Capacity"
                    value={`${farmer.capacity} kuntal`}
                    icon="📦"
                    description="Estimated aggregate"
                />
                <StatCard
                    title="Deliveries"
                    value="12"
                    icon="🚚"
                    description="Total shipments"
                />
                <StatCard
                    title="Efficiency"
                    value="98%"
                    icon="⚡"
                    description="Quality score"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Information Hub */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="card-minimal p-8 space-y-8">
                        <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌱</span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Farm Profile</h3>
                            </div>
                            <p className="text-xs text-muted-foreground/60 font-medium leading-relaxed">Detailed operational resources and production capacity of the producer terminal.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-background-soft/50 border border-border/50 p-6 rounded-xl space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Production Area</p>
                                <p className="font-bold text-xl">{farmer.farmSize} Hectares</p>
                            </div>
                            <div className="bg-background-soft/50 border border-border/50 p-6 rounded-xl space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Aggregate Capacity</p>
                                <p className="font-bold text-xl">{farmer.capacity} Kuntal</p>
                            </div>
                        </div>

                        <div className="pt-6 space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Cultivation Zones</h4>
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                                {['Zone A-2', 'Highland Sector', 'Riverside Basin'].map((zone) => (
                                    <span key={zone} className="px-4 py-2 bg-background border border-border rounded-lg text-muted-foreground">{zone}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card-minimal p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Activity History</h3>
                            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-75 transition-opacity">Full Archive</button>
                        </div>
                        <div className="space-y-0 text-xs">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="py-4 border-b border-border/30 last:border-0 flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-background-soft rounded-lg flex items-center justify-center text-sm group-hover:bg-primary/10 group-hover:text-primary transition-all">📦</div>
                                        <div>
                                            <p className="font-bold">Shipment #DEL-203{i}</p>
                                            <p className="text-muted-foreground/60">Delivered 12.5 Kuntal — Coffee</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">Oct {10 + i}, 2026</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="card-minimal p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                                {farmer.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-none mb-1">{farmer.name}</p>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest opacity-80">{farmer.status}</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-border/50">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Security Registry</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-lg">
                                        <span className="text-lg">📱</span>
                                        <p className="font-bold text-sm tracking-widest">{farmer.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-lg">
                                        <span className="text-lg">🏦</span>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Bank Account (CBE)</p>
                                            <p className="font-bold text-sm tracking-widest">{farmer.cbeAccountNumber || 'NOT LINKED'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Operational Node</p>
                                <div className="p-4 bg-background border border-border/50 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground/60 font-medium">Region</span>
                                        <span className="font-bold">{farmer.region}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground/60 font-medium">Woreda</span>
                                        <span className="font-bold">{farmer.woreda}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-minimal p-6 border-primary/10 bg-primary/[0.02]">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">Terminal Operations</h3>
                        <div className="space-y-3">
                            <button className="w-full h-11 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all">📧 Initiate Channel</button>
                            <button className="w-full h-11 bg-background border border-border rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-background-soft transition-all">📊 Load Analytics</button>
                            <button className="w-full h-11 bg-background border border-border rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-background-soft transition-all text-rose-500 border-rose-100 bg-rose-50/10">⛔ Suspension Registry</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

