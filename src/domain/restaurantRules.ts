import type { TeamRestaurantSummary } from '@/types/restaurant'

export const ALL_CATEGORIES = 'ALL'

export function getRestaurantCategories(restaurants: TeamRestaurantSummary[]): string[] {
  return [...new Set(restaurants.map(({ restaurant }) => restaurant.category))].sort()
}

export function filterRestaurants(
  restaurants: TeamRestaurantSummary[],
  keyword: string,
  category: string,
): TeamRestaurantSummary[] {
  const query = keyword.trim().toLowerCase()
  return restaurants.filter(({ restaurant }) => {
    const matchesCategory = category === ALL_CATEGORIES || restaurant.category === category
    const matchesKeyword =
      query === '' || restaurant.name.toLowerCase().includes(query) || restaurant.address.toLowerCase().includes(query)
    return matchesCategory && matchesKeyword
  })
}
