import React, { memo } from 'react';
import { WalletIcon, FingerPrintIcon } from "@heroicons/react/24/outline";

interface FinancialSectionProps {
    user: any;
    financialForm: { payoutMethod: string; payoutDetails: string };
    onFinancialChange: (field: string, value: string) => void;
    onFinancialSave: (e: React.FormEvent) => void;
}

const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    children,
}: {
    icon: any;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}) => (
    <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 border-b border-border/50 last:border-0 hover:bg-background-soft/30 transition-all duration-300 px-6 -mx-6 sm:px-0 sm:mx-0 text-left rounded-xl">
        <div className="flex items-center gap-6 flex-1">
            <div className="w-11 h-11 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-minimal">
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
                <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">
                    {title}
                </h4>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest leading-none mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
            {children}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-8 flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0 text-left">
            {title}
        </h2>
        <div className="h-px flex-1 bg-border/50" />
    </div>
);

export const FinancialSection: React.FC<FinancialSectionProps> = memo(({
    user,
    financialForm,
    onFinancialChange,
    onFinancialSave
}) => {
    if (user?.role !== "farmer") {
        return null;
    }

    return (
        <section className="space-y-6">
            <SectionHeader title="Financial Settings" />
            <div className="card-minimal p-4 sm:p-10 relative overflow-hidden transition-all hover:border-primary/20">

                <div className="space-y-2">
                    <SettingsItem icon={WalletIcon} title="Payout Method" subtitle={financialForm.payoutMethod.replace("_", " ")}>
                        <div className="relative group w-full sm:w-64">
                            <select
                                value={financialForm.payoutMethod}
                                onChange={(e) => {
                                    onFinancialChange('payoutMethod', e.target.value);
                                    setTimeout(() => onFinancialSave(e as any), 100);
                                }}
                                className="w-full h-11 bg-background border border-border rounded-xl px-5 text-[11px] font-bold tracking-widest text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none uppercase appearance-none cursor-pointer"
                            >
                                <option value="bank_transfer" className="bg-background">Bank Transfer</option>
                                <option value="telebirr" className="bg-background">Mobile Wallet</option>
                                <option value="cash_on_delivery" className="bg-background">Direct Cash</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                ⌵
                            </div>
                        </div>
                    </SettingsItem>

                    <SettingsItem icon={FingerPrintIcon} title="Account Details" subtitle={financialForm.payoutDetails || "Not provided"}>
                        <input
                            type="text"
                            value={financialForm.payoutDetails}
                            onChange={(e) => onFinancialChange('payoutDetails', e.target.value)}
                            onBlur={onFinancialSave}
                            className="h-11 bg-background border border-border rounded-xl px-5 text-sm font-bold tracking-tight text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none w-full sm:w-64 text-left sm:text-right"
                            placeholder="Account Number / Phone"
                        />
                    </SettingsItem>

                    <div className="pt-10 text-left">
                        <div className="p-6 bg-background-soft border border-border rounded-2xl flex items-start gap-5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                ⚡
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Automated Payout Engine</p>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                    Payouts are processed daily. Changes to your preferred payment method will apply to all future fulfilled transactions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});
