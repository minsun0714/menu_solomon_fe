import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'

export function useTeamPreviewQuery(inviteToken: string) {
  return useQuery({
    queryKey: queryKeys.team.preview(inviteToken),
    queryFn: () => teamService.getTeamByInviteToken(inviteToken),
  })
}
