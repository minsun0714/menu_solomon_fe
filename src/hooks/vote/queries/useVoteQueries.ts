import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'

export function useVoteSessionsQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.vote.sessions(teamId), queryFn: () => voteService.getVoteSessions(teamId) })
}

export function useVoteSessionQuery(sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.detail(sessionId), queryFn: () => voteService.getVoteSession(sessionId) })
}

export function useParticipantsQuery(sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.participants(sessionId), queryFn: () => voteService.getParticipants(sessionId) })
}

export function useTeamParticipationQuery(teamId: string) {
  return useQuery({
    queryKey: queryKeys.vote.teamParticipation(teamId),
    queryFn: () => voteService.getTeamParticipation(teamId),
  })
}

export function useCandidatesQuery(sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.candidates(sessionId), queryFn: () => voteService.getCandidates(sessionId) })
}

export function useRecommendedCandidatesQuery(sessionId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.vote.recommended(sessionId),
    queryFn: () => voteService.getRecommendedCandidates(sessionId),
    enabled,
  })
}

export function useVoteResultsQuery(sessionId: string) {
  return useQuery({ queryKey: queryKeys.vote.results(sessionId), queryFn: () => voteService.getVoteResults(sessionId) })
}
