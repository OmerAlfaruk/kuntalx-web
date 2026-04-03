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
        <div className="space-y-8 sm:space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-700">

            {/* 1. Elite Header: Minimal & Informative */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/60 pb-10">
                <div className="space-y-6">
                    <button
                        onClick={() => navigate({ to: '..' })}
                        className="text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK_TO_LEDGER
                    </button>

                    <div className="space-y-1">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Settlement Statement</h1>
                            <Badge className={`bg-transparent border ${isPaid ? 'text-emerald-500 border-emerald-500/30' : 'text-primary border-primary/30'} text-xs px-3 py-1 font-bold tracking-wider uppercase rounded-sm`}>
                                {payout.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground tracking-tight uppercase">Ledger ID: {payout.id}</p>
                    </div>
                </div>

                <div className="flex gap-3 no-print">
                    {!isPaid && user?.role === 'platform_admin' && (
                        <button
                            onClick={() => updateStatus({ id: payout.id, status: 'paid' })}
                            disabled={isUpdating}
                            className="h-10 px-6 rounded-md bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isUpdating ? 'SETTLING...' : 'SETTLE_TRANSACTION'}
                        </button>
                    )}
                    <button
                        onClick={() => generatePayoutPDF(payout)}
                        className="h-10 px-6 rounded-md bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm flex items-center gap-2"
                    >
                        EXPORT_STATEMENT
                    </button>
                </div>
            </header>

            {/* 2. Executive Summary: The 4 Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Net Settlement */}
                <div className="p-8 card-minimal card-minimal-hover border-transparent space-y-4 transition-colors group">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Net Disbursement</p>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            ETB {payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Verified_Release
                        </div>
                    </div>
                </div>

                {/* Price per Kuntal (Price/Q) */}
                <div className="p-8 card-minimal card-minimal-hover border-transparent space-y-4 transition-colors group">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Price per Unit</p>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold tracking-tight text-foreground">
                            ETB {payout.breakdown.pricePerKuntal?.toLocaleString() || (payout.amount / payout.source.contributionQuantity).toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider italic">Rate / Kuntal_Standard</p>
                    </div>
                </div>

                {/* Total Quantity */}
                <div className="p-8 card-minimal card-minimal-hover border-transparent space-y-4 transition-colors group">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Total Quantity</p>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold tracking-tight text-foreground">
                            {payout.source.contributionQuantity.toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider italic">Units_In_Kuntal</p>
                    </div>
                </div>

                {/* Quality Grade */}
                <div className="p-8 card-minimal card-minimal-hover border-transparent space-y-4 transition-colors group">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-70">Quality Grade</p>
                    <div className="flex items-center gap-3">
                        <p className="text-4xl font-black tracking-tighter text-emerald-500 italic">
                            {payout.source.qualityGrade}
                        </p>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-xs px-2 py-0.5 font-bold uppercase tracking-wider">Grade A Verified</Badge>
                    </div>
                </div>
            </div>

            {/* 3. Settlement Details & Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Financial Distribution</h3>

                        <div className="card-minimal border-transparent shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 border-b border-border/60 text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">
                                    <tr>
                                        <th className="px-8 py-5">Entry Description</th>
                                        <th className="px-8 py-5 text-right font-extrabold italic">Allocation</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs divide-y divide-border/40">
                                    <tr className="hover:bg-muted/20 transition-colors">
                                        <td className="px-8 py-6 font-extrabold text-foreground/80 uppercase italic tracking-tight">Standard Contract Yield Base</td>
                                        <td className="px-8 py-6 text-right font-extrabold tracking-tight text-foreground italic">ETB {payout.breakdown.baseAmount.toLocaleString()}</td>
                                    </tr>
                                    <tr className="hover:bg-muted/20 transition-colors">
                                        <td className="px-8 py-6 font-extrabold text-foreground/80 uppercase italic tracking-tight">
                                            Premium Quality Multiplier
                                            <span className="ml-3 text-xs font-extrabold text-emerald-500 uppercase tracking-tight italic opacity-70">Incentive</span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-extrabold tracking-tight text-emerald-500 italic">+ ETB {payout.breakdown.qualityBonus.toLocaleString()}</td>
                                    </tr>
                                    <tr className="hover:bg-muted/20 transition-colors">
                                        <td className="px-8 py-6 font-extrabold text-foreground/80 uppercase italic tracking-tight">
                                            Association Service Levy
                                            <span className="ml-3 text-xs font-extrabold text-rose-500 uppercase tracking-tight italic opacity-70">Deduction</span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-extrabold tracking-tight text-rose-500 italic">- ETB {payout.breakdown.deductions.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-muted/40 font-extrabold">
                                        <td className="px-8 py-8 text-sm font-extrabold uppercase tracking-wider text-foreground/70 italic">Statement Net Balance</td>
                                        <td className="px-8 py-8 text-right text-2xl tracking-tighter text-foreground italic">ETB {payout.amount.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="p-8 bg-muted/20 border border-border/40 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-60">Origin Aggregation</p>
                            <p className="text-sm font-bold text-foreground/80 uppercase tracking-tight">{payout.aggTitle || payout.source.aggregationTitle}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider opacity-50">Nexus Transaction</p>
                            <p className="text-xs font-mono text-primary font-bold break-all">{payout.source.orderId}</p>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Beneficiary Profile Card */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Beneficiary</h3>
                        <div className="p-8 card-minimal border-transparent flex items-center gap-6 group hover:border-primary/40 transition-colors">
                            <div className="w-14 h-14 bg-muted border border-border/40 rounded-lg flex items-center justify-center text-xl font-bold text-primary group-hover:scale-105 transition-transform">
                                {payout.farmerName[0]}
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-foreground uppercase tracking-tight">{payout.farmerName}</h4>
                                <p className="text-xs font-bold text-primary uppercase tracking-wider italic">Platinum Registered</p>
                            </div>
                        </div>
                    </section>

                    {/* Audit Log Timeline */}
                    <section className="space-y-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Audit Trace</h3>
                        <div className="space-y-8 pl-1 relative">
                            <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-border/60"></div>
                            {payout.auditLogs && payout.auditLogs.length > 0 ? (
                                payout.auditLogs.map((log, i) => (
                                    <div key={log.id} className="pl-6 relative group cursor-default">
                                        <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-background ${i === 0 ? 'border-primary' : 'border-muted'} group-hover:bg-primary transition-colors`}></div>
                                        <div className="space-y-0.5">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${i === 0 ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                                                {log.action.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-xs font-bold text-muted-foreground/40 italic uppercase">
                                                {log.timestamp} {log.userName ? `• ${log.userName}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="pl-6 relative">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-background border-muted"></div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">INITIAL_RECORD</p>
                                    <p className="text-xs font-bold text-muted-foreground/30 italic uppercase">{payout.date}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Verification Footer HUD */}
            <div className="pt-10 border-t border-border/40 flex justify-between items-center text-xs font-bold text-muted-foreground/50 uppercase tracking-wider italic">
                <p>KuntalX_Trust_Engine_v4.2</p>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                    SECURE_ENDPOINT_ACTIVE
                </div>
            </div>
        </div>
    );
};

