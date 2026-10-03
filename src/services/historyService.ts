import { MS_PER_DAY } from '@/constants/date'
import { startOfWeek, toMonthKey } from '@/lib/date'
import { db, getMemberNickname, simulateLatency } from '@/mocks/api/db'
import type { LunchHistoryEntry } from '@/types/history'

function getTeamHistory(teamId: string): LunchHistoryEntry[] {
  const sessionIds = db.sessions.filter((session) => session.teamId === teamId).map(({ id }) => id)
  return db.decisions
    .filter(({ sessionId }) => sessionIds.includes(sessionId))
    .flatMap((decision) => {
      const restaurant = db.restaurants.find(({ id }) => id === decision.restaurantId)
      if (!restaurant) return []
      return [
        {
          decisionId: decision.id,
          sessionId: decision.sessionId,
          confirmedAt: decision.confirmedAt,
          restaurant,
          confirmationType: decision.confirmationType,
          confirmedByNickname: decision.confirmedByTeamMemberId ? getMemberNickname(decision.confirmedByTeamMemberId) : null,
        },
      ]
    })
    .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt))
}

export const historyService = {
  getWeeklyHistory(teamId: string, date: string): Promise<LunchHistoryEntry[]> {
    return simulateLatency(() => {
      const weekStart = startOfWeek(new Date(date)).getTime()
      const weekEnd = weekStart + 7 * MS_PER_DAY
      return getTeamHistory(teamId).filter(({ confirmedAt }) => {
        const time = new Date(confirmedAt).getTime()
        return time >= weekStart && time < weekEnd
      })
    })
  },

  getMonthlyHistory(teamId: string, month: string): Promise<LunchHistoryEntry[]> {
    return simulateLatency(() =>
      getTeamHistory(teamId).filter(({ confirmedAt }) => toMonthKey(new Date(confirmedAt)) === month),
    )
  },
}
