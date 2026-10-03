import { History } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { HISTORY_PERIOD, HISTORY_PERIOD_LABEL, type HistoryPeriod } from '@/constants/history'
import { useLunchHistory } from '@/hooks/history/useLunchHistory'
import { HistoryList } from './HistoryList'

export function HistoryTab({ teamId }: { teamId: string }) {
  const { period, setPeriod, entries, isLoading, isError } = useLunchHistory(teamId)
  const handlePeriodChange = (value: string) => setPeriod(value as HistoryPeriod)

  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={handlePeriodChange}>
        <TabsList>
          {Object.values(HISTORY_PERIOD).map((value) => (
            <TabsTrigger key={value} value={value}>{HISTORY_PERIOD_LABEL[value]}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {isLoading ? <ListSkeleton itemClassName="h-16" /> : isError ? <ErrorState /> : entries.length === 0 ? (
        <EmptyState icon={History} title="확정된 점심 기록이 없어요" description="투표로 점심을 확정하면 여기에 기록됩니다." />
      ) : (
        <HistoryList entries={entries} />
      )}
    </div>
  )
}
