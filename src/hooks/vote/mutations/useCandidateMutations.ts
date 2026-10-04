import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { voteService } from '@/services/voteService'
import type { CandidateSource } from '@/types/vote'

type AddCandidateVariables = { kakaoPlaceId: string; source?: CandidateSource }

export function useAddCandidateMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: ({ kakaoPlaceId, source }: AddCandidateVariables) => voteService.addCandidate(teamId, sessionId, kakaoPlaceId, source),
    invalidateKeys: () => [
      queryKeys.vote.candidates(sessionId),
      queryKeys.vote.results(sessionId),
      queryKeys.vote.recommended(sessionId),
      queryKeys.vote.sessions(teamId),
    ],
    successMessage: TOAST_MESSAGES.CANDIDATE_ADDED,
  })
}

export function useDeleteCandidateMutation(sessionId: string, teamId: string) {
  return useAppMutation({
    mutationFn: (candidateId: string) => voteService.deleteCandidate(teamId, sessionId, candidateId),
    invalidateKeys: () => [
      queryKeys.vote.candidates(sessionId),
      queryKeys.vote.results(sessionId),
      queryKeys.vote.recommended(sessionId),
      queryKeys.vote.sessions(teamId),
    ],
    successMessage: TOAST_MESSAGES.CANDIDATE_DELETED,
  })
}
