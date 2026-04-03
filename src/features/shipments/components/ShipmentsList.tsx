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
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">🚢</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No shipments detected</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    The logistical pipeline is currently clear. Active transit protocols will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="card-minimal overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Shipment Ref</th>
                            <th className="px-6 py-4">Order Attachment</th>
                            <th className="px-6 py-4">ETA</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => {
                            const shipment = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-muted/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-[11px] font-bold text-primary italic uppercase tracking-wider">#{shipment.id.substring(0, 8)}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tight">{shipment.transportProvider || 'Internal Fleet'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-foreground">Order: {shipment.orderId.substring(0, 8)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-foreground">
                                            {shipment.expectedArrivalDate ? (
                                                <AdaptiveDate date={shipment.expectedArrivalDate} />
                                            ) : (
                                                'AWAITING INFO'
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={shipment.status === 'delivered' ? 'success' :
                                            shipment.status === 'in_transit' ? 'primary' :
                                                'warning'
                                        } className="text-[10px] font-bold px-3 py-1 rounded-full capitalize">
                                            {shipment.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate({ to: '/shipments/$id', params: { id: shipment.id } } as any)}
                                            className="h-10 px-6 rounded-lg bg-primary text-white text-[10px] font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                        >
                                            View Details →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-border bg-muted/5">
                {rows.map((row) => {
                    const shipment = row.original;
                    return (
                        <div key={row.id} className="p-4 space-y-4 hover:bg-muted/5 transition-colors" onClick={() => navigate({ to: '/shipments/$id', params: { id: shipment.id } } as any)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-mono text-[11px] font-bold text-primary italic uppercase tracking-wider">#{shipment.id.substring(0, 8)}</p>
                                    <p className="text-[11px] font-bold text-foreground mt-1">{shipment.transportProvider || 'Internal Fleet'}</p>
                                </div>
                                <Badge variant={shipment.status === 'delivered' ? 'success' : (shipment.status === 'in_transit' ? 'primary' : 'warning')} className="text-[9px] font-bold">
                                    {shipment.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 p-3 bg-card rounded-xl border border-border/40">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">Order Ref</p>
                                    <p className="text-[11px] font-bold text-foreground truncate">{shipment.orderId.substring(0, 8)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">ETA</p>
                                    <p className="text-[11px] font-bold text-foreground">
                                        {shipment.expectedArrivalDate ? new Date(shipment.expectedArrivalDate).toLocaleDateString() : 'TBD'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
