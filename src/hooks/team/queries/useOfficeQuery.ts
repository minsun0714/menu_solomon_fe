import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { officeService } from '@/services/officeService'

export function useOfficeQuery(teamId: string) {
  return useQuery({ queryKey: queryKeys.team.office(teamId), queryFn: () => officeService.getOffice(teamId) })
}
