import { Trophy, Users, Vote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TEAM_ROLE, TEAM_ROLE_LABEL } from '@/constants/team'
import { formatDate } from '@/lib/date'
import type { TeamSummary } from '@/types/team'

type TeamCardProps = {
  team: TeamSummary
  onOpen: (teamId: string) => void
}

export function TeamCard({ team, onOpen }: TeamCardProps) {
  const { id, name, description, memberCount, myRole, activeVoteCount, latestLunch } = team

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={() => onOpen(id)}
      onKeyDown={(event) => event.key === 'Enter' && onOpen(id)}
      className="cursor-pointer transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant={myRole === TEAM_ROLE.ADMIN ? 'default' : 'secondary'}>{TEAM_ROLE_LABEL[myRole]}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><Users className="size-4" />멤버 {memberCount}명</span>
        <span className="flex items-center gap-2"><Vote className="size-4" />진행 중인 투표 {activeVoteCount}개</span>
        <span className="flex items-center gap-2">
          <Trophy className="size-4" />
          {latestLunch ? `최근 확정: ${latestLunch.restaurantName} (${formatDate(latestLunch.confirmedAt)})` : '아직 확정된 점심이 없어요'}
        </span>
      </CardContent>
    </Card>
  )
}
