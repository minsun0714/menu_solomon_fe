import { api } from '@/lib/api'
import { toNumericId } from '@/lib/ids'
import { CANDIDATE_SOURCE } from '@/constants/vote'
import type {
  CandidateDetail,
  CandidateSource,
  CreateVoteRequest,
  LunchBallot,
  LunchCandidate,
  LunchDecision,
  LunchVoteSession,
  ParticipantDetail,
  RecommendationPage,
  UpdateVoteRequest,
  VoteResultsSnapshot,
  VoteSessionDetail,
  VoteSessionSummary,
} from '@/types/vote'

const votePath = (teamId: string, sessionId?: string) =>
  sessionId === undefined ? `/teams/${teamId}/votes` : `/teams/${teamId}/votes/${sessionId}`

export const voteService = {
  getVoteSessions(teamId: string): Promise<VoteSessionSummary[]> {
    return api.get<VoteSessionSummary[]>(votePath(teamId))
  },

  getVoteSession(teamId: string, sessionId: string): Promise<VoteSessionDetail> {
    return api.get<VoteSessionDetail>(votePath(teamId, sessionId))
  },

  createVote(teamId: string, { name, closesAt }: CreateVoteRequest): Promise<LunchVoteSession> {
    return api.post<LunchVoteSession>(votePath(teamId), { name, closesAt })
  },

  updateVote(teamId: string, sessionId: string, { closesAt, name }: UpdateVoteRequest): Promise<LunchVoteSession> {
    return api.patch<LunchVoteSession>(votePath(teamId, sessionId), { closesAt, name })
  },

  deleteVote(teamId: string, sessionId: string): Promise<void> {
    return api.delete(votePath(teamId, sessionId))
  },

  getParticipants(teamId: string, sessionId: string): Promise<ParticipantDetail[]> {
    return api.get<ParticipantDetail[]>(`${votePath(teamId, sessionId)}/participants`)
  },

  async updateParticipation(teamId: string, sessionId: string, teamMemberId: string, participating: boolean): Promise<void> {
    await api.put(`${votePath(teamId, sessionId)}/participants/${toNumericId(teamMemberId)}`, { participating })
  },

  getCandidates(teamId: string, sessionId: string): Promise<CandidateDetail[]> {
    return api.get<CandidateDetail[]>(`${votePath(teamId, sessionId)}/candidates`)
  },

  addCandidate(
    teamId: string,
    sessionId: string,
    kakaoPlaceId: string,
    source: CandidateSource = CANDIDATE_SOURCE.MANUAL,
  ): Promise<LunchCandidate> {
    return api.post<LunchCandidate>(`${votePath(teamId, sessionId)}/candidates`, { kakaoPlaceId, source })
  },

  deleteCandidate(teamId: string, sessionId: string, candidateId: string): Promise<void> {
    return api.delete(`${votePath(teamId, sessionId)}/candidates/${toNumericId(candidateId)}`)
  },

  getRecommendations(teamId: string, sessionId: string, cursor = 0): Promise<RecommendationPage> {
    return api.get<RecommendationPage>(`${votePath(teamId, sessionId)}/recommendations`, { cursor })
  },

  saveBallots(teamId: string, sessionId: string, candidateIds: string[]): Promise<LunchBallot[]> {
    return api.put<LunchBallot[]>(`${votePath(teamId, sessionId)}/ballots/me`, {
      candidateIds: [...new Set(candidateIds.map(toNumericId))],
    })
  },

  deleteBallots(teamId: string, sessionId: string): Promise<void> {
    return api.delete(`${votePath(teamId, sessionId)}/ballots/me`)
  },

  getVoteResults(teamId: string, sessionId: string): Promise<VoteResultsSnapshot> {
    return api.get<VoteResultsSnapshot>(`${votePath(teamId, sessionId)}/results`)
  },

  /** 후보와 참여 상태는 유지하고 표를 초기화한다. */
  restart(teamId: string, sessionId: string): Promise<LunchVoteSession> {
    return api.post<LunchVoteSession>(`${votePath(teamId, sessionId)}/restart`)
  },

  confirmLunch(teamId: string, sessionId: string, restaurantId: string): Promise<LunchDecision> {
    return api.post<LunchDecision>(`${votePath(teamId, sessionId)}/decision`, { restaurantId: toNumericId(restaurantId) })
  },

  updateDecision(teamId: string, sessionId: string, restaurantId: string): Promise<LunchDecision> {
    return api.patch<LunchDecision>(`${votePath(teamId, sessionId)}/decision`, { restaurantId: toNumericId(restaurantId) })
  },

  deleteDecision(teamId: string, sessionId: string): Promise<void> {
    return api.delete(`${votePath(teamId, sessionId)}/decision`)
  },
}
