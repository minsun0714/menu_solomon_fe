import { Copy, Share2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { TOAST_MESSAGES } from '@/constants/messages'

type InviteTeamDialogProps = {
  teamName: string
  inviteCode: string
  inviteLink: string
}

export function InviteTeamDialog({ teamName, inviteCode, inviteLink }: InviteTeamDialogProps) {
  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(message)
    } catch {
      toast.error(TOAST_MESSAGES.GENERIC_ERROR)
    }
  }

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${teamName} 팀 초대`, text: `${teamName} 팀에 참여해 보세요.`, url: inviteLink })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    await copy(inviteLink, TOAST_MESSAGES.INVITE_LINK_COPIED)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><UserPlus /> 팀원 초대하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>팀원 초대하기</DialogTitle>
          <DialogDescription>초대 링크를 공유하면 팀원이 바로 참여할 수 있어요.</DialogDescription>
        </DialogHeader>

        <Button size="lg" className="w-full" onClick={handleShareLink}>
          <Share2 /> 초대 링크 공유하기
        </Button>

        <div className="relative py-2">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs whitespace-nowrap text-muted-foreground">
            링크를 열 수 없다면
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">홈 화면에서 아래 초대 코드를 입력해 참여할 수 있어요.</p>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
            <code className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide">{inviteCode}</code>
            <Button variant="outline" size="sm" onClick={() => copy(inviteCode, TOAST_MESSAGES.INVITE_CODE_COPIED)}>
              <Copy /> 코드 복사
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
