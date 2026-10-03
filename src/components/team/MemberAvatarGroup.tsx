import { UserAvatar } from '@/components/common/UserAvatar'
import type { TeamMemberProfile } from '@/types/team'

const MAX_VISIBLE_AVATARS = 5

type MemberAvatarGroupProps = {
  members: TeamMemberProfile[]
  showNames?: boolean
}

export function MemberAvatarGroup({ members, showNames = false }: MemberAvatarGroupProps) {
  const visibleMembers = members.slice(0, MAX_VISIBLE_AVATARS)
  const hiddenCount = members.length - visibleMembers.length

  return (
    <div className={showNames ? 'flex flex-wrap gap-2' : 'flex -space-x-2'}>
      {visibleMembers.map(({ id, user }) => (
        showNames ? (
          <span key={id} className="flex items-center gap-1.5 rounded-full border bg-card py-1 pr-2.5 pl-1 text-xs font-medium">
            <UserAvatar user={user} className="size-6 border-0" />
            {user.nickname}
          </span>
        ) : (
          <UserAvatar key={id} user={user} />
        )
      ))}
      {hiddenCount > 0 && (
        <span className={showNames
          ? 'flex items-center rounded-full border bg-muted px-2.5 text-xs font-medium text-muted-foreground'
          : 'z-10 flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium text-muted-foreground'}>
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}
