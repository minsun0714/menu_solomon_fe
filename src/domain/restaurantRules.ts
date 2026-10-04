export const ALL_CATEGORIES = 'ALL'
export const RESTAURANT_SORT = {
  RATING_DESC: 'RATING_DESC',
  LATEST: 'LATEST',
  NAME: 'NAME',
} as const

export type RestaurantSort = (typeof RESTAURANT_SORT)[keyof typeof RESTAURANT_SORT]

export const RESTAURANT_SORT_LABEL: Record<RestaurantSort, string> = {
  RATING_DESC: '별점 높은 순 ★',
  LATEST: '최근 등록 순',
  NAME: '이름 순',
}

export type RestaurantCategoryCount = { category: string; count: number }

export function getRestaurantCategoryCounts(categoryCounts: Record<string, number>): RestaurantCategoryCount[] {
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category, 'ko'))
}
