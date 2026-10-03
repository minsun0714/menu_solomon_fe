import { useState } from 'react'
import { filterRestaurants, getRestaurantCategoryCounts, ALL_CATEGORIES, RESTAURANT_SORT, type RestaurantSort } from '@/domain/restaurantRules'
import { useAddTeamRestaurantMutation, useDeleteTeamRestaurantMutation } from './mutations/useRestaurantMutations'
import { useRestaurantSearchQuery } from './queries/useRestaurantSearchQuery'
import { useTeamRestaurantsQuery } from './queries/useTeamRestaurantsQuery'

export function useTeamRestaurants(teamId: string) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)
  const [sort, setSort] = useState<RestaurantSort>(RESTAURANT_SORT.RATING_DESC)
  const { data: restaurants = [], isLoading, isError } = useTeamRestaurantsQuery(teamId)
  const { mutate: add, isPending: isAdding } = useAddTeamRestaurantMutation(teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteTeamRestaurantMutation(teamId)

  return {
    restaurants: filterRestaurants(restaurants, keyword, category, sort),
    totalCount: restaurants.length,
    categoryCounts: getRestaurantCategoryCounts(restaurants),
    registeredRestaurantIds: restaurants.map(({ restaurantId }) => restaurantId),
    keyword,
    category,
    sort,
    setKeyword,
    setCategory,
    setSort,
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
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [page, setPage] = useState(1)
  const { data, isFetching } = useRestaurantSearchQuery(submittedKeyword, page)

  const search = () => {
    const nextKeyword = keyword.trim()
    if (!nextKeyword) return
    setPage(1)
    setSubmittedKeyword(nextKeyword)
  }

  const reset = () => {
    setKeyword('')
    setSubmittedKeyword('')
    setPage(1)
  }

  return {
    keyword,
    setKeyword,
    submittedKeyword,
    search,
    reset,
    results: data?.items ?? [],
    pagination: data,
    page,
    setPage,
    isLoading: isFetching,
  }
}
