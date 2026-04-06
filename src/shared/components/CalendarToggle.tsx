import { useSettings } from '../../lib/settings-context';

export function CalendarToggle({ variant = 'button' }: { variant?: 'button' | 'plain' }) {
    const { calendarType, setCalendarType } = useSettings();

    if (variant === 'plain') {
        return (
            <div className="flex gap-1">
                {(['gregorian', 'ethiopian'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setCalendarType(type)}
                        className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg transition-all duration-300 border ${calendarType === type
                                ? 'bg-background text-foreground border-border font-bold shadow-sm'
                                : 'hover:bg-background-soft text-muted-foreground border-transparent hover:text-foreground'
                            }`}
                    >
                        <span className="text-lg">{type === 'gregorian' ? '🌐' : '🇪🇹'}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{type === 'gregorian' ? 'GC' : 'EC'}</span>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <button
            onClick={() => setCalendarType(calendarType === 'gregorian' ? 'ethiopian' : 'gregorian')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-background-soft text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border/50"
            title="Switch Calendar"
        >
            <span className="text-lg">📅</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">
                {calendarType === 'gregorian' ? 'GC' : 'EC'}
            </span>
        </button>
    );
}
