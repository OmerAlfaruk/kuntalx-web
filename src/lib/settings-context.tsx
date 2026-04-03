
import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

export type CalendarType = 'gregorian' | 'ethiopian';

interface SettingsContextType {
    calendarType: CalendarType;
    setCalendarType: (type: CalendarType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [calendarType, setCalendarType] = useState<CalendarType>(() => {
        const saved = localStorage.getItem('preferred_calendar');
        return (saved as CalendarType) || 'gregorian';
    });

    useEffect(() => {
        localStorage.setItem('preferred_calendar', calendarType);
    }, [calendarType]);

    const value = useMemo(() => ({ calendarType, setCalendarType }), [calendarType]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
