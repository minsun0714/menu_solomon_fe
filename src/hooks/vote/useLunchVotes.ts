import { VOTE_STATUS } from '@/constants/vote'
import { useTeamPermissions } from '@/hooks/team/useTeamPermissions'
import { useUpdateTeamParticipationMutation } from './mutations/useParticipationMutations'
import { useCreateVoteMutation } from './mutations/useVoteSessionMutations'
import { useTeamParticipationQuery, useVoteSessionsQuery } from './queries/useVoteQueries'

export function useLunchVotes(teamId: string) {
  const { currentMember } = useTeamPermissions(teamId)
  const { data: sessions = [], isLoading: isSessionsLoading, isError } = useVoteSessionsQuery(teamId)
  const { data: participation = [], isLoading: isParticipationLoading } = useTeamParticipationQuery(teamId)
  const { mutate: create, isPending: isCreating } = useCreateVoteMutation(teamId)
  const { mutate: updateParticipation, isPending: isUpdatingParticipation } = useUpdateTeamParticipationMutation(teamId)

  const myParticipation = participation.find(({ teamMemberId }) => teamMemberId === currentMember?.id)
  const activeSessions = sessions.filter(({ status }) => status === VOTE_STATUS.OPEN)
  const pastSessions = sessions.filter(({ status }) => status !== VOTE_STATUS.OPEN)

  return {
    activeSessions,
    pastSessions,
    participants: participation.filter(({ participating }) => participating),
    nonParticipants: participation.filter(({ participating }) => !participating),
    isParticipating: myParticipation?.participating ?? true,
    isLoading: isSessionsLoading || isParticipationLoading,
    isError,
    isCreating,
    isUpdatingParticipation,
    createVote: (closesAt: string, onCreated?: () => void) => create({ closesAt }, { onSuccess: onCreated }),
    setParticipation: (participating: boolean) => updateParticipation(participating),
  }
}
