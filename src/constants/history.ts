export const HISTORY_PERIOD = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
} as const

export type HistoryPeriod = (typeof HISTORY_PERIOD)[keyof typeof HISTORY_PERIOD]

export const HISTORY_PERIOD_LABEL = {
  WEEKLY: '이번 주',
  MONTHLY: '이번 달',
} satisfies Record<HistoryPeriod, string>
