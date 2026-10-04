import { VOTE_STATUS } from '@/constants/vote'
import { useCreateVoteMutation } from './mutations/useVoteSessionMutations'
import { useVoteSessionsQuery } from './queries/useVoteQueries'

export function useLunchVotes(teamId: string) {
  const { data: sessions = [], isLoading, isError } = useVoteSessionsQuery(teamId)
  const { mutate: create, isPending: isCreating } = useCreateVoteMutation(teamId)

  const activeSessions = sessions.filter(({ status }) => status === VOTE_STATUS.OPEN)
  const pastSessions = sessions.filter(({ status }) => status !== VOTE_STATUS.OPEN)

  return {
    activeSessions,
    pastSessions,
    isLoading,
    isError,
    isCreating,
    createVote: (name: string | undefined, closesAt: string, onCreated?: () => void) => create({ name, closesAt }, { onSuccess: onCreated }),
  }
}
