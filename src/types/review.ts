export type Review = {
  id: string
  teamRestaurantId?: string
  rating: number
  content: string
  authorNickname: string
  createdAt: string
  updatedAt: string
}

export type ReviewWithAuthor = Review & { isMine: boolean }

export type ReviewRequest = {
  rating: number
  content: string
}
