import { api } from '@/lib/api'
import type { PlaceSearchPage } from '@/types/restaurant'

export const placeSearchService = {
  search(keyword: string, page = 1, size = 5): Promise<PlaceSearchPage> {
    return api.get<PlaceSearchPage>('/places/search', { query: keyword.trim(), page, size })
  },
}
