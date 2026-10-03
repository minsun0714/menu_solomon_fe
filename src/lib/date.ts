import { DATE_FORMATS, MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE, MS_PER_SECOND, WEEKDAY_LABELS, type DateFormat } from '@/constants/date'

const pad = (value: number) => String(value).padStart(2, '0')

export function formatDate(iso: string, format: DateFormat = DATE_FORMATS.DATE): string {
  const date = new Date(iso)
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const HH = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const weekday = WEEKDAY_LABELS[date.getDay()]

  return format
    .replace('yyyy', String(yyyy))
    .replace('MM', MM)
    .replace('dd', dd)
    .replace('HH', HH)
    .replace('mm', mm)
    .replace('M월', `${date.getMonth() + 1}월`)
    .replace('d일', `${date.getDate()}일`)
    .replace('E', weekday)
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * MS_PER_HOUR)
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

export function diffMs(targetIso: string, now: number): number {
  return new Date(targetIso).getTime() - now
}

export function formatRemaining(remainingMs: number): string {
  if (remainingMs <= 0) return '마감됨'
  const hours = Math.floor(remainingMs / MS_PER_HOUR)
  const minutes = Math.floor((remainingMs % MS_PER_HOUR) / MS_PER_MINUTE)
  const seconds = Math.floor((remainingMs % MS_PER_MINUTE) / MS_PER_SECOND)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function toDateTimeLocalValue(iso: string): string {
  const date = new Date(iso)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  result.setDate(result.getDate() - result.getDay())
  return result
}

export function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function toDateKey(date: Date): string {
  return `${toMonthKey(date)}-${pad(date.getDate())}`
}
