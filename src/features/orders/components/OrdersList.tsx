import React, { memo } from 'react';
import { Badge, TablePagination } from '../../../shared/components/UI';
import { flexRender, type Table } from '@tanstack/react-table';
import type { OrderStatus } from '../types/order';

interface OrdersListProps {
    table: Table<any>;
    isLoading: boolean;
    ordersCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    t: (k: string) => string;
    navigate: any;
    user: any;
    updateStatus: any;
}

const getStatusVariant = (status: OrderStatus): any => {
    switch (status) {
        case 'pending': return 'warning';
        case 'accepted': return 'primary';
        case 'in_transit': return 'primary';
        case 'delivered': return 'success';
        case 'cancelled': return 'error';
        case 'fulfilled': return 'success';
        default: return 'outline';
    }
};

export const OrdersList: React.FC<OrdersListProps> = memo(({
    table,
    isLoading,
    ordersCount,
    currentPage,
    totalPages,
    pageSize,
    t,
    navigate,
    user
}) => (
    <div className={`card-minimal overflow-hidden transition-all duration-500 ${isLoading ? 'opacity-70' : ''}`}>
        <div className="px-8 py-5 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
            <div>
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Registry</h2>
            </div>
            {isLoading && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20 animate-pulse">
                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none">Syncing</span>
                </div>
            )}
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id} className="border-b border-border/50 bg-background-soft/50">
                            {headerGroup.headers.map((header: any) => (
                                <th key={header.id} className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-border/30">
                    {table.getRowModel().rows.map((row: any) => (
                        <tr key={row.id} 
                            onClick={() => navigate({ to: '/orders/$id', params: { id: row.original.id } } as any)}
                            className="hover:bg-background-soft transition-colors cursor-pointer group"
                        >
                            {row.getVisibleCells().map((cell: any) => (
                                <td key={cell.id} className="px-8 py-6">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="md:hidden space-y-4 p-4">
            {table.getRowModel().rows.map((row: any) => {
                const order = row.original;
                return (
                    <div
                        key={row.id}
                        onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } } as any)}
                        className="card-minimal p-5 space-y-5 active:scale-[0.98] transition-all group relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[13px] font-bold text-primary tracking-widest uppercase block">
                                    #{order.id.substring(0, 8)}
                                </span>
                                <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Badge variant={getStatusVariant(order.status)}>
                                {order.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-base shadow-minimal shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                {order.aggregation?.cropTypeName?.[0] || '⌬'}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                                <p className="text-sm font-bold text-foreground truncate">
                                    {order.aggregation?.title || t('orders.unknownProduce')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[8px] h-4">
                                        {order.aggregation?.cropTypeName}
                                    </Badge>
                                    <p className="text-[10px] font-bold text-muted-foreground/30 truncate uppercase tracking-widest">
                                        {order.aggregation?.associationName || t('orders.regionalRegistry')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-soft/50 p-5 rounded-xl border border-border/50 grid grid-cols-2 gap-6">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Volume</p>
                                <p className="text-[11px] font-bold text-foreground tabular-nums">{order.requestedQuantityKuntal} <span className="text-[10px] text-muted-foreground/40 font-medium">QT</span></p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Valuation</p>
                                <p className="text-[11px] font-bold text-foreground tabular-nums">ETB {order.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 space-y-0.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Buyer</p>
                                <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-widest">{order.buyerName || (user?.role === 'buyer' ? user.fullName : 'Verified Partner')}</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Details</span>
                                <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {ordersCount === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    📑
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">{t('orders.noRecordsFound')}</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    {t('orders.noRecordsDesc')}
                </p>
            </div>
        )}

        <div className="border-t border-border/50">
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={ordersCount}
                pageSize={pageSize}
                onPageChange={(page: number) => table.setPageIndex(page - 1)}
            />
        </div>
    </div>
));
