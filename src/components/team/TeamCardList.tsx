import { TeamCard } from './TeamCard'
import type { TeamSummary } from '@/types/team'

type TeamCardListProps = {
  teams: TeamSummary[]
  onOpenTeam: (teamId: string) => void
}

export function TeamCardList({ teams, onOpenTeam }: TeamCardListProps) {
  return (
    <div className="grid gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onOpen={onOpenTeam} />
      ))}
    </div>
  )
}
