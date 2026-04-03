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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-[800px] rounded-[3rem] border border-white/10 p-12 space-y-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

                <div className="space-y-3 relative z-10 text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">Node Authentication Sequence</p>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter leading-none uppercase italic">VERIFY STOCK</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-muted/30 p-10 rounded-[2rem] border border-white/5 relative z-10 shadow-inner">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] italic mb-2">Originating Producer Node</p>
                        <p className="text-2xl font-black text-foreground uppercase tracking-tight italic">{item.farmerName || 'Anonymous_Producer'}</p>
                        <p className="text-[9px] font-mono text-muted-foreground/30 break-all">{item.farmerId}</p>
                    </div>
                    <div className="md:text-right flex flex-col justify-center">
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] italic mb-2">Self-Declared Volume</p>
                        <p className="text-5xl font-black text-primary tabular-nums tracking-tighter uppercase italic leading-none">
                            {item.quantityKuntal} <span className="text-xs opacity-40 italic tracking-widest ml-1">QT</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-60">Verified Net Volume (QT)</label>
                        <div className="relative group/input">
                            <input
                                type="number"
                                className="w-full h-24 bg-background/50 border border-border/40 rounded-3xl px-8 font-black text-4xl tabular-nums focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all italic text-foreground placeholder:text-muted-foreground/10"
                                value={verifyForm.verifiedQuantity}
                                placeholder={String(item.quantityKuntal)}
                                onChange={(e) => setVerifyForm(prev => ({ ...prev, verifiedQuantity: e.target.value }))}
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-20 uppercase tracking-widest italic group-focus-within/input:text-primary group-focus-within/input:opacity-100 transition-all">Manual_Entry</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic opacity-60">Certified Quality Grade</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['A', 'B', 'C'].map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setVerifyForm(prev => ({ ...prev, qualityGrade: g as any }))}
                                    className={`h-24 rounded-3xl font-black text-3xl transition-all duration-300 border-2 italic flex items-center justify-center relative overflow-hidden group/btn ${verifyForm.qualityGrade === g
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_15px_30px_rgba(16,185,129,0.3)] scale-[1.05]'
                                            : 'bg-muted/30 border-white/5 text-muted-foreground hover:bg-muted/50 hover:border-white/10'
                                        }`}
                                >
                                    <span className="relative z-10">{g}</span>
                                    {verifyForm.qualityGrade === g && (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6 relative z-10">
                    <button
                        onClick={onAbort}
                        className="flex-1 h-16 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted/30 transition-all text-muted-foreground/60 italic hover:text-foreground"
                    >
                        ABORT_TRANSACTION
                    </button>
                    <button
                        onClick={handleVerifyItem}
                        disabled={isVerifying}
                        className="flex-[2] h-16 rounded-2xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 italic group"
                    >
                        {isVerifying ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-xl group-hover:animate-bounce">💾</span>
                                <span>COMMIT_AUTHORIZATION</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Security Footer */}
                <div className="pt-8 text-center">
                    <p className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.8em] italic">
                        KuntalX_Biometric_Verification_Required_Next_Step
                    </p>
                </div>
            </div>
        </div>
    );
};
