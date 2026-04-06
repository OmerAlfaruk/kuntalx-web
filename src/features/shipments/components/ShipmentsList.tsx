import React from 'react';
import { Badge, AdaptiveDate } from '../../../shared/components/UI';
import type { Shipment } from '../types/shipment';
import { type Table } from '@tanstack/react-table';

interface ShipmentsListProps {
    table: Table<Shipment>;
    isLoading: boolean;
    navigate: any;
}

export const ShipmentsList: React.FC<ShipmentsListProps> = ({
    table,
    isLoading,
    navigate
}) => {
    const rows = table.getRowModel().rows;

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    🚚
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">No Shipments Found</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    Logistics streams are currently idle. Active transit protocols will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 bg-background-soft/50">
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shipment Ref</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order Attachment</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ETA Window</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row) => {
                            const shipment = row.original;
                            return (
                                <tr key={row.id} 
                                    onClick={() => navigate({ to: '/shipments/$id', params: { id: shipment.id } } as any)}
                                    className="hover:bg-background-soft transition-colors group cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <p className="text-[13px] font-bold text-primary tracking-widest uppercase">#{shipment.id.substring(0, 8)}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">{shipment.transportProvider || 'Internal Fleet'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-foreground tracking-wide uppercase">Order {shipment.orderId.substring(0, 8)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-foreground tabular-nums">
                                            {shipment.expectedArrivalDate ? (
                                                <AdaptiveDate date={shipment.expectedArrivalDate} />
                                            ) : (
                                                <span className="text-[10px] opacity-20 tracking-widest uppercase">Awaiting Data</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={shipment.status === 'delivered' ? 'success' :
                                            shipment.status === 'in_transit' ? 'primary' :
                                                'warning'
                                        }>
                                            {shipment.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Detail</span>
                                            <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
                {rows.map((row) => {
                    const shipment = row.original;
                    return (
                        <div key={row.id} 
                            className="card-minimal p-5 space-y-5 active:scale-[0.98] transition-all group cursor-pointer" 
                            onClick={() => navigate({ to: '/shipments/$id', params: { id: shipment.id } } as any)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-bold text-primary tracking-widest uppercase">#{shipment.id.substring(0, 8)}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{shipment.transportProvider || 'Internal Fleet'}</p>
                                </div>
                                <Badge variant={shipment.status === 'delivered' ? 'success' : (shipment.status === 'in_transit' ? 'primary' : 'warning')}>
                                    {shipment.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            
                            <div className="bg-background-soft/50 p-5 rounded-xl border border-border/50 grid grid-cols-2 gap-6">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Order Ref</p>
                                    <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-widest">Order {shipment.orderId.substring(0, 8)}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">ETA Window</p>
                                    <p className="text-[11px] font-bold text-foreground tabular-nums">
                                        {shipment.expectedArrivalDate ? new Date(shipment.expectedArrivalDate).toLocaleDateString() : '—'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Tracking Live</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Detail</span>
                                    <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
