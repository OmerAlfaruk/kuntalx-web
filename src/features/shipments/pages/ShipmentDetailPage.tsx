import { useParams, useNavigate } from '@tanstack/react-router';

import { SkeletonDetail } from '../../../shared/components/Skeletons';
import { useShipmentTracking } from '../hooks/use-shipments';
import { TrackingMap } from '../components/TrackingMap';

const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).toUpperCase();
};

export const ShipmentDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();

    const { data: shipment, isLoading } = useShipmentTracking(id as string);

    if (isLoading) {
        return (
            <div className="p-8">
                <SkeletonDetail />
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in text-center">
                <div className="w-16 h-16 bg-background-soft rounded-full flex items-center justify-center text-2xl mb-6">📡</div>
                <h2 className="text-xl font-bold mb-2">Tracking connection lost</h2>
                <p className="text-sm text-muted-foreground mb-8">The requested shipment unit could not be synchronized.</p>
                <button
                    onClick={() => navigate({ to: '/shipments' })}
                    className="h-10 px-6 border border-border rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all"
                >
                    Back to Fleet
                </button>
            </div>
        );
    }



    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate({ to: '/shipments' })}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border shadow-minimal hover:bg-background-soft transition-all"
                    >
                        ←
                    </button>
                    <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {shipment.vehicles?.[0]?.vehicleNumber || `Shipment ${shipment.id.slice(0, 8).toUpperCase()}`}
                            </h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                {shipment.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground/60 font-medium">
                            Shipment ID: {shipment.id.slice(0, 16).toUpperCase()} • Tracking Active
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 no-print">
                    <button className="h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-card border border-border rounded-lg hover:bg-background-soft transition-all flex items-center gap-2">
                        Refresh Tracking
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content - Tracking Timeline */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="card-minimal p-8 space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transit Timeline</h3>
                        </div>

                        {shipment.status === 'in_transit' && (
                            <div className="overflow-hidden rounded-2xl border border-border shadow-minimal">
                                <TrackingMap shipment={shipment} />
                            </div>
                        )}

                        {shipment.timeline.length > 0 ? (
                            <div className="space-y-0 relative">
                                {shipment.timeline.map((checkpoint, index) => {
                                    const isCompleted = checkpoint.isCompleted;
                                    const isNext = index === shipment.timeline.findIndex(t => !t.isCompleted);
                                    const isLast = index === shipment.timeline.length - 1;

                                    return (
                                        <div key={index} className="relative flex gap-8 pb-10 last:pb-0 text-left">
                                            {!isLast && (
                                                <div className={`absolute left-[7px] top-6 bottom-4 w-px ${isCompleted ? 'bg-primary' : 'bg-border/40 border-dashed'}`}></div>
                                            )}

                                            <div className={`relative z-10 w-4 h-4 rounded-full border-2 bg-background mt-1 transition-all ${isCompleted
                                                ? 'border-primary bg-primary'
                                                : isNext
                                                    ? 'border-primary'
                                                    : 'border-border'
                                                }`}>
                                            </div>

                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <h4 className={`text-[10px] font-bold uppercase tracking-widest ${!isCompleted && !isNext ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                                                        {checkpoint.label}
                                                    </h4>
                                                    {checkpoint.timestamp && (
                                                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                                            {formatDate(checkpoint.timestamp)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                                    {checkpoint.description || 'Pending update.'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center bg-background-soft/50 rounded-2xl border border-dashed border-border/60">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">No tracking data available.</p>
                            </div>
                        )}
                    </section>

                    {/* Logistics Reference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card-minimal p-6 flex items-center gap-6 text-left">
                            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center text-xl shadow-minimal-subtle">📦</div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Order Reference</p>
                                <p className="text-xs font-mono font-bold text-foreground truncate">{shipment.orderId.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="card-minimal p-6 flex items-center gap-6 text-left">
                            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center text-xl shadow-minimal-subtle">🏭</div>
                            <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Origin</p>
                                <p className="text-xs font-mono font-bold text-foreground truncate">{shipment.aggregationId?.toUpperCase() || 'SYSTEM'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Vehicle & Route Info */}
                <div className="space-y-6 sm:space-y-8 text-left">
                    {/* Vehicle Info */}
                    <section className="card-minimal p-6 overflow-hidden relative">
                        <div className="relative">
                            <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 uppercase tracking-widest">
                                Vehicle Details
                            </h3>

                            {shipment.vehicles && shipment.vehicles.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-background-soft border border-border/50 rounded-xl flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">🚛</div>
                                            <div>
                                                <p className="text-lg font-bold text-foreground uppercase tracking-tight">{shipment.vehicles[0].vehicleNumber}</p>
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Active Service</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b border-border/40">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Driver</span>
                                                <span className="text-xs font-bold text-foreground uppercase tracking-tight">{shipment.vehicles[0].driverName || 'Verified'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-border/40">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Capacity</span>
                                                <span className="text-xs font-bold text-foreground">{shipment.vehicles[0].capacityKuntal || 100} KNTL</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Phone</span>
                                                <span className="text-xs font-bold text-foreground tabular-nums">{shipment.vehicles[0].driverPhone || '--'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full h-11 rounded-lg border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 transition-all">
                                        Contact Driver
                                    </button>
                                </div>
                            ) : (
                                <div className="py-12 text-center border border-dashed border-border rounded-xl">
                                    <p className="text-xs text-muted-foreground">No vehicle assigned.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Route Details */}
                    <section className="card-minimal p-6">
                        <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest">Route Info</h3>

                        <div className="space-y-8 relative">
                            <div className="absolute left-[7px] top-6 bottom-4 w-px bg-border/40"></div>

                            <div className="relative flex gap-4">
                                <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 relative z-10 mt-1"></div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Origin</p>
                                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Regional Hub</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Center #12</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4">
                                <div className="w-4 h-4 rounded-full bg-primary/10 border-2 border-primary relative z-10 mt-1"></div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Destination</p>
                                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Intake Terminal</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Facility</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border/40 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Lead Time</p>
                                <p className="text-sm font-bold text-foreground uppercase">4.8 Hours</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Reliability</p>
                                <p className="text-sm font-bold text-emerald-600">99.2%</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

