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
        <div ref={containerRef} className="relative flex items-center w-full max-w-sm">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="relative flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4 text-muted-foreground absolute left-3 opacity-50 pointer-events-none"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => debouncedQuery.length >= 2 && setIsOpen(true)}
                        placeholder="SEARCH KUNTALX..."
                        className="w-full h-10 pl-10 pr-4 bg-white border border-border/50 rounded-full text-xs font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {isLoading && debouncedQuery.length >= 2 && (
                        <div className="absolute right-3 w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    )}
                </div>
            </form>

            {/* Results Dropdown */}
            {isOpen && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
                    {!hasResults && !isLoading && (
                        <div className="py-6 flex flex-col items-center text-center opacity-50">
                            <span className="text-lg">🔍</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">No results</p>
                        </div>
                    )}

                    {/* Aggregations Results */}
                    {(data?.aggregations?.length ?? 0) > 0 && (
                        <div>
                            <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20">
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-60">Aggregations</p>
                            </div>
                            {data?.aggregations.map((agg) => (
                                <button
                                    key={agg.id}
                                    onClick={() => handleNavigate(`/aggregations/${agg.id}`)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left group"
                                >
                                    <div className="w-7 h-7 rounded-md bg-muted border border-border/40 flex items-center justify-center text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        {agg.crop_type_name === 'Coffee' ? '☕' : '🌾'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-extrabold tracking-tight truncate">{agg.title}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{agg.crop_type_name} · {agg.status}</p>
                                    </div>
                                    <svg className="ml-auto shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Associations Results */}
                    {(data?.associations?.length ?? 0) > 0 && (
                        <div className={(data?.aggregations?.length ?? 0) > 0 ? 'border-t border-border/50' : ''}>
                            <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20">
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-60">Associations</p>
                            </div>
                            {data?.associations.map((assoc) => (
                                <button
                                    key={assoc.id}
                                    onClick={() => handleNavigate(`/associations/${assoc.id}`)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left group"
                                >
                                    <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        {assoc.name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-extrabold tracking-tight truncate">{assoc.name}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{assoc.region}</p>
                                    </div>
                                    <svg className="ml-auto shrink-0 opacity-0 group-hover:opacity-40 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer Link */}
                    {hasResults && (
                        <div className="border-t border-border/50 px-4 py-2.5">
                            <button
                                onClick={() => handleNavigate('/aggregations')}
                                className="text-[9px] font-extrabold uppercase tracking-widest text-primary hover:underline"
                            >
                                View all results →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
