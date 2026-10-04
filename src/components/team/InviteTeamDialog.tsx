import { Share2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TOAST_MESSAGES } from '@/constants/messages'

type InviteTeamDialogProps = {
  teamName: string
  inviteLink: string
}

export function InviteTeamDialog({ teamName, inviteLink }: InviteTeamDialogProps) {
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
      </DialogContent>
    </Dialog>
  )
}
