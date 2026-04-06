import React from 'react';
import { Badge } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import type { Aggregation } from '../types/aggregation';
import { useNavigate } from '@tanstack/react-router';
import { type Table } from '@tanstack/react-table';
import { motion } from 'framer-motion';

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
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    ⌬
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">{t('aggregations.noProtocols')}</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    No active aggregation protocols found in the registry.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 bg-background-soft/50">
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('aggregations.protocolBatch')}</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('aggregations.commodity')}</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('aggregations.progress')}</th>
                            <th className="px-8 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('common.status')}</th>
                            <th className="px-8 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row, i) => {
                            const pool = row.original;
                            const fillRate = pool.aggregationType === 'mini_association' ? 100 : Math.round((pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100);
                            return (
                                <tr key={row.id}
                                    onClick={() => navigate({ to: '/aggregations/$id', params: { id: pool.id } })}
                                    className="hover:bg-background-soft transition-colors cursor-pointer group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold shadow-minimal transition-all text-sm shrink-0 group-hover:bg-primary group-hover:text-white">
                                                {pool.cropTypeName?.[0] || '⌬'}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-bold text-foreground">{pool.associationName}</p>
                                                <p className="text-[10px] font-bold text-primary tracking-widest uppercase">#{pool.id.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{pool.cropTypeName}</p>
                                            <Badge variant="gold" className="text-[9px] py-0">{pool.qualityGrade || 'STANDARD'}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-2 max-w-[160px]">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-muted-foreground/40 italic">{pool.aggregationType === 'mini_association' ? pool.targetQuantityKuntal : pool.totalQuantityKuntal} / {pool.targetQuantityKuntal} qt</span>
                                                <span className="text-primary">{fillRate}%</span>
                                            </div>
                                            <div className="h-1 bg-background-soft rounded-full overflow-hidden border border-border/50">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fillRate}%` }}
                                                    transition={{ duration: 1, delay: (i * 0.1) + 0.3 }}
                                                    className="h-full bg-primary rounded-full shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <Badge
                                            variant={(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status) === 'collecting' ? 'warning' : (pool.aggregationType === 'mini_association' || pool.status === 'ready_for_sale') ? 'success' : 'outline'}
                                        >
                                            {(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status).replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-5 text-right">
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
            <div className="md:hidden divide-y divide-border/30 bg-transparent">
                {rows.map((row) => {
                    const pool = row.original;
                    const fillRate = pool.aggregationType === 'mini_association' ? 100 : Math.round((pool.totalQuantityKuntal / pool.targetQuantityKuntal) * 100);
                    return (
                        <div
                            key={row.id}
                            onClick={() => navigate({ to: '/aggregations/$id', params: { id: pool.id } })}
                            className="p-6 space-y-5 hover:bg-background-soft transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-base shadow-minimal group-hover:bg-primary group-hover:text-white transition-all">
                                        {pool.cropTypeName?.[0] || '⌬'}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[13px] font-bold text-foreground tracking-tight">{pool.cropTypeName}</p>
                                        <Badge variant="gold" className="text-[8px] py-0">{pool.qualityGrade || 'STANDARD'}</Badge>
                                    </div>
                                </div>
                                <Badge
                                    variant={(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status) === 'collecting' ? 'warning' : (pool.aggregationType === 'mini_association' || pool.status === 'ready_for_sale') ? 'success' : 'outline'}
                                >
                                    {(pool.aggregationType === 'mini_association' ? 'ready_for_sale' : pool.status).replace(/_/g, ' ')}
                                </Badge>
                            </div>

                            <div className="bg-background-soft/50 p-5 rounded-xl border border-border/50 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Regional Origin</p>
                                        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest">{pool.associationName}</p>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Fill Rate</p>
                                        <p className="text-[11px] font-bold text-primary tracking-widest">{fillRate}%</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between font-bold text-[9px] text-muted-foreground/40 uppercase tracking-widest italic">
                                        <span>{pool.aggregationType === 'mini_association' ? pool.targetQuantityKuntal : pool.totalQuantityKuntal} qt</span>
                                        <span>Target: {pool.targetQuantityKuntal} qt</span>
                                    </div>
                                    <div className="h-1 bg-background rounded-full overflow-hidden border border-border/50">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${fillRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Examine Protocol</span>
                                <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
