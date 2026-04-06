import React from 'react';
import { type AggregationItem } from '../types/aggregation';

interface VerificationTerminalProps {
    item: AggregationItem;
    verifyForm: {
        verifiedQuantity: string;
        qualityGrade: string;
        notes: string;
    };
    setVerifyForm: React.Dispatch<React.SetStateAction<{
        verifiedQuantity: string;
        qualityGrade: string;
        notes: string;
    }>>;
    handleVerifyItem: () => Promise<void>;
    onAbort: () => void;
    isVerifying: boolean;
}

export const VerificationTerminal: React.FC<VerificationTerminalProps> = ({
    item,
    verifyForm,
    setVerifyForm,
    handleVerifyItem,
    onAbort,
    isVerifying
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-[700px] rounded-[2rem] border border-border p-10 space-y-10 shadow-2xl relative overflow-hidden">
                {/* Subtle Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -ml-24 -mb-24" />

                <div className="space-y-2 relative z-10 text-center">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] leading-none mb-2">Registry Verification Sequence</p>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight uppercase">Verify Contribution</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-background-soft p-8 rounded-2xl border border-border shadow-inner relative z-10 transition-all hover:border-primary/20">
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Contributing Producer</p>
                        <p className="text-xl font-bold text-foreground uppercase tracking-tight">{item.farmerName || 'Anonymous Producer'}</p>
                        <div className="flex items-center gap-2 pt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <p className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest">ID: {item.farmerId.substring(0, 16)}...</p>
                        </div>
                    </div>
                    <div className="md:text-right flex flex-col justify-center">
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mb-2">Declared Volume</p>
                        <p className="text-4xl font-bold text-primary tabular-nums tracking-tighter uppercase leading-none">
                            {item.quantityKuntal} <span className="text-[10px] font-bold opacity-30 tracking-widest ml-1 uppercase">QTNT</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified Net Volume (QT)</label>
                        <div className="relative group">
                            <input
                                type="number"
                                className="w-full h-20 bg-background border border-border rounded-2xl px-6 text-3xl font-bold tabular-nums focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-foreground placeholder:text-muted-foreground/10"
                                value={verifyForm.verifiedQuantity}
                                placeholder={String(item.quantityKuntal)}
                                onChange={(e) => setVerifyForm(prev => ({ ...prev, verifiedQuantity: e.target.value }))}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest pointer-events-none group-focus-within:text-primary transition-colors">Manual Override</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Authentication Grade</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['A', 'B', 'C'].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setVerifyForm(prev => ({ ...prev, qualityGrade: g as any }))}
                                    className={`h-20 rounded-2xl font-bold text-2xl transition-all duration-300 border-2 flex items-center justify-center relative overflow-hidden group/btn ${verifyForm.qualityGrade === g
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                                            : 'bg-background border-border text-muted-foreground hover:bg-background-soft hover:border-primary/20'
                                        }`}
                                >
                                    <span className="relative z-10">{g}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 pt-4 relative z-10">
                    <button
                        onClick={onAbort}
                        className="flex-1 h-14 rounded-xl border border-border bg-background-soft text-[10px] font-bold uppercase tracking-widest hover:bg-background transition-all text-muted-foreground hover:text-foreground active:scale-95"
                    >
                        Cancel Operation
                    </button>
                    <button
                        onClick={handleVerifyItem}
                        disabled={isVerifying}
                        className="flex-[1.5] h-14 rounded-xl bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
                    >
                        {isVerifying ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-lg">✅</span>
                                <span>Finalize Verification</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Security Footer */}
                <div className="pt-6 text-center">
                    <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.5em] leading-none mb-2">
                        Secure Transaction Hash Protocol Active
                    </p>
                </div>
            </div>
        </div>
    );
};
