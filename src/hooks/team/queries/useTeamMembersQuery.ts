import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useTeamMembersQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.team.members(teamId), queryFn: () => teamService.getTeamMembers(teamId) })
}
