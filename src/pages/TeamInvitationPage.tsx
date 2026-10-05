import { Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { BackLink } from '@/components/common/BackLink'
import { UserAvatar } from '@/components/common/UserAvatar'
import { MemberAvatarGroup } from '@/components/team/MemberAvatarGroup'
import { ROUTES } from '@/constants/routes'
import { TEAM_ROLE, TEAM_ROLE_LABEL } from '@/constants/team'
import { useTeamPreview } from '@/hooks/team/useTeamPreview'

export function TeamInvitationPage() {
  const { inviteCode = '' } = useParams()
  const navigate = useNavigate()
  const { preview, isLoading, isError, isJoining, isAlreadyMember, joinTeam } = useTeamPreview(inviteCode)

  const handleJoin = () => joinTeam((teamId) => navigate(ROUTES.TEAM_DETAIL(teamId)))
  const handleOpenTeam = () => preview && navigate(ROUTES.TEAM_DETAIL(preview.id))

  if (isLoading) return <div className="mx-auto max-w-2xl space-y-6"><BackLink to={ROUTES.LANDING}>홈으로 가기</BackLink><Skeleton className="h-72" /></div>
  if (isError || !preview) return <div className="mx-auto max-w-2xl space-y-6"><BackLink to={ROUTES.LANDING}>홈으로 가기</BackLink><ErrorState message="유효하지 않거나 만료된 초대 링크입니다." /></div>

  const { name, description, memberCount, members } = preview

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink to={ROUTES.LANDING}>홈으로 가기</BackLink>
      <section className="border-y py-6">
        <header className="border-b pb-5">
          <p className="text-sm font-medium text-primary">팀 초대</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{name}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-3 pt-2">
            <MemberAvatarGroup members={members} />
            <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="size-4" />멤버 {memberCount}명</span>
          </div>
        </header>
        <div className="space-y-5 pt-5">
          <ul className="divide-y border-y">
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
        </div>
      </section>
    </div>
  )
}
