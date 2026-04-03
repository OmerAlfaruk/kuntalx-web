import React from 'react';
import { Badge } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import type { Aggregation } from '../types/aggregation';
import { useNavigate } from '@tanstack/react-router';
import { type Table } from '@tanstack/react-table';

interface MyAggregationsListProps {
    table: Table<Aggregation>;
    isLoading: boolean;
    t: (k: string) => string;
}

export const MyAggregationsList: React.FC<MyAggregationsListProps> = ({
    table,
    isLoading,
    t
}) => {
    const navigate = useNavigate();
    const rows = table.getRowModel().rows;

    if (isLoading) {
        return <SkeletonList rows={table.getState().pagination.pageSize} />;
    }

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="px-6 py-12 text-center text-muted-foreground italic uppercase text-xs font-extrabold opacity-40">
                {t('aggregations.noProtocols')}
            </div>
        );
    }

    return (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm animate-fade-in">
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border/60 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                <th className="px-8 py-5">{t('aggregations.protocolBatch')}</th>
                                <th className="px-8 py-5">{t('aggregations.commodity')}</th>
                                <th className="px-8 py-5">{t('aggregations.progress')}</th>
                                <th className="px-8 py-5 text-center">{t('common.status')}</th>
                                <th className="px-8 py-5 text-right">{t('common.actions')}</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => {
                            const pool = row.original;
                            return (
                                <tr key={row.id}
                                    onClick={() => navigate({ to: '/aggregations/$id', params: { id: pool.id } })}
                                    className="hover:bg-muted/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                {pool.cropTypeName?.[0] || 'P'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{pool.associationName}</p>
                                                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">ID: {pool.id.substring(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-foreground">{pool.cropTypeName}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{pool.qualityGrade || 'n/a'}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="space-y-2 max-w-[140px]">
                                            <div className="flex justify-between text-[11px] font-bold">
                                                <span className="text-muted-foreground">{pool.aggregationType === 'mini_association' ? pool.targetQuantityKuntal : pool.totalQuantityKuntal} / {pool.targetQuantityKuntal}</span>
                                                <span className="text-primary">{pool.aggregationType === 'mini_association' ? 100 : Math.round((pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${pool.aggregationType === 'mini_association' ? 100 : Math.min(100, (pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <Badge
                                            variant={(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status) === 'collecting' ? 'warning' : (pool.aggregationType === 'mini_association' || pool.status === 'ready_for_sale') ? 'success' : 'outline'}
                                        >
                                            {(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status).replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                                            {t('aggregations.openProtocol')} →
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border bg-card">
                {rows.map((row) => {
                    const pool = row.original;
                    return (
                        <div
                            key={row.id}
                            onClick={() => navigate({ to: '/aggregations/$id', params: { id: pool.id } })}
                            className="p-4 space-y-4 hover:bg-muted/5 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                        {pool.cropTypeName?.[0] || 'P'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{pool.cropTypeName}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{pool.qualityGrade || 'n/a'}</p>
                                    </div>
                                </div>
                                <Badge
                                    variant={(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status) === 'collecting' ? 'warning' : (pool.aggregationType === 'mini_association' || pool.status === 'ready_for_sale') ? 'success' : 'outline'}
                                >
                                    {(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status).replace(/_/g, ' ')}
                                </Badge>
                            </div>

                            <div className="bg-muted/10 p-3 rounded-xl border border-border/40 space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-muted-foreground/50">Regional Registry</p>
                                        <p className="text-sm font-bold text-foreground">{pool.associationName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-bold text-muted-foreground/50">Fill Rate</p>
                                        <p className="text-sm font-bold text-primary">{pool.aggregationType === 'mini_association' ? 100 : Math.round((pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100)}%</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between font-bold text-[11px] text-muted-foreground">
                                        <span>{pool.aggregationType === 'mini_association' ? pool.targetQuantityKuntal : pool.totalQuantityKuntal} qt</span>
                                        <span>Target: {pool.targetQuantityKuntal} qt</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${pool.aggregationType === 'mini_association' ? 100 : Math.min(100, (pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <span className="text-xs font-bold text-primary transition-all">
                                    Open Protocol →
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
