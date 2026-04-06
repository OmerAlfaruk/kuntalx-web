import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { useDebounce } from '../../../shared/hooks/use-debounce';

interface SearchResult {
    aggregations: Array<{ id: string; title: string; crop_type_name?: string; status: string }>;
    associations: Array<{ id: string; name: string; region: string }>;
}

const fetchSearchResults = async (keyword: string): Promise<SearchResult> => {
    return apiClient.get<SearchResult>('/search/', { keyword, limit: 4 });
};

export const GlobalSearchBar = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    const { data, isLoading } = useQuery({
        queryKey: ['global-search', debouncedQuery],
        queryFn: () => fetchSearchResults(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
        staleTime: 30_000,
    });

    const hasResults = (data?.aggregations?.length ?? 0) > 0 || (data?.associations?.length ?? 0) > 0;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Open dropdown when query is long enough
    useEffect(() => {
        setIsOpen(debouncedQuery.length >= 2);
    }, [debouncedQuery]);

    const handleNavigate = useCallback((to: string) => {
        setIsOpen(false);
        setQuery('');
        navigate({ to } as any);
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            handleNavigate(`/aggregations`);
        }
    };

    return (
        <div ref={containerRef} className="relative flex items-center w-full max-w-lg">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="relative flex items-center group">
                    <div className="absolute left-4 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => debouncedQuery.length >= 2 && setIsOpen(true)}
                        placeholder="Search system registry..."
                        className="w-full h-11 pl-12 pr-10 bg-background-soft border border-border rounded-xl text-[13px] font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-minimal"
                    />
                    {isLoading && debouncedQuery.length >= 2 && (
                        <div className="absolute right-4 w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                    )}
                </div>
            </form>

            {/* Results Dropdown */}
            {isOpen && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {!hasResults && !isLoading && (
                        <div className="py-12 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-xl mb-3 opacity-30">
                                🔍
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">No matches found</p>
                        </div>
                    )}

                    {/* Aggregations Results */}
                    {(data?.aggregations?.length ?? 0) > 0 && (
                        <div className="p-2">
                            <div className="px-5 py-3 flex items-center gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Aggregations</p>
                            </div>
                            <div className="space-y-1">
                                {data?.aggregations.map((agg) => (
                                    <button
                                        key={agg.id}
                                        onClick={() => handleNavigate(`/aggregations/${agg.id}`)}
                                        className="w-full px-5 py-3 flex items-center gap-4 hover:bg-background-soft rounded-xl transition-all duration-200 text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-all text-primary">
                                            {agg.crop_type_name === 'Coffee' ? '☕' : '🌾'}
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <p className="text-[13px] font-bold text-foreground truncate">{agg.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-muted-foreground/80">{agg.crop_type_name}</span>
                                                <span className="text-[10px] opacity-20 font-bold">•</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{agg.status.replace(/_/g, ' ')}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Associations Results */}
                    {(data?.associations?.length ?? 0) > 0 && (
                        <div className={`p-2 ${(data?.aggregations?.length ?? 0) > 0 ? 'border-t border-border/50' : ''}`}>
                            <div className="px-5 py-3 flex items-center gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Associations</p>
                            </div>
                            <div className="space-y-1">
                                {data?.associations.map((assoc) => (
                                    <button
                                        key={assoc.id}
                                        onClick={() => handleNavigate(`/associations/${assoc.id}`)}
                                        className="w-full px-5 py-3 flex items-center gap-4 hover:bg-background-soft rounded-xl transition-all duration-200 text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0 group-hover:scale-105 transition-all">
                                            {assoc.name[0]}
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <p className="text-[13px] font-bold text-foreground truncate">{assoc.name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{assoc.region}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer HUD */}
                    {hasResults && (
                        <div className="border-t border-border/50 bg-background-soft p-4 flex justify-between items-center px-6">
                            <button
                                onClick={() => handleNavigate('/aggregations')}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group"
                            >
                                View full directory
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
