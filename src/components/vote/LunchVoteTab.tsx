import { Plus, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { useLunchVotes } from '@/hooks/vote/useLunchVotes'
import { ActiveVoteSession } from './ActiveVoteSession'
import { CreateVoteDialog } from './CreateVoteDialog'

export function LunchVoteTab({ teamId }: { teamId: string }) {
  const {
    activeSessions,
    isLoading,
    isError,
    isCreating,
    createVote,
  } = useLunchVotes(teamId)

  if (isLoading) return <ListSkeleton />
  if (isError) return <ErrorState />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">점심 투표</h2>
        <CreateVoteButton isCreating={isCreating} onCreate={createVote} />
      </div>
      {activeSessions.length === 0 ? (
        <EmptyState icon={Vote} title="진행 중인 투표가 없어요" />
      ) : (
        <div className="grid gap-4">
          {activeSessions.map(({ id }) => <ActiveVoteSession key={id} teamId={teamId} sessionId={id} />)}
        </div>
      )}
    </div>
  )
}

type CreateVoteButtonProps = {
  isCreating: boolean
  onCreate: (name: string | undefined, closesAt: string, onDone: () => void) => void
}

function CreateVoteButton({ isCreating, onCreate }: CreateVoteButtonProps) {
  return (
    <CreateVoteDialog
      trigger={<Button><Plus /> 투표 만들기</Button>}
      isSubmitting={isCreating}
      onSubmit={onCreate}
    />
  )
}
