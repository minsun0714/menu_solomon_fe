import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { VOTE_STATUS } from '@/constants/vote'
import { canCastVote, canConfirmLunch, canEditVote, canRevote, isVotingExpired } from '@/domain/voteRules'
import { useNow } from '@/hooks/shared/useNow'
import { diffMs, formatRemaining } from '@/lib/date'
import { queryKeys } from '@/queries/queryKeys'
import { useParticipantsQuery } from './queries/useVoteQueries'
import { useVoteSessionData } from './useVoteSessionData'

export function useVoteSession(teamId: string, sessionId: string) {
  const queryClient = useQueryClient()
  const now = useNow()
  const data = useVoteSessionData(teamId, sessionId)
  const { data: participants = [] } = useParticipantsQuery(sessionId)
  const { session, decision, currentMember, isCreator } = data

  const isParticipating = participants.some(({ teamMemberId, participating }) => teamMemberId === currentMember?.id && participating)
  const remainingMs = session ? diffMs(session.closesAt, now) : 0
  const hasExpiredWhileOpen = Boolean(session) && session?.status === VOTE_STATUS.OPEN && isVotingExpired(session, now)

  useEffect(() => {
    if (!hasExpiredWhileOpen) return
    queryClient.invalidateQueries({ queryKey: queryKeys.vote.detail(sessionId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.vote.sessions(teamId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.team.all })
  }, [hasExpiredWhileOpen, queryClient, sessionId, teamId])

  return {
    ...data,
    participants,
    isParticipating,
    remainingTime: formatRemaining(remainingMs),
    canEdit: session ? canEditVote(session, isCreator) : false,
    canVote: session ? canCastVote(session, isParticipating, now) : false,
    canRevote: session ? canRevote(session, isCreator) : false,
    canConfirm: session ? canConfirmLunch(session, decision, isCreator) : false,
  }
}
