import { useState, type FormEvent } from 'react'
import { Check, Clock, Pencil, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DATE_FORMATS } from '@/constants/date'
import { MAX_VOTE_NAME_LENGTH, VOTE_STATUS } from '@/constants/vote'
import { useVoteManagement } from '@/hooks/vote/useVoteManagement'
import { formatDate } from '@/lib/date'
import { Countdown } from './Countdown'
import type { LunchVoteSession } from '@/types/vote'

type VoteDetailHeaderProps = {
  session: LunchVoteSession
  creatorNickname: string
  teamId: string
  canEdit: boolean
}

export function VoteDetailHeader({ session, creatorNickname, teamId, canEdit }: VoteDetailHeaderProps) {
  const { id, name, status, closesAt } = session
  const displayName = name ?? `점심 투표 #${id}`
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(displayName)
  const { isPending, updateName } = useVoteManagement(teamId, id)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextName = value.trim()
    if (!nextName) return
    updateName(nextName, () => setIsEditing(false))
  }
  const handleCancel = () => {
    setValue(displayName)
    setIsEditing(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {isEditing ? (
          <form className="flex items-center gap-1" onSubmit={handleSubmit}>
            <Input
              value={value}
              maxLength={MAX_VOTE_NAME_LENGTH}
              className="h-9 w-64 text-base font-semibold"
              autoFocus
              onChange={(event) => setValue(event.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="size-8" disabled={!value.trim() || isPending} aria-label="투표 이름 저장"><Check /></Button>
            <Button type="button" variant="ghost" size="icon" className="size-8" disabled={isPending} aria-label="투표 이름 수정 취소" onClick={handleCancel}><X /></Button>
          </form>
        ) : (
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {canEdit && (
              <Button variant="ghost" size="icon" className="size-8" aria-label="투표 이름 수정" onClick={() => setIsEditing(true)}><Pencil /></Button>
            )}
          </div>
        )}
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
