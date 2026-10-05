import { Badge } from '@/components/ui/badge'
import { HISTORY_PERIOD, type HistoryPeriod } from '@/constants/history'
import { WEEKDAY_LABELS } from '@/constants/date'
import { addDays, startOfWeek, toDateKey } from '@/lib/date'
import { cn } from '@/lib/cn'
import type { LunchHistoryEntry } from '@/types/history'

type HistoryCalendarProps = {
  period: HistoryPeriod
  referenceDate: Date
  entries: LunchHistoryEntry[]
  onOpenVote: (sessionId: string) => void
}

function entriesByDate(entries: LunchHistoryEntry[]) {
  return entries.reduce<Record<string, LunchHistoryEntry[]>>((grouped, entry) => {
    const key = toDateKey(new Date(entry.confirmedAt))
    grouped[key] = [...(grouped[key] ?? []), entry]
    return grouped
  }, {})
}

export function HistoryCalendar({ period, referenceDate, entries, onOpenVote }: HistoryCalendarProps) {
  const weekly = period === HISTORY_PERIOD.WEEKLY
  const firstDate = weekly
    ? startOfWeek(referenceDate)
    : startOfWeek(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1))
  const days = Array.from({ length: weekly ? 7 : 42 }, (_, index) => addDays(firstDate, index))
  const groupedEntries = entriesByDate(entries)
  const todayKey = toDateKey(new Date())
  const currentMonth = referenceDate.getMonth()
  const weekEnd = days[6]
  const title = weekly
    ? `${referenceDate.getFullYear()}년 ${firstDate.getMonth() + 1}월 ${firstDate.getDate()}일 – ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`
    : `${referenceDate.getFullYear()}년 ${referenceDate.getMonth() + 1}월`

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="overflow-x-auto rounded-md border bg-card">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-b bg-muted/40">
            {WEEKDAY_LABELS.map((label, index) => (
              <div
                key={label}
                className={cn(
                  'px-2 py-2 text-center text-xs font-medium text-muted-foreground',
                  index === 0 && 'text-destructive',
                  index === 6 && 'text-blue-600',
                )}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((date) => {
              const dateKey = toDateKey(date)
              const dayEntries = groupedEntries[dateKey] ?? []
              const isOutsideMonth = !weekly && date.getMonth() !== currentMonth
              const isToday = dateKey === todayKey

              return (
                <div
                  key={dateKey}
                  className={cn(
                    'min-h-28 border-r border-b p-2 last:border-r-0',
                    weekly && 'min-h-40',
                    isOutsideMonth && 'bg-muted/30 text-muted-foreground',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={cn('text-xs font-medium', isToday && 'flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground')}>
                      {date.getDate()}
                    </span>
                    {dayEntries.length > 1 && <span className="text-[10px] text-muted-foreground">{dayEntries.length}건</span>}
                  </div>
                  <div className="grid gap-1.5">
                    {dayEntries.map(({ decisionId, sessionId, restaurant }) => (
                      <button
                        key={decisionId}
                        type="button"
                        className="cursor-pointer rounded-md bg-primary/10 px-2 py-1.5 text-left text-xs text-primary transition-colors hover:bg-primary/20"
                        onClick={() => onOpenVote(sessionId)}
                      >
                        <p className="truncate font-medium">{restaurant.name}</p>
                        <Badge variant="outline" className="mt-1 bg-card text-[10px]">{restaurant.category}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
