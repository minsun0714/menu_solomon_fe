import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/queries/queryKeys'
import { historyService } from '@/services/historyService'

export function useWeeklyHistoryQuery(teamId: string, date: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.history.weekly(teamId, date),
    queryFn: () => historyService.getWeeklyHistory(teamId, date),
    enabled,
  })
}

export function useMonthlyHistoryQuery(teamId: string, month: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.history.monthly(teamId, month),
    queryFn: () => historyService.getMonthlyHistory(teamId, month),
    enabled,
  })
}
