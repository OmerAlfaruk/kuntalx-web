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
    user,
    updateStatus
}) => (
    <div className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 ${isLoading ? 'opacity-70 ring-1 ring-primary/20' : ''}`}>
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="text-lg font-extrabold text-foreground uppercase tracking-tight italic">{t('orders.activeRegistry')}</h2>
                    <p className="text-xs font-bold text-muted-foreground mt-0.5 uppercase opacity-60">{t('orders.verifiedProcurementFlow')}</p>
                </div>
                {isLoading && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <span className="text-[10px] font-black italic uppercase text-primary tracking-widest">{t('common.syncing')}</span>
                    </div>
                )}
            </div>
        </div>
        <div className="hidden md:block overflow-x-auto relative">
            <table className="w-full text-left border-collapse">
                <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header: any) => (
                                <th key={header.id} className="px-6 py-4">
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
                <tbody className="divide-y divide-border">
                    {table.getRowModel().rows.map((row: any) => (
                        <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                            {row.getVisibleCells().map((cell: any) => (
                                <td key={cell.id} className="px-6 py-4">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4 bg-muted/5">
            {table.getRowModel().rows.map((row: any) => {
                const order = row.original;
                return (
                    <div
                        key={row.id}
                        className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-bold text-primary block text-[11px] font-mono">
                                    #{order.id.substring(0, 8)}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-bold">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <Badge variant={getStatusVariant(order.status)}>
                                {order.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[11px] font-bold px-2 py-0.5 border-primary/20 text-primary shrink-0">
                                {order.aggregation?.cropTypeName}
                            </Badge>
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-foreground truncate">
                                    {order.aggregation?.title || t('orders.unknownProduce')}
                                </p>
                                <p className="text-[11px] font-bold text-muted-foreground truncate">
                                    {order.aggregation?.associationName || t('orders.regionalRegistry')}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                            <div>
                                <p className="text-[11px] font-bold text-muted-foreground/50 mb-0.5">Volume</p>
                                <p className="text-sm font-bold text-foreground">{order.requestedQuantityKuntal} qt</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-muted-foreground/50 mb-0.5">Valuation</p>
                                <p className="text-sm font-bold text-foreground">ETB {order.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold text-muted-foreground/50 mb-0.5">Buyer Detail</p>
                                <p className="text-sm font-bold text-foreground truncate">{order.buyerName || (user?.role === 'buyer' ? user.fullName : t('orders.verifiedPartner'))}</p>
                            </div>
                            <div className="flex shrink-0 gap-2">
                                {user?.role === 'buyer' && order.status === 'pending' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(t('orders.cancelConfirm'))) {
                                                updateStatus({ id: order.id, status: 'cancelled' });
                                            }
                                        }}
                                        className="h-9 px-3 rounded-lg border border-rose-500/20 text-rose-500 text-xs font-bold"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } } as any)}
                                    className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold"
                                >
                                    Details →
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {ordersCount === 0 && (
            <div className="py-24 text-center space-y-4">
                <div className="text-4xl">📑</div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">{t('orders.noRecordsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('orders.noRecordsDesc')}</p>
                </div>
            </div>
        )}

        <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={ordersCount}
            pageSize={pageSize}
            onPageChange={(page: number) => table.setPageIndex(page - 1)}
        />
    </div>
));
