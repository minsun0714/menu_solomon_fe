import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/cn'
import type { User } from '@/types/user'

type UserAvatarProps = {
  user: Pick<User, 'nickname' | 'profileImageUrl'>
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const { nickname, profileImageUrl } = user
  return (
    <Avatar className={cn('border-2 border-card', className)}>
      {profileImageUrl && <AvatarImage src={profileImageUrl} alt={nickname} />}
      <AvatarFallback>{nickname.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}
