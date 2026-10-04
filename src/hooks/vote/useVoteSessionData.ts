import { useTeamPermissions } from '@/hooks/team/useTeamPermissions'
import { getVoteWinners, isVoteTied } from '@/domain/voteRules'
import { useCandidatesQuery, useVoteResultsQuery, useVoteSessionQuery } from './queries/useVoteQueries'

/** Cache-backed session data shared by the vote feature hooks. */
export function useVoteSessionData(teamId: string, sessionId: string) {
  const { data: detail, isLoading: isSessionLoading, isError: isSessionError } = useVoteSessionQuery(teamId, sessionId)
  const { data: candidates = [], isLoading: isCandidatesLoading } = useCandidatesQuery(teamId, sessionId)
  const { data: snapshot, isLoading: isResultsLoading } = useVoteResultsQuery(teamId, sessionId)
  const { currentMember, isLoading: isMemberLoading } = useTeamPermissions(teamId)

  const { session, creatorNickname, decision = null } = detail ?? {}
  const { results = [], ballots = [] } = snapshot ?? {}

  const winners = getVoteWinners(results)
  const winnerCandidates = candidates.filter(({ id }) => winners.some(({ candidateId }) => candidateId === id))
  const currentUserBallots = ballots.filter(({ teamMemberId }) => teamMemberId === currentMember?.id)
  const isCreator = Boolean(session) && session?.createdByTeamMemberId === currentMember?.id

  return {
    session,
    creatorNickname,
    decision,
    candidates,
    results,
    ballots,
    winnerCandidates,
    isTied: isVoteTied(winners),
    currentMember,
    currentUserBallots,
    isCreator,
    isLoading: isSessionLoading || isCandidatesLoading || isResultsLoading || isMemberLoading,
    isError: isSessionError,
  }
}
