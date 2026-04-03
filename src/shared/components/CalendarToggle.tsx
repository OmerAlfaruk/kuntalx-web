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
                                ? 'bg-primary/10 text-primary border-primary/20 italic font-black'
                                : 'hover:bg-primary/5 text-foreground/60 border-transparent hover:text-foreground'
                            }`}
                    >
                        <span className="text-lg">{type === 'gregorian' ? '🌐' : '🇪🇹'}</span>
                        <span className="text-[10px] uppercase tracking-tighter">{type === 'gregorian' ? 'GC' : 'EC'}</span>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <button
            onClick={() => setCalendarType(calendarType === 'gregorian' ? 'ethiopian' : 'gregorian')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 text-primary-foreground/70 hover:text-white transition-all border border-white/5"
            title="Switch Calendar"
        >
            <span className="text-lg">📅</span>
            <span className="text-xs font-bold uppercase tracking-wider">
                {calendarType === 'gregorian' ? 'GC' : 'EC'}
            </span>
        </button>
    );
}

