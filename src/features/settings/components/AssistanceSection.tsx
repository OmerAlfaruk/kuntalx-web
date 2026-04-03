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
            {onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center justify-center h-8 px-4 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest shadow-minimal"
                >
                    Open
                </button>
            )}
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

export const AssistanceSection: React.FC = memo(() => {
    return (
        <section className="space-y-8">
            <SectionHeader title="Help & Support" />
            <div className="card-minimal p-4 sm:p-8">
                <div className="divide-y divide-border/50">
                    <SettingsItem
                        icon={QuestionMarkCircleIcon}
                        title="Help Center"
                        subtitle="Guides"
                        onAction={() => window.open("https://kuntalx.com/help", "_blank")}
                    />
                    <SettingsItem
                        icon={ShieldCheckIcon}
                        title="Privacy Policy"
                        subtitle="Data Policy"
                        onAction={() => window.open("https://kuntalx.com/privacy", "_blank")}
                    />
                    <SettingsItem
                        icon={DocumentTextIcon}
                        title="Terms of Service"
                        subtitle="Legal"
                        onAction={() => window.open("https://kuntalx.com/terms", "_blank")}
                    />
                </div>
            </div>
        </section>
    );
});
