import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../lib/i18n-context';

const EthFlag = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full rounded-full border border-border shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="21.3" fill="#009A44" />
        <rect y="21.3" width="64" height="21.3" fill="#FED100" />
        <rect y="42.6" width="64" height="21.4" fill="#EF3340" />
        <circle cx="32" cy="32" r="9" fill="#0039A6" />
        <path d="M32 25l1.5 4.5h4.7l-3.8 2.8 1.4 4.5-3.8-2.7-3.8 2.7 1.4-4.5-3.8-2.8h4.7z" fill="#FED100" />
    </svg>
);

const GBFlag = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full rounded-full border border-border shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#012169" />
        <path d="M0 0l64 64M64 0L0 64" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l64 64M64 0L0 64" stroke="#C8102E" strokeWidth="4" />
        <path d="M32 0v64M0 32h64" stroke="#fff" strokeWidth="10" />
        <path d="M32 0v64M0 32h64" stroke="#C8102E" strokeWidth="6" />
    </svg>
);

export function LanguageSwitcher({ variant = 'dropdown' }: { variant?: 'dropdown' | 'plain' }) {
    const { language, changeLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'English', flag: <GBFlag /> },
        { code: 'am', label: 'አማርኛ', flag: <EthFlag /> },
        { code: 'om', label: 'Oromoo', flag: <EthFlag /> },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (variant === 'plain') {
        return (
            <div className="flex gap-1">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg transition-all duration-300 border ${language === lang.code
                            ? 'bg-background text-foreground border-border font-bold shadow-sm'
                            : 'hover:bg-background-soft text-muted-foreground border-transparent hover:text-foreground'
                            }`}
                    >
                        <div className="w-4 h-4 shrink-0 shadow-minimal">{lang.flag}</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{lang.code}</span>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 px-3 rounded-xl bg-background hover:bg-background-soft border border-border flex items-center gap-3 transition-all duration-300 active:scale-95 group shadow-sm"
            >
                <div className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500 shadow-minimal">{currentLang.flag}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground hidden sm:block transition-colors">
                    {currentLang.code}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-48 card-minimal overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-2 space-y-1 bg-background">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code as any);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${language === lang.code
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'hover:bg-background-soft text-foreground/70 grayscale-[0.3] hover:grayscale-0 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 shadow-minimal">{lang.flag}</div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{lang.label}</span>
                                </div>
                                {language === lang.code && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
