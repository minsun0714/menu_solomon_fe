import { Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { UserAvatar } from '@/components/common/UserAvatar'
import { MemberAvatarGroup } from '@/components/team/MemberAvatarGroup'
import { ROUTES } from '@/constants/routes'
import { TEAM_ROLE, TEAM_ROLE_LABEL } from '@/constants/team'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useTeamPreview } from '@/hooks/team/useTeamPreview'

export function TeamInvitationPage() {
  const { inviteToken = '' } = useParams()
  const navigate = useNavigate()
  const { requireAuth } = useRequireAuth()
  const { preview, isLoading, isError, isJoining, isAlreadyMember, joinTeam } = useTeamPreview(inviteToken)

  const handleJoin = () => requireAuth(() => joinTeam((teamId) => navigate(ROUTES.TEAM_DETAIL(teamId))))
  const handleOpenTeam = () => preview && navigate(ROUTES.TEAM_DETAIL(preview.id))

  if (isLoading) return <Skeleton className="mx-auto h-72 max-w-2xl" />
  if (isError || !preview) return <ErrorState message="유효하지 않은 초대 링크입니다." />

  const { name, description, memberCount, members } = preview

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="items-center text-center">
        <p className="text-sm text-primary">팀에 초대받았어요</p>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-3 pt-2">
          <MemberAvatarGroup members={members} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="size-4" />멤버 {memberCount}명</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <ul className="divide-y rounded-lg border">
          {members.map(({ id, user, role }) => (
            <li key={id} className="flex items-center justify-between px-4 py-2.5">
              <span className="flex items-center gap-3 text-sm"><UserAvatar user={user} />{user.nickname}</span>
              <span className="text-xs text-muted-foreground">{role === TEAM_ROLE.ADMIN ? TEAM_ROLE_LABEL[role] : TEAM_ROLE_LABEL.MEMBER}</span>
            </li>
          ))}
        </ul>
        {isAlreadyMember ? (
          <Button className="w-full" onClick={handleOpenTeam}>이미 참여 중이에요 · 팀으로 이동</Button>
        ) : (
          <Button className="w-full" disabled={isJoining} onClick={handleJoin}>{isJoining ? '참여 중...' : '팀 참여하기'}</Button>
        )}
      </CardContent>
    </Card>
  )
}
