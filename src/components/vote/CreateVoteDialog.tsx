import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_VOTE_DURATION_HOURS, MAX_VOTE_NAME_LENGTH } from '@/constants/vote'
import { addHoursToNow } from '@/domain/voteRules'
import { getFieldError } from '@/lib/api'
import { getMinimumClosingTimeLocalValue, isValidClosingTime, toDateTimeLocalValue } from '@/lib/date'

const CLOSING_TIME_ERROR = '마감 시간은 현재 시각보다 최소 1분 이후로 설정해 주세요.'

type CreateVoteDialogProps = {
  trigger: ReactNode
  isSubmitting: boolean
  onSubmit: (name: string | undefined, closesAt: string, onDone: () => void, onError: (error: Error) => void) => void
}

export function CreateVoteDialog({ trigger, isSubmitting, onSubmit }: CreateVoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [closesAt, setClosesAt] = useState(() => toDateTimeLocalValue(addHoursToNow()))
  const [minimumClosesAt, setMinimumClosesAt] = useState(() => getMinimumClosingTimeLocalValue())
  const [closesAtError, setClosesAtError] = useState<string | null>(null)
  const trimmedName = name.trim()
  const isValid = closesAt !== '' && !closesAtError

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName('')
      setClosesAt(toDateTimeLocalValue(addHoursToNow()))
      setMinimumClosesAt(getMinimumClosingTimeLocalValue())
      setClosesAtError(null)
    }
    setOpen(next)
  }
  const handleSubmit = () => {
    if (!isValidClosingTime(closesAt)) {
      setMinimumClosesAt(getMinimumClosingTimeLocalValue())
      setClosesAtError(CLOSING_TIME_ERROR)
      return
    }
    onSubmit(
      trimmedName || undefined,
      new Date(closesAt).toISOString(),
      () => setOpen(false),
      (error) => setClosesAtError(getFieldError(error, 'closesAt') ?? error.message),
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 투표 만들기</DialogTitle>
          <DialogDescription>마감 시간을 정해 주세요. 투표 이름은 선택 사항이며 기본 마감은 {DEFAULT_VOTE_DURATION_HOURS}시간 뒤입니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vote-name">투표 이름 <span className="text-muted-foreground">(선택)</span></Label>
            <Input
              id="vote-name"
              value={name}
              maxLength={MAX_VOTE_NAME_LENGTH}
              placeholder="예: 오늘 점심 뭐 먹지?"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vote-closes-at">마감 시간</Label>
            <Input
              id="vote-closes-at"
              type="datetime-local"
              min={minimumClosesAt}
              value={closesAt}
              onChange={(event) => {
                setClosesAt(event.target.value)
                setMinimumClosesAt(getMinimumClosingTimeLocalValue())
                setClosesAtError(null)
              }}
            />
            {closesAtError && <p className="text-xs text-destructive">{closesAtError}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!isValid || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? '생성 중...' : '투표 만들기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
