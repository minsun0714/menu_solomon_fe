import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { teamService } from '@/services/teamService'
import { analytics } from '@/lib/analytics'
import type { TeamRequest } from '@/types/team'

export function useCreateTeamMutation() {
  return useAppMutation({
    mutationFn: (request: TeamRequest) => teamService.createTeam(request),
    invalidateKeys: () => [queryKeys.team.all],
    trackSuccess: ({ id }) => analytics.track('team_created', { team_id: id }),
    successMessage: TOAST_MESSAGES.TEAM_CREATED,
  })
}

export function useJoinTeamMutation(inviteCode: string) {
  return useAppMutation({
    mutationFn: () => teamService.joinTeam(inviteCode),
    invalidateKeys: (_, { teamId }) => [queryKeys.team.all, queryKeys.team.members(teamId)],
    trackSuccess: ({ teamId }) => analytics.track('team_joined', { team_id: teamId }),
    successMessage: TOAST_MESSAGES.TEAM_JOINED,
  })
}

export function useUpdateTeamMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (request: TeamRequest) => teamService.updateTeam(teamId, request),
    invalidateKeys: () => [queryKeys.team.detail(teamId), queryKeys.team.all],
    successMessage: TOAST_MESSAGES.TEAM_UPDATED,
  })
}

export function useLeaveTeamMutation(teamId: string) {
  return useAppMutation({
    mutationFn: () => teamService.leaveTeam(teamId),
    invalidateKeys: () => [queryKeys.team.all],
    successMessage: TOAST_MESSAGES.TEAM_LEFT,
  })
}

export function useTransferAdminMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (memberId: string) => teamService.transferAdmin(teamId, memberId),
    invalidateKeys: () => [queryKeys.team.members(teamId), queryKeys.team.all],
    successMessage: TOAST_MESSAGES.ADMIN_TRANSFERRED,
  })
}

export function useTransferAdminAndLeaveMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (memberId: string) => teamService.transferAdminAndLeave(teamId, memberId),
    invalidateKeys: () => [queryKeys.team.all, queryKeys.team.members(teamId)],
    successMessage: TOAST_MESSAGES.TEAM_LEFT,
  })
}

export function useRegenerateInviteCodeMutation(teamId: string) {
  return useAppMutation({
    mutationFn: () => teamService.regenerateInviteCode(teamId),
    invalidateKeys: () => [queryKeys.team.invite(teamId)],
    successMessage: TOAST_MESSAGES.INVITE_REGENERATED,
  })
}

export function useDeleteTeamMutation(teamId: string) {
  return useAppMutation({
    mutationFn: () => teamService.deleteTeam(teamId),
    invalidateKeys: () => [queryKeys.team.all],
    successMessage: TOAST_MESSAGES.TEAM_DELETED,
  })
}
