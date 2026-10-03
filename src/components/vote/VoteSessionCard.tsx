import { CheckCircle2, Clock, Users, Utensils, Vote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { VOTE_STATUS } from '@/constants/vote'
import { DATE_FORMATS } from '@/constants/date'
import { formatDate } from '@/lib/date'
import { Countdown } from './Countdown'
import type { VoteSessionSummary } from '@/types/vote'

type VoteSessionCardProps = {
  session: VoteSessionSummary
  onOpen: (sessionId: string) => void
}

export function VoteSessionCard({ session, onOpen }: VoteSessionCardProps) {
  const { id, status, creatorNickname, closesAt, participantCount, candidateCount, ballotCount, myBallotCandidateId } = session
  const hasVoted = myBallotCandidateId !== null

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            점심 투표 #{id}
            <StatusBadge status={status} />
          </CardTitle>
          <p className="text-sm text-muted-foreground">{creatorNickname}님이 만든 투표</p>
        </div>
        <Countdown closesAt={closesAt} isActive={status === VOTE_STATUS.OPEN} />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-4" />{formatDate(closesAt, DATE_FORMATS.DATE_TIME)} 마감</span>
          <span className="flex items-center gap-1"><Users className="size-4" />참여 {participantCount}</span>
          <span className="flex items-center gap-1"><Utensils className="size-4" />후보 {candidateCount}</span>
          <span className="flex items-center gap-1"><Vote className="size-4" />투표 {ballotCount}</span>
          {hasVoted && <span className="flex items-center gap-1 text-primary"><CheckCircle2 className="size-4" />투표 완료</span>}
        </div>
        <Button size="sm" variant={hasVoted ? 'outline' : 'default'} onClick={() => onOpen(id)}>
          {hasVoted ? '내 투표 보기' : '투표하러 가기'}
        </Button>
      </CardContent>
    </Card>
  )
}
