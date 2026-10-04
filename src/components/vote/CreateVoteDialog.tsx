import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_VOTE_DURATION_HOURS, MAX_VOTE_NAME_LENGTH } from '@/constants/vote'
import { addHoursToNow } from '@/domain/voteRules'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/lib/date'

type CreateVoteDialogProps = {
  trigger: ReactNode
  isSubmitting: boolean
  onSubmit: (name: string | undefined, closesAt: string, onDone: () => void) => void
}

export function CreateVoteDialog({ trigger, isSubmitting, onSubmit }: CreateVoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [closesAt, setClosesAt] = useState(() => toDateTimeLocalValue(addHoursToNow()))
  const [validationNow, setValidationNow] = useState(0)
  const trimmedName = name.trim()
  const isFuture = closesAt !== '' && new Date(closesAt).getTime() > validationNow
  const isValid = isFuture

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName('')
      setClosesAt(toDateTimeLocalValue(addHoursToNow()))
      setValidationNow(Date.now())
    }
    setOpen(next)
  }
  const handleSubmit = () => {
    if (!isValid) return
    onSubmit(trimmedName || undefined, fromDateTimeLocalValue(closesAt), () => setOpen(false))
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
              value={closesAt}
              onChange={(event) => {
                setClosesAt(event.target.value)
                setValidationNow(Date.now())
              }}
            />
            {!isFuture && <p className="text-xs text-destructive">현재 시간 이후로 설정해 주세요.</p>}
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
