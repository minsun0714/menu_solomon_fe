import { useState } from 'react'
import { getRestaurantCategoryCounts, ALL_CATEGORIES, RESTAURANT_SORT, type RestaurantSort } from '@/domain/restaurantRules'
import { useAddTeamRestaurantMutation, useDeleteTeamRestaurantMutation } from './mutations/useRestaurantMutations'
import { usePlaceSearchQuery } from './queries/usePlaceSearchQuery'
import { useTeamRestaurantsQuery } from './queries/useTeamRestaurantsQuery'

export function useTeamRestaurants(teamId: string) {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)
  const [sort, setSort] = useState<RestaurantSort>(RESTAURANT_SORT.RATING_DESC)
  const { data, isLoading, isError } = useTeamRestaurantsQuery(teamId, keyword, category, sort)
  const restaurants = data?.restaurants ?? []
  const { mutate: add, isPending: isAdding } = useAddTeamRestaurantMutation(teamId)
  const { mutate: remove, isPending: isDeleting } = useDeleteTeamRestaurantMutation(teamId)

  const categoryCounts = getRestaurantCategoryCounts(data?.categoryCounts ?? {})

  return {
    restaurants,
    totalCount: data?.totalCount ?? 0,
    categoryCounts,
    registeredKakaoPlaceIds: restaurants.map(({ restaurant }) => restaurant.kakaoPlaceId),
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
    addRestaurant: (kakaoPlaceId: string, onAdded?: () => void) => add(kakaoPlaceId, { onSuccess: onAdded }),
    deleteRestaurant: (teamRestaurantId: string) => {
      const deletesLastRestaurantInCategory =
        category !== ALL_CATEGORIES && categoryCounts.find((item) => item.category === category)?.count === 1
      remove(teamRestaurantId, {
        onSuccess: () => {
          if (deletesLastRestaurantInCategory) setCategory(ALL_CATEGORIES)
        },
      })
    },
  }
}

export function useRestaurantCatalogSearch() {
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [page, setPage] = useState(1)
  const { data, isFetching } = usePlaceSearchQuery(submittedKeyword, page)

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
