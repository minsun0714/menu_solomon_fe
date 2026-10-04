import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'
import type { CreateVoteRequest, UpdateVoteRequest } from '@/types/vote'

export function useCreateVoteMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (request: CreateVoteRequest) => voteService.createVote(teamId, request),
    invalidateKeys: () => [queryKeys.vote.sessions(teamId), queryKeys.team.all],
    successMessage: TOAST_MESSAGES.VOTE_CREATED,
  })
}

export function useUpdateVoteMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (request: UpdateVoteRequest) => voteService.updateVote(teamId, sessionId, request),
    invalidateKeys: () => [queryKeys.vote.detail(sessionId), queryKeys.vote.sessions(teamId)],
    successMessage: TOAST_MESSAGES.VOTE_UPDATED,
  })
}

export function useDeleteVoteMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: () => voteService.deleteVote(teamId, sessionId),
    invalidateKeys: () => [queryKeys.vote.sessions(teamId), queryKeys.team.all, queryKeys.history.all],
    successMessage: TOAST_MESSAGES.VOTE_DELETED,
  })
}

export function useRevoteMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: () => voteService.restart(teamId, sessionId),
    invalidateKeys: () => [
      queryKeys.vote.detail(sessionId),
      queryKeys.vote.results(sessionId),
      queryKeys.vote.candidates(sessionId),
      queryKeys.vote.sessions(teamId),
      queryKeys.team.all,
    ],
    successMessage: TOAST_MESSAGES.REVOTE_STARTED,
  })
}
