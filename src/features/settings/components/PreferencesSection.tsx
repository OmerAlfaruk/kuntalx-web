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
        <section className="space-y-6">
            <SectionHeader title="Preferences" />
            <div className="card-minimal p-4 sm:p-10 relative overflow-hidden transition-all hover:border-primary/20">
                <div className="divide-y divide-border/50">
                    <SettingsItem icon={theme === "dark" ? MoonIcon : SunIcon} title="Appearance" subtitle={theme === "dark" ? "Dark Mode" : "Light Mode"}>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                            <button
                                onClick={onThemeToggle}
                                className={`w-14 h-7 rounded-full transition-all relative border border-border shadow-inner p-1 ${theme === "dark" ? "bg-primary/20 border-primary/20" : "bg-card"}`}
                            >
                                <div className={`w-5 h-5 rounded-full shadow-minimal transition-all duration-300 transform ${theme === "dark" ? "translate-x-7 bg-primary" : "translate-x-0 bg-muted-foreground/30"}`} />
                            </button>
                        </div>
                    </SettingsItem>

                    <SettingsItem icon={GlobeAltIcon} title="Language" subtitle="Select Language">
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            {languages.map(({ code, label }) => (
                                <button
                                    key={code}
                                    onClick={() => onLanguageChange(code)}
                                    className={`flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${language === code
                                            ? "bg-primary text-white shadow-minimal"
                                            : "bg-background-soft border border-border text-muted-foreground hover:bg-background hover:text-foreground active:scale-95"
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
