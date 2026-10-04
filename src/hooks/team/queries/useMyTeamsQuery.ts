import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

import type { TeamSort } from '@/types/team'

export function useMyTeamsQuery(sort: TeamSort) {
  return useQuery({ queryKey: queryKeys.team.mine(sort), queryFn: () => teamService.getMyTeams(sort) })
}
