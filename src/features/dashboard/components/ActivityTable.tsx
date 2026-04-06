import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../../shared/components/UI';
import { type RegionalActivity } from '../hooks/use-dashboard-data';
import { SkeletonList } from '../../../shared/components/Skeletons';

interface ActivityTableProps {
    data?: RegionalActivity[];
    isLoading?: boolean;
    onExport?: () => void;
    t: (k: string) => string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ data, isLoading, onExport, t }) => {
    if (isLoading) return <SkeletonList />;

    return (
        <div className="card-minimal overflow-hidden flex flex-col p-0">
            <div className="px-8 py-6 border-b border-border/50 flex flex-wrap justify-between items-center gap-4 bg-background-soft/50">
                <div className="space-y-1">
                    <h3 className="text-[14px] font-bold text-foreground">{t('dashboard.regionalActivity')}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {t('dashboard.regionalActivityDesc')}
                    </p>
                </div>
                {onExport && (
                    <button
                        onClick={onExport}
                        className="h-10 px-6 rounded-xl bg-background border border-border hover:bg-background-soft transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-minimal"
                    >
                        <span>⊞</span>
                        <span className="hidden sm:inline">{t('dashboard.exportReport')}</span>
                        <span className="sm:hidden">EXP</span>
                    </button>
                )}
            </div>

            <div className="hidden md:block overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-background-soft/50 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">{t('dashboard.associationName')}</th>
                            <th className="px-8 py-5">{t('dashboard.region')}</th>
                            <th className="px-8 py-5">{t('dashboard.volume')}</th>
                            <th className="px-8 py-5 text-right">{t('common.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {(data || []).map((row, i) => (
                            <motion.tr 
                                key={i} 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="hover:bg-background-soft/50 transition-colors group"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                            {row.name[0]}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-[13px] text-foreground">{row.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">#{row.hubId.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 flex flex-col justify-center">
                                    <p className="font-bold text-[13px] text-foreground">{row.region}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-[13px] text-foreground tabular-nums">
                                            {row.volume.toLocaleString()} <span className="text-[10px] text-muted-foreground/60 ml-1">QT</span>
                                        </p>
                                        <div className="w-24 h-1.5 bg-background-soft rounded-full overflow-hidden border border-border/50">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (row.volume / 1000) * 100)}%` }}
                                                transition={{ duration: 0.8, delay: (i * 0.1) + 0.2 }}
                                                className="bg-primary h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <Badge variant={row.status === 'ready_for_sale' ? 'success' : row.status === 'collecting' ? 'primary' : 'warning'} className="capitalize">
                                        {row.status.replace(/_/g, ' ')}
                                    </Badge>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Activity Card View */}
            <div className="md:hidden divide-y divide-border/30">
                {(data || []).map((row, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="p-5 space-y-4 hover:bg-background-soft/50 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                    {row.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-[13px] text-foreground truncate">{row.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 truncate uppercase tracking-widest mt-0.5">{row.region}</p>
                                </div>
                            </div>
                            <Badge variant={row.status === 'ready_for_sale' ? 'success' : row.status === 'collecting' ? 'primary' : 'warning'} className="capitalize shrink-0">
                                {row.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>

                        <div className="bg-background-soft p-4 rounded-xl border border-border/50">
                            <div className="space-y-1.5 flex-1">
                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Recorded Volume</p>
                                <p className="font-bold text-[14px] tabular-nums text-foreground">
                                    {row.volume.toLocaleString()} <span className="text-[10px] text-muted-foreground/60 font-bold ml-1">QT</span>
                                </p>
                                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mt-3 border border-border/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (row.volume / 1000) * 100)}%` }}
                                        transition={{ duration: 0.8, delay: (i * 0.05) + 0.2 }}
                                        className="bg-primary h-full rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {(!data || data.length === 0) && (
                <div className="px-6 py-16 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {t('dashboard.noActivity')}
                </div>
            )}
        </div>
    );
};
