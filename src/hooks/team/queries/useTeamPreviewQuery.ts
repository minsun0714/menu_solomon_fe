import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useTeamPreviewQuery(inviteCode: string) {
  return useQuery({
    queryKey: queryKeys.team.preview(inviteCode),
    queryFn: () => teamService.getTeamByInviteCode(inviteCode),
  })
}
