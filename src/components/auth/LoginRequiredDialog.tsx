import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DIALOG_MESSAGES } from '@/constants/messages'

type LoginRequiredDialogProps = {
  open: boolean
  isLoggingIn: boolean
  onOpenChange: (open: boolean) => void
  onLogin: () => void
}

export function LoginRequiredDialog({ open, isLoggingIn, onOpenChange, onLogin }: LoginRequiredDialogProps) {
  const { title, description, action } = DIALOG_MESSAGES.LOGIN_REQUIRED
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            나중에
          </Button>
          <Button onClick={onLogin} disabled={isLoggingIn}>
            {isLoggingIn ? '로그인 중...' : action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
