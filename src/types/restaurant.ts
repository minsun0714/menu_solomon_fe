export type Restaurant = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
  kakaoPlaceId: string
  kakaoPlaceUrl: string
}

export type OfficeLocation = {
  kakaoPlaceId: string
  name: string
  address: string
  latitude: number
  longitude: number
}

export type Place = OfficeLocation & {
  category: string
  kakaoPlaceUrl: string
}

export type PlaceSearchPage = {
  items: Place[]
  page: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
}

export type TeamRestaurantSummary = {
  id: string
  restaurantId: string
  restaurant: Restaurant
  registeredByNickname: string
  createdAt: string
  averageRating: number
  reviewCount: number
  latestReview: LatestReview | null
}

export type LatestReview = {
  authorNickname: string
  rating: number
  content: string
  updatedAt: string
}

export type TeamRestaurantList = {
  restaurants: TeamRestaurantSummary[]
  totalCount: number
  totalReviewCount: number
  categoryCounts: Record<string, number>
}
