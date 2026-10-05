import { Badge } from '@/components/ui/badge'
import { CONFIRMATION_TYPE, CONFIRMATION_TYPE_LABEL } from '@/constants/vote'
import { DATE_FORMATS } from '@/constants/date'
import { formatDate } from '@/lib/date'
import type { LunchHistoryEntry } from '@/types/history'

type HistoryListProps = {
  entries: LunchHistoryEntry[]
}

export function HistoryList({ entries }: HistoryListProps) {
  return (
    <ul className="divide-y border-y bg-card">
      {entries.map(({ decisionId, sessionId, confirmedAt, restaurant, confirmationType, confirmedByNickname }) => (
        <li key={decisionId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="space-y-0.5">
            <p className="font-medium">{restaurant.name} <Badge variant="outline">{restaurant.category}</Badge></p>
            <p className="text-xs text-muted-foreground">
              {formatDate(confirmedAt, DATE_FORMATS.MONTH_DAY_WEEKDAY)} · 투표 #{sessionId}
              {confirmedByNickname && ` · ${confirmedByNickname} 확정`}
            </p>
          </div>
          <Badge variant={confirmationType === CONFIRMATION_TYPE.AUTO ? 'secondary' : 'default'}>{CONFIRMATION_TYPE_LABEL[confirmationType]}</Badge>
        </li>
      ))}
    </ul>
  )
}
