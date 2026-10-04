import { api } from '@/lib/api'
import type { LunchHistoryEntry } from '@/types/history'

export const historyService = {
  getWeeklyHistory(teamId: string, date: string): Promise<LunchHistoryEntry[]> {
    return api.get<LunchHistoryEntry[]>(`/teams/${teamId}/lunch-history`, { view: 'WEEK', date })
  },

  getMonthlyHistory(teamId: string, month: string): Promise<LunchHistoryEntry[]> {
    return api.get<LunchHistoryEntry[]>(`/teams/${teamId}/lunch-history`, { view: 'MONTH', month })
  },
}
