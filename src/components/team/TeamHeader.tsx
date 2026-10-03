import { Copy, Share2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { MemberAvatarGroup } from './MemberAvatarGroup'
import { TOAST_MESSAGES } from '@/constants/messages'
import type { Team, TeamMemberProfile } from '@/types/team'

type TeamHeaderProps = {
  team: Team
  members: TeamMemberProfile[]
  inviteUrl?: string
}

export function TeamHeader({ team, members, inviteUrl }: TeamHeaderProps) {
  const { name, description } = team

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      toast.success(TOAST_MESSAGES.INVITE_COPIED)
    } catch {
      toast.error(TOAST_MESSAGES.GENERIC_ERROR)
    }
  }
  const handleShare = () => toast.info(TOAST_MESSAGES.SHARE_PLACEHOLDER)

  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-xs md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <MemberAvatarGroup members={members} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="size-4" />멤버 {members.length}명
          </span>
        </div>
      </div>
      {inviteUrl && (
        <div className="grid gap-2 md:w-80">
          <span className="text-xs font-medium text-muted-foreground">초대 링크</span>
          <div className="truncate rounded-md border bg-muted px-3 py-2 text-xs">{inviteUrl}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleCopy}>
              <Copy /> 링크 복사
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 /> 공유
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
