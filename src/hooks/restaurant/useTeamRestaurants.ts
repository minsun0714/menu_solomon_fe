import { useState } from 'react'
import { filterRestaurants, getRestaurantCategories, ALL_CATEGORIES } from '@/domain/restaurantRules'
import { useAddTeamRestaurantMutation, useDeleteTeamRestaurantMutation } from './mutations/useRestaurantMutations'
import { useRestaurantSearchQuery } from './queries/useRestaurantSearchQuery'
import { useTeamRestaurantsQuery } from './queries/useTeamRestaurantsQuery'

export function useTeamRestaurants(teamId: string) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)
  const { data: restaurants = [], isLoading, isError } = useTeamRestaurantsQuery(teamId)
  const { mutate: add, isPending: isAdding } = useAddTeamRestaurantMutation(teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteTeamRestaurantMutation(teamId)

  return {
    restaurants: filterRestaurants(restaurants, keyword, category),
    totalCount: restaurants.length,
    categories: getRestaurantCategories(restaurants),
    registeredRestaurantIds: restaurants.map(({ restaurantId }) => restaurantId),
    keyword,
    category,
    setKeyword,
    setCategory,
    isLoading,
    isError,
    isAdding,
    isDeleting,
    addRestaurant: (restaurantId: string, onAdded?: () => void) => add(restaurantId, { onSuccess: onAdded }),
    deleteRestaurant: (teamRestaurantId: string) => remove(teamRestaurantId),
  }
}

export function useRestaurantCatalogSearch() {
  const [keyword, setKeyword] = useState('')
  const { data: results = [], isLoading } = useRestaurantSearchQuery(keyword)
  return { keyword, setKeyword, results, isLoading }
}
