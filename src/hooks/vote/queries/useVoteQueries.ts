import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

export function useVoteSessionsQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.vote.sessions(teamId), queryFn: () => voteService.getVoteSessions(teamId) })
}

export function useVoteSessionQuery(teamId: string, sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.detail(sessionId), queryFn: () => voteService.getVoteSession(teamId, sessionId) })
}

export function useVoteParticipantsQuery(teamId: string, sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.participants(sessionId), queryFn: () => voteService.getParticipants(teamId, sessionId) })
}

export function useCandidatesQuery(teamId: string, sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.candidates(sessionId), queryFn: () => voteService.getCandidates(teamId, sessionId) })
}

export function useRecommendedCandidatesQuery(teamId: string, sessionId: string, enabled: boolean, cursor = 0) {
  return useQuery({
    queryKey: [...queryKeys.vote.recommended(sessionId), cursor],
    queryFn: async () => (await voteService.getRecommendations(teamId, sessionId, cursor)).items,
    enabled,
  })
}

export function useVoteResultsQuery(teamId: string, sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.results(sessionId), queryFn: () => voteService.getVoteResults(teamId, sessionId) })
}
