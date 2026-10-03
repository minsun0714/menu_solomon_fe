import { UserAvatar } from '@/components/common/UserAvatar'
import type { TeamMemberProfile } from '@/types/team'

const MAX_VISIBLE_AVATARS = 5

type MemberAvatarGroupProps = {
  members: TeamMemberProfile[]
}

export function MemberAvatarGroup({ members }: MemberAvatarGroupProps) {
  const visibleMembers = members.slice(0, MAX_VISIBLE_AVATARS)
  const hiddenCount = members.length - visibleMembers.length

  return (
    <div className="flex -space-x-2">
      {visibleMembers.map(({ id, user }) => (
        <UserAvatar key={id} user={user} />
      ))}
      {hiddenCount > 0 && (
        <span className="z-10 flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground">
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}
