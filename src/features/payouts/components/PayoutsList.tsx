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
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    🏦
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">No Transactions Found</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    The financial ledger is currently clear for the active filters.
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
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border/50 bg-background-soft/50">
                                {headerGroup.headers.map((header) => {
                                    if (header.column.id === 'id') return <th key={header.id} className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transaction ID</th>;
                                    if (header.column.id === 'farmerName' && userRole === 'farmer') return null;
                                    return (
                                        <th key={header.id} className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    );
                                })}
                                {userRole !== 'farmer' && <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Producer</th>}
                                <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Method</th>
                                <th className="px-10 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row) => {
                            const payout = row.original;
                            return (
                                <tr key={row.id} 
                                    onClick={() => navigate({ to: '/payouts/$id', params: { id: payout.id } } as any)}
                                    className="hover:bg-background-soft transition-colors group cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        if (cell.column.id === 'id') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-primary tracking-widest text-[13px]">
                                                            #{payout.id.substring(0, 8).toUpperCase()}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">FINALIZED</span>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'amount') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <div className="text-[13px] font-bold text-emerald-600 tabular-nums">
                                                        ETB {payout.amount.toLocaleString()}
                                                    </div>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'status') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <Badge
                                                        variant={payout.status === 'paid' ? 'success' : (payout.status === 'processing' ? 'primary' : 'warning')}
                                                    >
                                                        {payout.status || 'pending'}
                                                    </Badge>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'createdAt') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <span className="text-[11px] font-bold text-muted-foreground/40">
                                                        {payout.date || (payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : 'N/A')}
                                                    </span>
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={cell.id} className="px-10 py-5 font-bold text-foreground text-[13px]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                    {userRole !== 'farmer' && (
                                        <td className="px-10 py-5">
                                             <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-[11px]">
                                                    {payout.farmerName?.[0].toUpperCase() || '⌬'}
                                                </div>
                                                <span className="font-bold text-foreground text-[13px]">
                                                    {payout.farmerName}
                                                </span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-10 py-5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg opacity-60">
                                                {payout.paymentMethod === 'telebirr' ? '📱' : '🏦'}
                                            </span>
                                            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                                                {payout.paymentMethod === 'telebirr' ? 'Mobile' : 'Bank'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-5 text-right">
                                        <button className="h-8 px-4 rounded-lg bg-background-soft border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
                {rows.map((row) => {
                    const payout = row.original;
                    return (
                        <div key={row.id} 
                            onClick={() => navigate({ to: '/payouts/$id', params: { id: payout.id } } as any)}
                            className="card-minimal p-6 group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between gap-4 mb-5">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-primary tracking-widest uppercase">TX Reference</p>
                                    <p className="text-[13px] font-bold text-foreground tracking-widest">#{payout.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                                <Badge
                                    variant={payout.status === 'paid' ? 'success' : (payout.status === 'processing' ? 'primary' : 'warning')}
                                >
                                    {payout.status || 'PENDING'}
                                </Badge>
                            </div>

                            {userRole !== 'farmer' && (
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-base shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        {payout.farmerName?.[0].toUpperCase() || '⌬'}
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Producer</p>
                                        <p className="font-bold text-[13px] text-foreground tracking-widest truncate">{payout.farmerName}</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-background-soft/50 p-5 rounded-xl border border-border/50 grid grid-cols-2 gap-6 mb-5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Amount</p>
                                    <p className="text-[13px] font-bold text-emerald-600 tabular-nums uppercase tracking-widest">ETB {payout.amount.toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Method</p>
                                    <p className="text-[11px] font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                                        <span className="opacity-50">{payout.paymentMethod === 'telebirr' ? '📱' : '🏦'}</span>
                                        {payout.paymentMethod === 'telebirr' ? 'Mobile' : 'Bank'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Registry Stable</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
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
