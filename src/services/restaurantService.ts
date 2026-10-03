import { ApiError } from '@/mocks/api/errors'
import {
  db,
  findOrThrow,
  getMemberNickname,
  getMyMember,
  getTeamOrThrow,
  nextId,
  simulateLatency,
} from '@/mocks/api/db'
import { getAverageRating } from '@/domain/reviewRules'
import type { Restaurant, TeamRestaurant, TeamRestaurantSummary } from '@/types/restaurant'

function toSummary(teamRestaurant: TeamRestaurant): TeamRestaurantSummary {
  const restaurant = findOrThrow(db.restaurants.find(({ id }) => id === teamRestaurant.restaurantId), '식당을 찾을 수 없습니다.')
  const reviews = db.reviews.filter(({ teamRestaurantId }) => teamRestaurantId === teamRestaurant.id)
  return {
    ...teamRestaurant,
    restaurant,
    registeredByNickname: getMemberNickname(teamRestaurant.registeredByTeamMemberId),
    averageRating: getAverageRating(reviews),
    reviewCount: reviews.length,
  }
}

export const restaurantService = {
  getTeamRestaurants(teamId: string): Promise<TeamRestaurantSummary[]> {
    return simulateLatency(() => {
      getTeamOrThrow(teamId)
      return db.teamRestaurants.filter((tr) => tr.teamId === teamId).map(toSummary)
    })
  },

  getRestaurantDetail(teamRestaurantId: string): Promise<TeamRestaurantSummary> {
    return simulateLatency(() =>
      toSummary(findOrThrow(db.teamRestaurants.find(({ id }) => id === teamRestaurantId), '식당을 찾을 수 없습니다.')),
    )
  },

  searchMockRestaurants(keyword: string): Promise<Restaurant[]> {
    return simulateLatency(() => {
      const query = keyword.trim().toLowerCase()
      return db.restaurants.filter(
        ({ name, category, address }) =>
          query === '' || [name, category, address].some((text) => text.toLowerCase().includes(query)),
      )
    })
  },

  addTeamRestaurant(teamId: string, restaurantId: string): Promise<TeamRestaurant> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      findOrThrow(db.restaurants.find(({ id }) => id === restaurantId), '식당을 찾을 수 없습니다.')
      if (db.teamRestaurants.some((tr) => tr.teamId === teamId && tr.restaurantId === restaurantId)) {
        throw new ApiError('CONFLICT', '이미 등록된 식당입니다.')
      }
      const created: TeamRestaurant = {
        id: nextId('tr'),
        teamId,
        restaurantId,
        registeredByTeamMemberId: me.id,
        createdAt: new Date().toISOString(),
      }
      db.teamRestaurants.push(created)
      return created
    })
  },

  deleteTeamRestaurant(teamRestaurantId: string): Promise<void> {
    return simulateLatency(() => {
      const target = findOrThrow(db.teamRestaurants.find(({ id }) => id === teamRestaurantId), '식당을 찾을 수 없습니다.')
      getMyMember(target.teamId)
      db.teamRestaurants = db.teamRestaurants.filter(({ id }) => id !== teamRestaurantId)
      db.reviews = db.reviews.filter((review) => review.teamRestaurantId !== teamRestaurantId)
    })
  },
}
