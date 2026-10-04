import { TOAST_MESSAGES } from '@/constants/messages'
import { useAppMutation } from '@/hooks/shared/useAppMutation'
import { queryKeys } from '@/queries/queryKeys'
import { officeService } from '@/services/officeService'
import type { OfficeLocation } from '@/types/restaurant'

export function useSaveOfficeMutation(teamId: string) {
  return useAppMutation({
    mutationFn: (office: OfficeLocation) => officeService.saveOffice(teamId, office),
    invalidateKeys: () => [queryKeys.team.office(teamId)],
    successMessage: TOAST_MESSAGES.OFFICE_SAVED,
  })
}
