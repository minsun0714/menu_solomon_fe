import type { Restaurant } from './restaurant'

export type VoteStatus = 'OPEN' | 'CLOSED' | 'CONFIRMED'
export type CandidateSource = 'MANUAL' | 'RECOMMENDED'
export type ConfirmationType = 'AUTO' | 'MANUAL'

export type LunchVoteSession = {
  id: string
  name?: string
  teamId: string
  createdByTeamMemberId: string
  status: VoteStatus
  closesAt: string
  createdAt: string
}

export type LunchParticipant = {
  id: string
  sessionId: string
  teamMemberId: string
  participating: boolean
}

export type LunchCandidate = {
  id: string
  sessionId: string
  restaurantId: string
  source: CandidateSource
}

export type LunchBallot = {
  id: string
  sessionId: string
  candidateId: string
  teamMemberId: string
  createdAt: string
  updatedAt: string
}

export type LunchDecision = {
  id: string
  sessionId: string
  restaurantId: string
  confirmedByTeamMemberId: string | null
  confirmationType: ConfirmationType
  confirmedAt: string
}

export type CandidateDetail = LunchCandidate & {
  restaurant: Restaurant
  averageRating: number
}

export type ParticipantDetail = LunchParticipant & { nickname: string }

export type VoteSessionSummary = LunchVoteSession & {
  creatorNickname: string
  participantCount: number
  candidateCount: number
  ballotCount: number
  myBallotCandidateId: string | null
}

export type VoteResult = {
  candidateId: string
  voteCount: number
  percentage: number
}

export type VoteSessionDetail = {
  session: LunchVoteSession
  creatorNickname: string
  decision: LunchDecision | null
}

export type VoteResultsSnapshot = {
  results: VoteResult[]
  ballots: LunchBallot[]
}

export type CreateVoteRequest = { closesAt: string }
export type UpdateVoteRequest = { closesAt?: string; name?: string }

export type RecommendedCandidate = {
  restaurant: Restaurant
  averageRating: number
  reason: string
}
