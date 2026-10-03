import { useState } from 'react'
import { HISTORY_PERIOD, type HistoryPeriod } from '@/constants/history'
import { toDateKey, toMonthKey } from '@/lib/date'
import { useMonthlyHistoryQuery, useWeeklyHistoryQuery } from './queries/useHistoryQueries'

export function useLunchHistory(teamId: string) {
  const [period, setPeriod] = useState<HistoryPeriod>(HISTORY_PERIOD.WEEKLY)
  const [today] = useState(() => new Date())
  const isWeekly = period === HISTORY_PERIOD.WEEKLY

  const weekly = useWeeklyHistoryQuery(teamId, toDateKey(today), isWeekly)
  const monthly = useMonthlyHistoryQuery(teamId, toMonthKey(today), !isWeekly)
  const { data: entries = [], isLoading, isError } = isWeekly ? weekly : monthly

  return { period, setPeriod, entries, isLoading, isError }
}
