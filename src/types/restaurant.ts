export type Restaurant = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
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
}
