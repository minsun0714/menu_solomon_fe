import type { ReviewWithAuthor } from './review'

export type Restaurant = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
}

export type RestaurantSearchPage = {
  items: Restaurant[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
}

export type OfficeLocation = {
  kakaoPlaceId: string
  name: string
  address: string
  latitude: number
  longitude: number
}

export type PlaceSearchPage = {
  items: OfficeLocation[]
  page: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
}

export type TeamRestaurant = {
  id: string
  teamId: string
  restaurantId: string
  registeredByTeamMemberId: string
  createdAt: string
}

export type TeamRestaurantSummary = TeamRestaurant & {
  restaurant: Restaurant
  registeredByNickname: string
  averageRating: number
  reviewCount: number
  latestReview: ReviewWithAuthor | null
}
