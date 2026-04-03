import type { SearchRepository } from '../api/search-repository';
import type { SearchResult } from '../types/search-result';

export class GlobalSearchUseCase {
    private repository: SearchRepository;

    constructor(repository: SearchRepository) {
        this.repository = repository;
    }

    async execute(keyword: string, limit?: number): Promise<SearchResult> {
        return this.repository.search(keyword, limit);
    }
}
