import { Vote } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { VoteSessionCard } from './VoteSessionCard'
import type { VoteSessionSummary } from '@/types/vote'

type VoteSessionListProps = {
  title: string
  sessions: VoteSessionSummary[]
  emptyTitle: string
  onOpenSession: (sessionId: string) => void
}

export function VoteSessionList({ title, sessions, emptyTitle, onOpenSession }: VoteSessionListProps) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">{title} <span className="text-muted-foreground">{sessions.length}</span></h3>
      {sessions.length === 0 ? (
        <EmptyState icon={Vote} title={emptyTitle} />
      ) : (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <VoteSessionCard key={session.id} session={session} onOpen={onOpenSession} />
          ))}
        </div>
      )}
    </section>
  )
}
