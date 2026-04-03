import type { SearchResult } from '../types/search-result';

export interface SearchRepository {
    search(keyword: string, limit?: number): Promise<SearchResult>;
}
