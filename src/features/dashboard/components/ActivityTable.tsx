import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Badge } from '../../../shared/components/UI';
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
        <GlassCard className="p-0 overflow-hidden flex flex-col animate-fade-in">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex flex-wrap justify-between items-center gap-3 bg-muted/30">
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{t('dashboard.regionalActivity')}</h3>
                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{t('dashboard.regionalActivityDesc')}</p>
                </div>
                {onExport && (
                    <button
                        onClick={onExport}
                        className="h-9 sm:h-10 px-4 sm:px-6 rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        <span className="hidden sm:inline">{t('dashboard.exportReport')}</span>
                        <span className="sm:hidden">EXPORT</span>
                    </button>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto flex-1">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t('dashboard.associationName')}</th>
                            <th className="px-6 py-4">{t('dashboard.region')}</th>
                            <th className="px-6 py-4">{t('dashboard.volume')}</th>
                            <th className="px-6 py-4 text-right">{t('common.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {(data || []).map((row, i) => (
                            <motion.tr 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="hover:bg-muted/5 transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold shadow-sm transition-all text-sm shrink-0 group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                                            {row.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-foreground">{row.name}</p>
                                            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">HUB ID: {row.hubId.substring(0, 12)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-bold text-sm text-foreground">{row.region}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground/60">FEDERATED_REGION</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <p className="font-bold text-foreground text-sm tabular-nums">{row.volume.toLocaleString()} <span className="text-[11px] text-muted-foreground font-bold">qt</span></p>
                                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden border border-border/5">
                                            <div
                                                className="bg-primary h-full rounded-full opacity-60"
                                                style={{ width: `${Math.min(100, (row.volume / 1000) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
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
            <div className="md:hidden divide-y divide-border">
                {(data || []).map((row, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="p-4 space-y-3 hover:bg-muted/5 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-sm">
                                    {row.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-sm text-foreground truncate">{row.name}</p>
                                    <p className="text-[10px] font-extrabold text-muted-foreground/60 truncate uppercase tracking-wider">{row.region}</p>
                                </div>
                            </div>
                            <Badge variant={row.status === 'ready_for_sale' ? 'success' : row.status === 'collecting' ? 'primary' : 'warning'} className="capitalize shrink-0">
                                {row.status.replace(/_/g, ' ')}
                            </Badge>
                        </div>

                        <div className="flex items-end justify-between bg-muted/20 backdrop-blur-sm p-3 rounded-xl border border-border/40 shadow-inner">
                            <div className="space-y-1 flex-1">
                                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest leading-none mb-1.5">Activity Volume</p>
                                <p className="font-bold text-sm tabular-nums text-foreground leading-none">
                                    {row.volume.toLocaleString()} <span className="text-[10px] text-muted-foreground/60 font-black italic ml-1">QT</span>
                                </p>
                                <div className="w-full h-1 bg-muted/40 rounded-full overflow-hidden mt-3 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (row.volume / 1000) * 100)}%` }}
                                        transition={{ duration: 1, delay: (i * 0.05) + 0.3 }}
                                        className="bg-primary h-full rounded-full opacity-80 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {(!data || data.length === 0) && (
                <div className="px-6 py-12 text-center text-sm font-bold text-muted-foreground">
                    {t('dashboard.noActivity')}
                </div>
            )}
        </GlassCard>
    );
};
