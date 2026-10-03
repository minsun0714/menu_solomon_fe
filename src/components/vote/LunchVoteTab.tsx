import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { DEFAULT_VOTE_DURATION_HOURS } from '@/constants/vote'
import { ROUTES } from '@/constants/routes'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useLunchVotes } from '@/hooks/vote/useLunchVotes'
import { addHoursToNow } from '@/domain/voteRules'
import { ClosingTimeDialog } from './ClosingTimeDialog'
import { ParticipationSummary } from './ParticipationSummary'
import { VoteSessionList } from './VoteSessionList'

export function LunchVoteTab({ teamId }: { teamId: string }) {
  const navigate = useNavigate()
  const { requireAuth } = useRequireAuth()
  const {
    activeSessions,
    pastSessions,
    participants,
    nonParticipants,
    isParticipating,
    isLoading,
    isError,
    isCreating,
    isUpdatingParticipation,
    createVote,
    setParticipation,
  } = useLunchVotes(teamId)

  const handleToggleParticipation = () => requireAuth(() => setParticipation(!isParticipating))
  const handleOpenSession = (sessionId: string) => navigate(ROUTES.VOTE_DETAIL(teamId, sessionId))

  if (isLoading) return <ListSkeleton />
  if (isError) return <ErrorState />

  return (
    <div className="space-y-6">
      <ParticipationSummary
        participants={participants}
        nonParticipants={nonParticipants}
        isParticipating={isParticipating}
        isUpdating={isUpdatingParticipation}
        onToggleParticipation={handleToggleParticipation}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">점심 투표</h2>
        <CreateVoteButton isCreating={isCreating} onCreate={createVote} requireAuth={requireAuth} />
      </div>
      <VoteSessionList title="진행 중" sessions={activeSessions} emptyTitle="진행 중인 투표가 없어요" onOpenSession={handleOpenSession} />
      <VoteSessionList title="지난 투표" sessions={pastSessions} emptyTitle="지난 투표가 없어요" onOpenSession={handleOpenSession} />
    </div>
  )
}

type CreateVoteButtonProps = {
  isCreating: boolean
  requireAuth: (action: () => void) => void
  onCreate: (closesAt: string, onDone: () => void) => void
}

function CreateVoteButton({ isCreating, requireAuth, onCreate }: CreateVoteButtonProps) {
  return (
    <ClosingTimeDialog
      trigger={<Button><Plus /> 투표 만들기</Button>}
      title="새 투표 만들기"
      description={`마감 시간을 정하면 팀원들이 후보에 투표할 수 있어요. 기본값은 ${DEFAULT_VOTE_DURATION_HOURS}시간 뒤입니다.`}
      submitLabel="투표 만들기"
      initialClosesAt={addHoursToNow}
      isSubmitting={isCreating}
      guard={requireAuth}
      onSubmit={onCreate}
    />
  )
}
