import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useTeamInviteQuery(teamId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.team.invite(teamId),
    queryFn: () => teamService.getTeamInvite(teamId),
    enabled,
  })
}
