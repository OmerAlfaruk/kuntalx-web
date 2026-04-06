import React, { memo } from 'react';
import { QuestionMarkCircleIcon, ShieldCheckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    onAction,
}: {
    icon: any;
    title: string;
    subtitle?: string;
    onAction?: () => void;
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
            {onAction && (
                <button
                    onClick={onAction}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-background border border-border text-muted-foreground hover:bg-background-soft hover:text-foreground active:scale-95 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                >
                    View
                </button>
            )}
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

export const AssistanceSection: React.FC = memo(() => {
    return (
        <section className="space-y-6">
            <SectionHeader title="Support & Resources" />
            <div className="card-minimal p-4 sm:p-10 relative overflow-hidden transition-all hover:border-primary/20">
                <div className="divide-y divide-border/50">
                    <SettingsItem
                        icon={QuestionMarkCircleIcon}
                        title="Help Center"
                        subtitle="Guides & FAQs"
                        onAction={() => window.open("https://kuntalx.com/help", "_blank")}
                    />
                    <SettingsItem
                        icon={ShieldCheckIcon}
                        title="Privacy Policy"
                        subtitle="Data & Security"
                        onAction={() => window.open("https://kuntalx.com/privacy", "_blank")}
                    />
                    <SettingsItem
                        icon={DocumentTextIcon}
                        title="Terms of Service"
                        subtitle="User Agreement"
                        onAction={() => window.open("https://kuntalx.com/terms", "_blank")}
                    />
                </div>
            </div>
        </section>
    );
});
