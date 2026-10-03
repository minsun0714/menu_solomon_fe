export const DATE_FORMATS = {
  DATE: 'yyyy.MM.dd',
  DATE_TIME: 'yyyy.MM.dd HH:mm',
  TIME: 'HH:mm',
  MONTH_DAY_WEEKDAY: 'M월 d일 (E)',
} as const

export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]

export const MS_PER_SECOND = 1000
export const MS_PER_MINUTE = 60 * MS_PER_SECOND
export const MS_PER_HOUR = 60 * MS_PER_MINUTE
export const MS_PER_DAY = 24 * MS_PER_HOUR
export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const
