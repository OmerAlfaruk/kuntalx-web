import React, { memo } from 'react';
import { MoonIcon, SunIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

interface PreferencesSectionProps {
    theme: string;
    language: string;
    onThemeToggle: () => void;
    onLanguageChange: (lang: "en" | "am" | "om") => void;
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

export const PreferencesSection: React.FC<PreferencesSectionProps> = memo(({
    theme,
    language,
    onThemeToggle,
    onLanguageChange
}) => {
    const languages: { code: "en" | "am" | "om"; label: string }[] = [
        { code: "en", label: "English" },
        { code: "am", label: "Amharic" },
        { code: "om", label: "Oromo" },
    ];

    return (
        <section className="space-y-8">
            <SectionHeader title="Appearance" />
            <div className="card-minimal p-4 sm:p-8">
                <div className="divide-y divide-border/50">
                    <SettingsItem icon={theme === "dark" ? MoonIcon : SunIcon} title="Theme Mode" subtitle={theme === "dark" ? "Dark Theme" : "Light Theme"}>
                        <button
                            onClick={onThemeToggle}
                            className={`w-10 h-5 rounded-full transition-all relative ${theme === "dark" ? "bg-primary" : "bg-muted-foreground/20"}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${theme === "dark" ? "left-6" : "left-1"}`} />
                        </button>
                    </SettingsItem>

                    <SettingsItem icon={GlobeAltIcon} title="Language Selection" subtitle="App Translation">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {languages.map(({ code, label }) => (
                                <button
                                    key={code}
                                    onClick={() => onLanguageChange(code)}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${language === code
                                            ? "bg-primary text-white border-primary"
                                            : "bg-background-soft border-border text-muted-foreground hover:bg-muted/10"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </SettingsItem>
                </div>
            </div>
        </section>
    );
});
