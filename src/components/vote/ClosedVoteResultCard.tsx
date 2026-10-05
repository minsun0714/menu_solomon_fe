import { useState, type FormEvent } from 'react'
import { Check, Pencil, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DATE_FORMATS } from '@/constants/date'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { MAX_VOTE_NAME_LENGTH, VOTE_STATUS } from '@/constants/vote'
import { useTeamPermissions } from '@/hooks/team/useTeamPermissions'
import { useVoteManagement } from '@/hooks/vote/useVoteManagement'
import { useCandidatesQuery, useVoteParticipantsQuery, useVoteResultsQuery, useVoteSessionQuery } from '@/hooks/vote/queries/useVoteQueries'
import { formatDate } from '@/lib/date'
import { VoteDeleteMenu } from './VoteDeleteMenu'
import type { VoteSessionSummary } from '@/types/vote'

type ClosedVoteResultCardProps = {
  teamId: string
  session: VoteSessionSummary
  onManageDecision: () => void
  onRestartForCandidate: (sessionId: string) => void
}

export function ClosedVoteResultCard({ teamId, session, onManageDecision, onRestartForCandidate }: ClosedVoteResultCardProps) {
  const { id, name, status, creatorNickname, closesAt } = session
  const displayName = name ?? `점심 투표 #${id}`
  const [isEditingName, setIsEditingName] = useState(false)
  const [nextName, setNextName] = useState('')
  const { data: detail, isLoading: isDetailLoading, isError: isDetailError } = useVoteSessionQuery(teamId, id)
  const { data: candidates = [], isLoading: isCandidatesLoading, isError: isCandidatesError } = useCandidatesQuery(teamId, id)
  const { data: snapshot, isLoading: isResultsLoading, isError: isResultsError } = useVoteResultsQuery(teamId, id)
  const { data: participants = [], isLoading: isParticipantsLoading, isError: isParticipantsError } = useVoteParticipantsQuery(teamId, id)
  const { currentMember } = useTeamPermissions(teamId)
  const { isPending: isManaging, revote, updateName } = useVoteManagement(teamId, id)
  const decision = detail?.decision
  const decidedCandidate = candidates.find(({ restaurantId }) => restaurantId === decision?.restaurantId)
  const results = snapshot?.results ?? []
  const resultRows = candidates
    .map((candidate) => ({
      candidate,
      result: results.find(({ candidateId }) => candidateId === candidate.id) ?? {
        candidateId: candidate.id,
        voteCount: 0,
        percentage: 0,
      },
    }))
    .sort((a, b) => b.result.voteCount - a.result.voteCount)
  const participatingMembers = participants.filter(({ participating }) => participating)
  const participantCount = isParticipantsLoading || isParticipantsError ? session.participantCount : participatingMembers.length
  const isLoading = isDetailLoading || isCandidatesLoading || isResultsLoading
  const isError = isDetailError || isCandidatesError || isResultsError
  const canManageDecision = session.createdByTeamMemberId === currentMember?.id
  const hasCandidates = (isLoading ? session.candidateCount : candidates.length) > 0
  const handleStartNameEdit = () => {
    setNextName(displayName)
    setIsEditingName(true)
  }
  const handleNameSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = nextName.trim()
    if (!trimmedName) return
    if (trimmedName === displayName) {
      setIsEditingName(false)
      return
    }
    updateName(trimmedName, () => setIsEditingName(false))
  }

  return (
    <article className="border-b border-border/80 py-4 first:border-t">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-semibold">
            {isEditingName ? (
              <form className="flex items-center gap-1" onSubmit={handleNameSubmit}>
                <Input
                  value={nextName}
                  maxLength={MAX_VOTE_NAME_LENGTH}
                  className="h-8 w-56 font-semibold"
                  autoFocus
                  onChange={(event) => setNextName(event.target.value)}
                />
                <Button type="submit" variant="ghost" size="icon" className="size-8" disabled={!nextName.trim() || isManaging} aria-label="투표 이름 저장">
                  <Check />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" disabled={isManaging} aria-label="투표 이름 수정 취소" onClick={() => setIsEditingName(false)}>
                  <X />
                </Button>
              </form>
            ) : (
              <span className="flex items-center gap-1">
                {displayName}
                <Button variant="ghost" size="icon" className="size-7" aria-label="투표 이름 수정" onClick={handleStartNameEdit}>
                  <Pencil />
                </Button>
              </span>
            )}
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {creatorNickname} · {formatDate(closesAt, DATE_FORMATS.DATE_TIME)} 마감 · 후보 {candidates.length || session.candidateCount} · 참여 {participantCount}명
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {canManageDecision && hasCandidates && (
            <Button size="sm" variant="outline" onClick={onManageDecision}>
              {status === VOTE_STATUS.CLOSED ? '메뉴 확정' : '확정 메뉴 변경'}
            </Button>
          )}
          <VoteDeleteMenu teamId={teamId} sessionId={id} navigateAfterDelete={false} />
        </div>
      </header>
      <div className="mt-4 space-y-4">
        {!hasCandidates && !isLoading ? (
          <div className="space-y-3 border-l-2 border-border pl-3">
            <div>
              <p className="text-sm font-medium">등록된 후보 없이 종료된 투표입니다.</p>
              <p className="mt-1 text-xs text-muted-foreground">후보를 추가해 다시 시작하거나 이 투표를 삭제할 수 있습니다.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canManageDecision && (
                <ConfirmDialog
                  trigger={<Button size="sm" disabled={isManaging}><RotateCcw /> 후보 추가하고 다시 시작</Button>}
                  message={DIALOG_MESSAGES.REVOTE}
                  destructive={false}
                  onConfirm={() => revote(() => onRestartForCandidate(id))}
                />
              )}
            </div>
          </div>
        ) : status === VOTE_STATUS.CONFIRMED && decidedCandidate ? (
          <div>
            <p className="text-xs font-medium text-muted-foreground">확정 메뉴</p>
            <p className="mt-0.5 font-semibold">{decidedCandidate.restaurant.name}</p>
          </div>
        ) : status === VOTE_STATUS.CLOSED ? (
          <div className="border-l-2 border-amber-400 pl-3 text-sm font-medium text-amber-800">
            메뉴 확정을 기다리고 있어요. 투표 생성자가 결과를 확인하고 메뉴를 확정할 수 있습니다.
          </div>
        ) : null}

        {isLoading ? (
          <p className="py-3 text-sm text-muted-foreground">투표 결과를 불러오고 있어요...</p>
        ) : isError ? (
          <p className="py-3 text-sm text-destructive">투표 결과를 불러오지 못했습니다.</p>
        ) : resultRows.length === 0 ? (
          null
        ) : (
          <div className="grid max-w-2xl gap-3">
            {resultRows.map(({ candidate, result }) => (
              <div key={candidate.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{candidate.restaurant.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{result.voteCount}표 · {result.percentage}%</span>
                </div>
                <Progress className="h-1.5 bg-muted" value={result.percentage} aria-label={`${candidate.restaurant.name} 득표율`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
