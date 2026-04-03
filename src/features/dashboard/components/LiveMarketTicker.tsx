import React from 'react';
import { useMarketTicker } from '../hooks/use-dashboard-data';
import { SkeletonTicker } from '../../../shared/components/Skeletons';

export const LiveMarketTicker: React.FC = () => {
    const { data: tickerData, isLoading } = useMarketTicker();


    if (isLoading || !tickerData) return <SkeletonTicker />;

    return (
        <div className="overflow-x-auto py-3 border-y border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-md mb-8 no-scrollbar shadow-inner relative z-10">
            <div className="flex gap-6 sm:gap-10 whitespace-nowrap px-4 min-w-max sm:w-full sm:justify-around text-[11px] font-bold tracking-widest uppercase animate-fade-in">
                {tickerData.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <span className="font-extrabold text-muted-foreground uppercase italic text-[10px] tracking-wider opacity-60">{item.name}</span>
                        <span className={`${item.isUp ? 'text-emerald-600' : 'text-rose-600'} font-extrabold italic text-xs tabular-nums`}>
                            {item.isUp ? '↑' : '↓'} {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
