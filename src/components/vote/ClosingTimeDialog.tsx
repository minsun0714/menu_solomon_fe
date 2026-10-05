import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getFieldError } from '@/lib/api'
import { getMinimumClosingTimeLocalValue, isValidClosingTime, toDateTimeLocalValue } from '@/lib/date'

const CLOSING_TIME_ERROR = '마감 시간은 현재 시각보다 최소 1분 이후로 설정해 주세요.'

const resolve = (value: string | (() => string)) => (typeof value === 'function' ? value() : value)

type ClosingTimeDialogProps = {
  trigger: ReactNode
  title: string
  description: string
  submitLabel: string
  initialClosesAt: string | (() => string)
  isSubmitting: boolean
  onSubmit: (closesAt: string, onDone: () => void, onError: (error: Error) => void) => void
}

export function ClosingTimeDialog({
  trigger,
  title,
  description,
  submitLabel,
  initialClosesAt,
  isSubmitting,
  onSubmit,
}: ClosingTimeDialogProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(() => toDateTimeLocalValue(resolve(initialClosesAt)))
  const [minimumClosesAt, setMinimumClosesAt] = useState(() => getMinimumClosingTimeLocalValue())
  const [closesAtError, setClosesAtError] = useState<string | null>(null)
  const isValid = value !== '' && !closesAtError

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setValue(toDateTimeLocalValue(resolve(initialClosesAt)))
      setMinimumClosesAt(getMinimumClosingTimeLocalValue())
      setClosesAtError(null)
    }
    setOpen(next)
  }
  const handleSubmit = () => {
    if (!isValidClosingTime(value)) {
      setMinimumClosesAt(getMinimumClosingTimeLocalValue())
      setClosesAtError(CLOSING_TIME_ERROR)
      return
    }
    onSubmit(
      new Date(value).toISOString(),
      () => setOpen(false),
      (error) => setClosesAtError(getFieldError(error, 'closesAt') ?? error.message),
    )
  }

  return (
    <>
      <span className="contents" onClick={() => handleOpenChange(true)}>
        {trigger}
      </span>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="closes-at">마감 시간</Label>
            <Input
              id="closes-at"
              type="datetime-local"
              min={minimumClosesAt}
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                setMinimumClosesAt(getMinimumClosingTimeLocalValue())
                setClosesAtError(null)
              }}
            />
            {closesAtError && <p className="text-xs text-destructive">{closesAtError}</p>}
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? '저장 중...' : submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
