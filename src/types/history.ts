import type { Restaurant } from './restaurant'
import type { ConfirmationType } from './vote'

export type LunchHistoryEntry = {
  decisionId: string
  sessionId: string
  confirmedAt: string
  restaurant: Restaurant
  confirmationType: ConfirmationType
  confirmedByNickname: string | null
}
