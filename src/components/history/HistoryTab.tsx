import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { HISTORY_PERIOD, HISTORY_PERIOD_LABEL, type HistoryPeriod } from '@/constants/history'
import { ROUTES } from '@/constants/routes'
import { VOTE_STATUS } from '@/constants/vote'
import { useLunchHistory } from '@/hooks/history/useLunchHistory'
import { useLunchVotes } from '@/hooks/vote/useLunchVotes'
import { HistoryCalendar } from './HistoryCalendar'
import { VoteHistoryDialog } from './VoteHistoryDialog'

export function HistoryTab({ teamId }: { teamId: string }) {
  const navigate = useNavigate()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const { period, setPeriod, entries, referenceDate, isLoading, isError } = useLunchHistory(teamId)
  const { pastSessions, isLoading: isVotesLoading, isError: isVotesError } = useLunchVotes(teamId)
  const unresolvedSessions = pastSessions.filter(({ status }) => status === VOTE_STATUS.CLOSED)
  const handlePeriodChange = (value: string) => setPeriod(value as HistoryPeriod)

  return (
    <div className="space-y-6">
      {!isVotesLoading && !isVotesError && unresolvedSessions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertCircle className="size-4" />
          <span className="font-medium">확정 대기 {unresolvedSessions.length}건</span>
          {unresolvedSessions.map(({ id }) => (
            <Button key={id} variant="outline" size="sm" className="h-7 bg-card" onClick={() => navigate(ROUTES.VOTE_DETAIL(teamId, id))}>
              투표 #{id} 확인
            </Button>
          ))}
        </div>
      )}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">확정된 점심</h2>
        <Tabs value={period} onValueChange={handlePeriodChange}>
          <TabsList>
            {Object.values(HISTORY_PERIOD).map((value) => (
              <TabsTrigger key={value} value={value}>{HISTORY_PERIOD_LABEL[value]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isLoading ? <ListSkeleton itemClassName="h-72" /> : isError ? <ErrorState /> : (
          <HistoryCalendar period={period} referenceDate={referenceDate} entries={entries} onOpenVote={setSelectedSessionId} />
        )}
      </section>
      {selectedSessionId && (
        <VoteHistoryDialog
          teamId={teamId}
          sessionId={selectedSessionId}
          open
          onOpenChange={(open) => !open && setSelectedSessionId(null)}
        />
      )}
    </div>
  )
}
