import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { placeSearchService } from '@/services/placeSearchService'

export function usePlaceSearchQuery(keyword: string, page: number) {
  return useQuery({
    queryKey: queryKeys.place.search(keyword, page),
    queryFn: () => placeSearchService.search(keyword, page),
    enabled: keyword.trim().length > 0,
    placeholderData: (previousData) => previousData,
  })
}
