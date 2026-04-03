import { useQuery } from '@tanstack/react-query';
import { SearchRepositoryImpl } from '../api/search-repository-impl';
import { GlobalSearchUseCase } from '../services/global-search-usecase';

const searchRepository = new SearchRepositoryImpl();
const globalSearchUseCase = new GlobalSearchUseCase(searchRepository);

export function useGlobalSearch(keyword: string, limit: number = 5) {
    return useQuery({
        queryKey: ['global-search', keyword, limit],
        queryFn: () => globalSearchUseCase.execute(keyword, limit),
        enabled: keyword.length >= 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
