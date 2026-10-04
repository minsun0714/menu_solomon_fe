import { api } from '@/lib/api'
import { ALL_CATEGORIES, type RestaurantSort } from '@/domain/restaurantRules'
import type { Restaurant, TeamRestaurantList, TeamRestaurantSummary } from '@/types/restaurant'

type ApiLatestReview = { nickname: string; rating: number; content: string; updatedAt: string }

type TeamRestaurantResponse = Omit<Restaurant, 'id'> & {
  id: string
  restaurantId: string
  registeredByNickname: string
  createdAt: string
  averageRating: number | null
  reviewCount: number
  latestReview: ApiLatestReview | null
}

function toSummary(item: TeamRestaurantResponse): TeamRestaurantSummary {
  const { id, restaurantId, registeredByNickname, createdAt, averageRating, reviewCount, latestReview, ...restaurant } = item
  return {
    id,
    restaurantId,
    registeredByNickname,
    createdAt,
    averageRating: averageRating ?? 0,
    reviewCount,
    latestReview: latestReview
      ? { authorNickname: latestReview.nickname, rating: latestReview.rating, content: latestReview.content, updatedAt: latestReview.updatedAt }
      : null,
    restaurant: { id: restaurantId, ...restaurant },
  }
}

type ListResponse = Omit<TeamRestaurantList, 'restaurants'> & { restaurants: TeamRestaurantResponse[] }

export const restaurantService = {
  async getTeamRestaurants(teamId: string, keyword = '', category = ALL_CATEGORIES, sort?: RestaurantSort): Promise<TeamRestaurantList> {
    const { restaurants, ...rest } = await api.get<ListResponse>(`/teams/${teamId}/restaurants`, {
      keyword: keyword.trim() || undefined,
      category: category === ALL_CATEGORIES ? undefined : category,
      sort,
    })
    return { ...rest, restaurants: restaurants.map(toSummary) }
  },

  async getRestaurantDetail(teamId: string, teamRestaurantId: string): Promise<TeamRestaurantSummary> {
    return toSummary(await api.get<TeamRestaurantResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}`))
  },

  addTeamRestaurant(teamId: string, kakaoPlaceId: string): Promise<TeamRestaurantSummary['restaurant']> {
    return api.post<TeamRestaurantSummary['restaurant']>(`/teams/${teamId}/restaurants`, { kakaoPlaceId })
  },

  deleteTeamRestaurant(teamId: string, teamRestaurantId: string): Promise<void> {
    return api.delete(`/teams/${teamId}/restaurants/${teamRestaurantId}`)
  },
}
