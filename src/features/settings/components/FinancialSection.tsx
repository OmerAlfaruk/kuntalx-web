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
    <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-border/50 last:border-0 hover:bg-background-soft transition-all duration-300 px-4 -mx-4 sm:px-0 sm:mx-0 text-left">
        <div className="flex items-center gap-4 flex-1">
            <div className="w-9 h-9 rounded-lg bg-background-soft border border-border/50 flex items-center justify-center text-primary shrink-0 group-hover/item:border-primary/30 transition-all">
                <Icon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                    {title}
                </h4>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
            {children}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] shrink-0 text-left">
            {title}
        </h2>
        <div className="h-px flex-1 bg-border/40" />
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
        <section className="space-y-8">
            <SectionHeader title="Payout Settings" />
            <div className="card-minimal p-4 sm:p-8">
                <div className="divide-y divide-border/50">
                    <SettingsItem icon={WalletIcon} title="Payout Method" subtitle={financialForm.payoutMethod.replace("_", " ")}>
                        <select
                            value={financialForm.payoutMethod}
                            onChange={(e) => {
                                onFinancialChange('payoutMethod', e.target.value);
                                setTimeout(() => onFinancialSave(e as any), 100);
                            }}
                            className="bg-background-soft border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                        >
                            <option value="bank_transfer">BANK TRANSFER</option>
                            <option value="telebirr">MOBILE WALLET</option>
                            <option value="cash_on_delivery">DIRECT CASH</option>
                        </select>
                    </SettingsItem>

                    <SettingsItem icon={FingerPrintIcon} title="Payout Account ID" subtitle={financialForm.payoutDetails || "No ID Linked"}>
                        <input
                            type="text"
                            value={financialForm.payoutDetails}
                            onChange={(e) => onFinancialChange('payoutDetails', e.target.value)}
                            onBlur={onFinancialSave}
                            className="bg-background-soft border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary/50 focus:outline-none w-full sm:w-48 sm:text-right"
                            placeholder="Account Number / Wallet ID"
                        />
                    </SettingsItem>

                    <div className="pt-6 text-left">
                        <div className="p-5 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Automated Payouts</p>
                                <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-1">
                                    Payments are processed daily.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});
