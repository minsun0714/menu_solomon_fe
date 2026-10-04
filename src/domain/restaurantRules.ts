import type { TeamRestaurantSummary } from '@/types/restaurant'

export const ALL_CATEGORIES = 'ALL'
export const RESTAURANT_SORT = {
  RATING_DESC: 'RATING_DESC',
  REVIEW_DESC: 'REVIEW_DESC',
  RECENT: 'RECENT',
  NAME: 'NAME',
} as const

export type RestaurantSort = (typeof RESTAURANT_SORT)[keyof typeof RESTAURANT_SORT]

export const RESTAURANT_SORT_LABEL: Record<RestaurantSort, string> = {
  RATING_DESC: '별점 높은 순 ★',
  REVIEW_DESC: '리뷰 많은 순',
  RECENT: '최근 등록 순',
  NAME: '이름 순',
}

export type RestaurantCategoryCount = { category: string; count: number }

export function getRestaurantCategoryCounts(categoryCounts: Record<string, number>): RestaurantCategoryCount[] {
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category, 'ko'))
}

export function filterRestaurants(
  restaurants: TeamRestaurantSummary[],
  keyword: string,
  category: string,
  sort: RestaurantSort,
): TeamRestaurantSummary[] {
  const query = keyword.trim().toLowerCase()
  const filtered = restaurants.filter(({ restaurant }) => {
    const matchesCategory = category === ALL_CATEGORIES || restaurant.category === category
    const matchesKeyword =
      query === '' || [restaurant.name, restaurant.category, restaurant.address].some((value) => value.toLowerCase().includes(query))
    return matchesCategory && matchesKeyword
  })

  return [...filtered].sort((a, b) => {
    if (sort === RESTAURANT_SORT.RATING_DESC) return b.averageRating - a.averageRating || b.reviewCount - a.reviewCount
    if (sort === RESTAURANT_SORT.REVIEW_DESC) return b.reviewCount - a.reviewCount || b.averageRating - a.averageRating
    if (sort === RESTAURANT_SORT.RECENT) return b.createdAt.localeCompare(a.createdAt)
    return a.restaurant.name.localeCompare(b.restaurant.name, 'ko')
  })
}
