import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/auth/useAuth'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useMyTeamsQuery() {
  const { user } = useAuth()
  return useQuery({ queryKey: queryKeys.team.mine, queryFn: teamService.getMyTeams, enabled: user !== null })
}
