import { useParams, useNavigate } from '@tanstack/react-router';
import { Badge } from '../../../shared/components/UI';
import { SkeletonDetail } from '../../../shared/components/Skeletons';
import { usePayoutDetail, useUpdatePayoutStatus } from '../hooks/use-payouts';
import { useAuth } from '../../../lib/auth-context';
import { generatePayoutPDF } from '../utils/payout-pdf-generator';

/**
 * PayoutDetailPage - Bespoke Financial Statement Edition
 * A masterclass in clean, professional financial UI.
 * Focuses on high-legibility, structured data, and an "Elite Banking" feel.
 */
export const PayoutDetailPage = () => {
    const { id } = useParams({ strict: false } as any);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: payout, isLoading } = usePayoutDetail(id);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdatePayoutStatus();

    if (isLoading) {
        return (
            <div className="p-8">
                <SkeletonDetail />
            </div>
        );
    }

    if (!payout) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl mb-6 opacity-20">?</div>
                <h3 className="text-lg font-bold mb-1 tracking-tight">Record Not Located</h3>
                <p className="text-muted-foreground mb-8 max-w-xs text-xs font-medium">The specified settlement record is not present in the current audit sequence.</p>
                <button
                    onClick={() => navigate({ to: '..' })}
                    className="h-10 px-6 rounded-md bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
                >
                    Return to Registry
                </button>
            </div>
        );
    }

    const isPaid = payout.status === 'paid';

    return (
        <div className="space-y-12 sm:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1500 pb-16">

            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-background-soft border border-border shadow-minimal hover:bg-primary hover:text-white transition-all group active:scale-95"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
                    </button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Fiscal Statement</h1>
                            <Badge variant={isPaid ? 'success' : 'primary'} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
                                {payout.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest flex items-center gap-3 leading-none">
                            <span>Registry ID</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="font-mono">{payout.id.toUpperCase()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 no-print">
                    {!isPaid && user?.role === 'platform_admin' && (
                        <button
                            onClick={() => updateStatus({ id: payout.id, status: 'paid' })}
                            disabled={isUpdating}
                            className="h-11 px-8 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {isUpdating ? 'Synchronizing...' : 'Confirm Settlement'}
                        </button>
                    )}
                    <button
                        onClick={() => generatePayoutPDF(payout)}
                        className="h-11 px-8 bg-background-soft border border-border text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary hover:text-white transition-all flex items-center gap-3 active:scale-95"
                    >
                        <span>📥</span>
                        Export PDF
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Net Settlement */}
                <div className="p-10 card-minimal space-y-6 transition-all hover:border-primary/30 group">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Net Settlement</p>
                    <div className="space-y-4">
                        <p className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                            <span className="text-[10px] text-muted-foreground/40 mr-2 uppercase tracking-widest leading-none font-bold">ETB</span>
                            {payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 py-1.5 px-3 rounded-full border border-emerald-500/10 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Funds Released
                        </div>
                    </div>
                </div>

                {/* Price per Kuntal */}
                <div className="p-10 card-minimal space-y-6 transition-all hover:border-primary/30 group">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Unit Rate</p>
                    <div className="space-y-2">
                        <p className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                            <span className="text-[10px] text-muted-foreground/40 mr-2 uppercase tracking-widest font-bold">ETB</span>
                            {payout.breakdown.pricePerKuntal?.toLocaleString() || (payout.amount / payout.source.contributionQuantity).toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Rate per Kuntal</p>
                    </div>
                </div>

                {/* Total Quantity */}
                <div className="p-10 card-minimal space-y-6 transition-all hover:border-primary/30 group">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Total Volume</p>
                    <div className="space-y-2">
                        <p className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
                            {payout.source.contributionQuantity.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Units (Kuntal)</p>
                    </div>
                </div>

                {/* Quality Grade */}
                <div className="p-10 card-minimal space-y-6 transition-all hover:border-primary/30 group">
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Quality Grade</p>
                    <div className="flex items-center gap-4">
                        <p className="text-4xl font-bold tracking-tighter text-primary">
                            {payout.source.qualityGrade}
                        </p>
                        <Badge variant="success" className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shadow-minimal">Verified</Badge>
                    </div>
                </div>
            </div>
            {/* 3. Settlement Details & Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    <section className="space-y-6">
                        <div className="card-minimal overflow-hidden">
                            <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 leading-none">
                                    Financial Breakdown
                                </h3>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/50 bg-background-soft/50">
                                        <th className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                                        <th className="px-10 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Allocation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    <tr className="hover:bg-background-soft transition-colors">
                                        <td className="px-10 py-8 text-[13px] font-bold text-foreground">Standard Yield Base</td>
                                        <td className="px-10 py-8 text-right text-[13px] font-bold text-foreground tabular-nums">ETB {payout.breakdown.baseAmount.toLocaleString()}</td>
                                    </tr>
                                    <tr className="hover:bg-background-soft transition-colors">
                                        <td className="px-10 py-8 text-[13px] font-bold text-foreground flex items-center gap-4">
                                            Quality Incentive
                                            <Badge variant="success" className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest shadow-minimal">Bonus</Badge>
                                        </td>
                                        <td className="px-10 py-8 text-right text-[13px] font-bold text-emerald-500 tabular-nums">+ ETB {payout.breakdown.qualityBonus.toLocaleString()}</td>
                                    </tr>
                                    <tr className="hover:bg-background-soft transition-colors">
                                        <td className="px-10 py-8 text-[13px] font-bold text-foreground flex items-center gap-4">
                                            Service Deductions
                                        </td>
                                        <td className="px-10 py-8 text-right text-[13px] font-bold text-rose-500 tabular-nums">- ETB {payout.breakdown.deductions.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-background-soft/50 border-t border-border/50">
                                        <td className="px-10 py-10 text-[11px] font-bold uppercase tracking-widest text-primary">Final Net Settlement</td>
                                        <td className="px-10 py-10 text-right text-3xl font-bold tracking-tighter text-foreground tabular-nums">
                                            <span className="text-[10px] text-muted-foreground/40 mr-4 font-bold">TOTAL ETB</span>
                                            {payout.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="p-10 card-minimal grid grid-cols-1 md:grid-cols-2 gap-10 shadow-minimal">
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Origin Hub</p>
                            <p className="text-[13px] font-bold text-foreground truncate">{payout.aggTitle || payout.source.aggregationTitle}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Linked Transaction</p>
                            <p className="text-[10px] font-mono font-bold text-primary tracking-widest break-all">#{payout.source.orderId}</p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-12">
                    {/* Beneficiary Profile Card */}
                    <div className="card-minimal overflow-hidden">
                        <div className="p-10 space-y-10">
                            <div className="flex items-center gap-6 pb-8 border-b border-border/50">
                                <div className="w-16 h-16 bg-background-soft border border-border rounded-2xl flex items-center justify-center text-primary font-bold text-2xl shadow-minimal">
                                    {payout.farmerName[0].toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-xl leading-tight text-foreground">{payout.farmerName}</p>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80 leading-none mt-1">Verified Beneficiary</p>
                                </div>
                            </div>

                            {/* Audit Timeline */}
                            <div className="space-y-8">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">Audit Timeline</p>
                                <div className="space-y-10 pl-4 relative">
                                    <div className="absolute left-[4px] top-4 bottom-4 w-[1px] bg-border/50"></div>
                                    {payout.auditLogs && payout.auditLogs.length > 0 ? (
                                        payout.auditLogs.map((log, i) => (
                                            <div key={log.id} className="pl-10 relative group">
                                                <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 bg-background ${i === 0 ? 'border-primary shadow-minimal' : 'border-border'} group-hover:bg-primary transition-all`}></div>
                                                <div className="space-y-1">
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? 'text-primary' : 'text-muted-foreground/40'}`}>
                                                        {log.action.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest tabular-nums">
                                                        {log.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="pl-10 relative group">
                                            <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 bg-background border-primary shadow-minimal group-hover:bg-primary transition-all"></div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Initial Record Genesis</p>
                                            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest mt-1">{payout.date}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            </div>

            {/* Technical Metadata */}
            <footer className="pt-12 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                    <p>Fiscal Service Engine v4.2.8</p>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <p>Registry Secure</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Sync Stable</span>
                </div>
            </footer>        </div>
    );
};

