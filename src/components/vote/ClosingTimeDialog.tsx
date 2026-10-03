import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '@/lib/date'

const resolve = (value: string | (() => string)) => (typeof value === 'function' ? value() : value)

type ClosingTimeDialogProps = {
  trigger: ReactNode
  title: string
  description: string
  submitLabel: string
  initialClosesAt: string | (() => string)
  isSubmitting: boolean
  onSubmit: (closesAt: string, onDone: () => void) => void
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
  const isValid = value !== '' && new Date(value).getTime() > Date.now()

  const handleOpenChange = (next: boolean) => {
    if (next) setValue(toDateTimeLocalValue(resolve(initialClosesAt)))
    setOpen(next)
  }
  const handleSubmit = () => {
    if (new Date(value).getTime() <= Date.now()) return
    onSubmit(fromDateTimeLocalValue(value), () => setOpen(false))
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
            <Input id="closes-at" type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} />
            {!isValid && <p className="text-xs text-destructive">현재 시간 이후로 설정해 주세요.</p>}
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
