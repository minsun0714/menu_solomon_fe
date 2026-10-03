export type Review = {
  id: string
  teamRestaurantId: string
  teamMemberId: string
  rating: number
  content: string
  createdAt: string
  updatedAt: string
}

export type ReviewWithAuthor = Review & { authorNickname: string }

export type ReviewRequest = {
  rating: number
  content: string
}
