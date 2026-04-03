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
        primary: 'bg-primary/10 border-primary/20 text-primary',
        secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        gold: 'bg-gold/10 border-gold/20 text-gold',
    };

    return (
        <div className={`glass p-8 rounded-[40px] border shadow-xl group hover:scale-[1.02] transition-all duration-500 ${variants[variant]}`}>
            <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10 ${variants[variant].split(' ')[0]} bg-white/20`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider italic pt-2`}>
                        {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
                    </div>
                )}
            </div>

            <div>
                <p className="text-xs font-black uppercase tracking-wide mb-2 italic opacity-60">
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black italic tracking-tighter leading-none text-foreground">
                        {value}
                    </h3>
                    {subValue && (
                        <span className="text-xs font-black opacity-40 uppercase tracking-wider italic whitespace-nowrap">
                            {subValue}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-black uppercase tracking-wider italic opacity-40">Cryptographic Protocol Verified</p>
            </div>
        </div>
    );
};

