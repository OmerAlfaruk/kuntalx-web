import React from 'react';
import { useMarketTicker } from '../hooks/use-dashboard-data';
import { SkeletonTicker } from '../../../shared/components/Skeletons';

export const LiveMarketTicker: React.FC = () => {
    const { data: tickerData, isLoading } = useMarketTicker();

    if (isLoading || !tickerData) return <SkeletonTicker />;

    return (
        <div className="overflow-x-auto py-4 border-y border-border/50 bg-background-soft/50 mb-10 no-scrollbar relative z-10">
            <div className="flex gap-10 whitespace-nowrap px-8 min-w-max sm:w-full sm:justify-around items-center animate-in fade-in duration-700">
                {tickerData.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center group cursor-default">
                        <span className="font-bold text-muted-foreground/60 uppercase tracking-widest text-[9px] transition-colors group-hover:text-primary leading-none">
                            {item.name} / ETB
                        </span>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                            item.isUp 
                            ? 'text-emerald-500 bg-emerald-500/10' 
                            : 'text-rose-500 bg-rose-500/10'
                        } font-bold text-[10px] tabular-nums`}>
                            <span className="text-[8px] opacity-80">{item.isUp ? '▲' : '▼'}</span>
                            {item.change > 0 ? '+' : ''}{item.change}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
