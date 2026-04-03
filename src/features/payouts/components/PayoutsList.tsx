import React from 'react';
import { Badge } from '../../../shared/components/UI';
import { flexRender, type Table } from '@tanstack/react-table';
import type { Payout } from '../types/payout';

interface PayoutsListProps {
    table: Table<Payout>;
    navigate: any;
    userRole: string | undefined;
    isLoading: boolean;
}

export const PayoutsList: React.FC<PayoutsListProps> = ({
    table,
    navigate,
    userRole,
    isLoading
}) => {
    const rows = table.getRowModel().rows;

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">🏦</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No Transactions Found</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    The financial record is currently empty for the selected filter.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto relative">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    if (header.column.id === 'id') return <th key={header.id} className="px-6 py-4">Transaction ID</th>;
                                    if (header.column.id === 'farmerName' && userRole === 'farmer') return null;
                                    return (
                                        <th key={header.id} className="px-6 py-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    );
                                })}
                                {userRole !== 'farmer' && <th className="px-6 py-4">Producer</th>}
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => {
                            const payout = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                                    {row.getVisibleCells().map((cell) => {
                                        if (cell.column.id === 'id') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4 font-mono text-[11px] font-bold text-primary">
                                                    {payout.id.substring(0, 13)}...
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'amount') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4 text-sm font-extrabold text-emerald-500">
                                                    <span className="text-[11px] font-bold opacity-60 mr-1">ETB</span>{payout.amount.toLocaleString()}
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'status') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4">
                                                    <Badge
                                                        variant={payout.status === 'paid' ? 'success' : (payout.status === 'processing' ? 'primary' : 'warning')}
                                                    >
                                                        {payout.status}
                                                    </Badge>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'createdAt') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4 text-[11px] font-bold text-muted-foreground">
                                                    {payout.date || (payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A')}
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                    {userRole !== 'farmer' && (
                                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                                            {payout.farmerName}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{payout.paymentMethod === 'telebirr' ? '📱' : '🏦'}</span>
                                            <p className="text-[11px] font-bold text-muted-foreground capitalize">
                                                {payout.paymentMethod === 'telebirr' ? 'Telebirr' : 'CBE Bank'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate({ to: '/payouts/$id', params: { id: payout.id } } as any)}
                                            className="h-9 px-4 sm:h-10 sm:px-6 rounded-xl bg-primary text-white text-[10px] uppercase font-extrabold tracking-wider hover:brightness-110 shadow-lg shadow-primary/20 transition-all italic whitespace-nowrap"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {rows.map((row) => {
                    const payout = row.original;
                    return (
                        <div key={row.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="font-extrabold text-primary font-mono text-[10px] tracking-wider italic uppercase">TX: #{payout.id.substring(0, 8)}</p>
                                <Badge
                                    variant={payout.status === 'paid' ? 'success' : (payout.status === 'processing' ? 'primary' : 'warning')}
                                    className="text-[10px] font-extrabold uppercase h-6 px-3 tracking-wider italic rounded-full"
                                >
                                    {payout.status}
                                </Badge>
                            </div>

                            {userRole !== 'farmer' && (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-muted-foreground/40 uppercase tracking-widest italic mb-0.5">Producer</p>
                                        <p className="font-extrabold text-sm text-foreground uppercase italic tracking-tight">{payout.farmerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-muted-foreground/40 uppercase tracking-widest italic mb-0.5">Method</p>
                                        <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight flex items-center justify-end gap-1">
                                            <span>{payout.paymentMethod === 'telebirr' ? '📱' : '🏦'}</span>
                                            {payout.paymentMethod === 'telebirr' ? 'Telebirr' : 'Bank'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Amount Disbursed</p>
                                    <p className="font-extrabold text-lg text-emerald-500 italic tracking-tight">ETB {payout.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Ref Order</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight truncate">{payout.orderId}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground text-[10px] font-extrabold uppercase tracking-wider italic opacity-70">
                                    {payout.date || (payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A')}
                                </p>
                                <button
                                    onClick={() => navigate({ to: '/payouts/$id', params: { id: payout.id } } as any)}
                                    className="h-10 px-6 rounded-lg bg-primary text-white text-[10px] uppercase font-extrabold tracking-wider hover:brightness-110 shadow-lg shadow-primary/20 transition-all italic"
                                >
                                    Details →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
