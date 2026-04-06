import React from 'react';

interface SummaryMetricProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: React.ReactNode;
    trend?: {
        direction: 'up' | 'down';
        value: string;
    };
    variant?: 'primary' | 'secondary' | 'emerald' | 'gold';
}

export const SummaryMetric: React.FC<SummaryMetricProps> = ({
    label,
    value,
    subValue,
    icon,
    trend,
    variant = 'primary'
}) => {
    const variants = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        emerald: 'text-emerald-500',
        gold: 'text-gold',
    };

    const variantBgs = {
        primary: 'bg-primary/10 border-primary/20',
        secondary: 'bg-secondary/10 border-secondary/20',
        emerald: 'bg-emerald-500/10 border-emerald-500/20',
        gold: 'bg-gold/10 border-gold/20',
    };

    return (
        <div className={`card-command p-8 group transition-all duration-500`}>
            <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10 ${variantBgs[variant]} backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${variants[variant]} pt-2`}>
                        <span className="opacity-70">{trend.direction === 'up' ? '↗' : '↘'}</span> 
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-display font-bold tracking-tight text-foreground">
                        {value}
                    </h3>
                    {subValue && (
                        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                            {subValue}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">Verified On Chain Protocol</p>
            </div>
        </div>
    );
};

