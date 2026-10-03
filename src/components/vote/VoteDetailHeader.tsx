import { Clock, UserRound } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DATE_FORMATS } from '@/constants/date'
import { VOTE_STATUS } from '@/constants/vote'
import { formatDate } from '@/lib/date'
import { Countdown } from './Countdown'
import type { LunchVoteSession } from '@/types/vote'

type VoteDetailHeaderProps = {
  session: LunchVoteSession
  creatorNickname: string
}

export function VoteDetailHeader({ session, creatorNickname }: VoteDetailHeaderProps) {
  const { id, status, closesAt } = session

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">점심 투표 #{id}</h1>
        <StatusBadge status={status} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><UserRound className="size-4" />{creatorNickname}</span>
        <span className="flex items-center gap-1"><Clock className="size-4" />{formatDate(closesAt, DATE_FORMATS.DATE_TIME)} 마감</span>
        <Countdown closesAt={closesAt} isActive={status === VOTE_STATUS.OPEN} />
      </div>
    </div>
  )
}
