import { Plus, Vote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { DEFAULT_VOTE_DURATION_HOURS } from '@/constants/vote'
import { useLunchVotes } from '@/hooks/vote/useLunchVotes'
import { addHoursToNow } from '@/domain/voteRules'
import { ActiveVoteSession } from './ActiveVoteSession'
import { ClosingTimeDialog } from './ClosingTimeDialog'

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
  onCreate: (closesAt: string, onDone: () => void) => void
}

function CreateVoteButton({ isCreating, onCreate }: CreateVoteButtonProps) {
  return (
    <ClosingTimeDialog
      trigger={<Button><Plus /> 투표 만들기</Button>}
      title="새 투표 만들기"
      description={`마감 시간을 정하면 팀원들이 후보에 투표할 수 있어요. 기본값은 ${DEFAULT_VOTE_DURATION_HOURS}시간 뒤입니다.`}
      submitLabel="투표 만들기"
      initialClosesAt={addHoursToNow}
      isSubmitting={isCreating}
      onSubmit={onCreate}
    />
  )
}
