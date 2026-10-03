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
import type { RestaurantSearchPage, TeamRestaurant, TeamRestaurantSummary } from '@/types/restaurant'

function toSummary(teamRestaurant: TeamRestaurant): TeamRestaurantSummary {
  const restaurant = findOrThrow(db.restaurants.find(({ id }) => id === teamRestaurant.restaurantId), '식당을 찾을 수 없습니다.')
  const reviews = db.reviews.filter(({ teamRestaurantId }) => teamRestaurantId === teamRestaurant.id)
  const latestReview = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
  return {
    ...teamRestaurant,
    restaurant,
    registeredByNickname: getMemberNickname(teamRestaurant.registeredByTeamMemberId),
    averageRating: getAverageRating(reviews),
    reviewCount: reviews.length,
    latestReview: latestReview
      ? { ...latestReview, authorNickname: getMemberNickname(latestReview.teamMemberId) }
      : null,
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

  // 실제 연동 시 이 함수 내부만 백엔드의 카카오 장소 검색 API 호출로 교체합니다.
  // 카카오 REST API 키는 클라이언트 번들에 포함하지 않습니다.
  searchRestaurants(keyword: string, page = 1, pageSize = 5): Promise<RestaurantSearchPage> {
    return simulateLatency(() => {
      const query = keyword.trim().toLowerCase()
      const matches = db.restaurants.filter(
        ({ name, category, address }) =>
          query !== '' && [name, category, address].some((text) => text.toLowerCase().includes(query)),
      )
      const totalCount = matches.length
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
      const currentPage = Math.min(Math.max(page, 1), totalPages)
      const offset = (currentPage - 1) * pageSize

      return {
        items: matches.slice(offset, offset + pageSize),
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
      }
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
