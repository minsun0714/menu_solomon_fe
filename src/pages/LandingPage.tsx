import { useState, type FormEvent } from 'react'
import { ArrowRight, Plus, TicketCheck, Users, UtensilsCrossed } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateTeamDialog } from '@/components/team/CreateTeamDialog'
import { APP_NAME } from '@/constants/config'
import { ROUTES } from '@/constants/routes'
import { useMyTeams } from '@/hooks/team/useMyTeams'

export function LandingPage() {
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const { isCreating, createTeam } = useMyTeams()
  const normalizedInviteCode = inviteCode.trim()
  const cardClassName = 'group min-h-80 gap-0 overflow-hidden p-0 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md'
  const cardHeaderClassName = 'flex-1 gap-5 px-6 pt-7 pb-6'
  const cardContentClassName = 'mt-auto px-6 pb-8'
  const iconClassName = 'flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-transform group-hover:scale-105'

  const handleCreate = (...args: Parameters<typeof createTeam>) =>
    createTeam(args[0], (teamId) => {
      args[1]?.(teamId)
      navigate(ROUTES.TEAM_DETAIL(teamId))
    })

  const handleJoin = (event: FormEvent) => {
    event.preventDefault()
    if (normalizedInviteCode) navigate(ROUTES.INVITATION(normalizedInviteCode))
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-10 py-10">
      <div className="flex items-center justify-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <UtensilsCrossed className="size-6" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
      </div>

      <div className="grid w-full gap-5 md:grid-cols-3">
        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <span className={iconClassName}>
              <Plus className="size-6" />
            </span>
            <div className="space-y-3">
              <CardTitle className="text-xl">팀 만들기</CardTitle>
              <CardDescription className="leading-relaxed">새로운 팀을 만들고 초대 코드를 팀원에게 공유하세요.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            <CreateTeamDialog isCreating={isCreating} triggerClassName="h-10 w-full" onCreate={handleCreate} />
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <span className={iconClassName}>
              <TicketCheck className="size-6" />
            </span>
            <div className="space-y-3">
              <CardTitle className="text-xl">초대 코드로 팀 참여하기</CardTitle>
              <CardDescription className="leading-relaxed">팀원에게 전달받은 초대 코드를 입력하세요.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            <form className="grid gap-3" onSubmit={handleJoin}>
              <Label htmlFor="invite-code" className="sr-only">초대 코드</Label>
              <Input
                id="invite-code"
                value={inviteCode}
                className="h-10"
                placeholder="초대 코드 입력"
                autoComplete="off"
                onChange={(event) => setInviteCode(event.target.value)}
              />
              <Button type="submit" variant="outline" className="h-10" disabled={!normalizedInviteCode}>
                팀 참여하기 <ArrowRight />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader className={cardHeaderClassName}>
            <span className={iconClassName}>
              <Users className="size-6" />
            </span>
            <div className="space-y-3">
              <CardTitle className="text-xl">내 팀</CardTitle>
              <CardDescription className="leading-relaxed">내가 만들거나 참여한 팀을 확인하고 점심 투표를 시작하세요.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className={cardContentClassName}>
            <Button className="h-10 w-full" variant="outline" asChild>
              <Link to={ROUTES.MY_TEAMS}>내 팀 보기 <ArrowRight /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
