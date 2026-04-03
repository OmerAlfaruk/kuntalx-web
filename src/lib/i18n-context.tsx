import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import en from '../locales/en.json';
import am from '../locales/am.json';
import om from '../locales/om.json';

type Language = 'en' | 'am' | 'om';

const locales: Record<Language, any> = { en, am, om };

interface I18nContextType {
    language: Language;
    changeLanguage: (lang: Language) => void;
    t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('preferred_language');
        return (saved as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('preferred_language', language);
        // Optionally sync with backend if user is authenticated
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    const t = (path: string): string => {
        const keys = path.split('.');
        let value = locales[language];

        for (const key of keys) {
            value = value?.[key];
        }

        return value || path;
    };

    const value = useMemo(() => ({ language, changeLanguage, t }), [language]);

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
