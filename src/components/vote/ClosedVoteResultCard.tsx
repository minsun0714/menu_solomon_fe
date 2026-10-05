import { useState, type FormEvent } from 'react'
import { Check, CheckCircle2, Clock, Pencil, RotateCcw, Trophy, Utensils, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ParticipationSummary } from './ParticipationSummary'
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
  const topVoteCount = resultRows[0]?.result.voteCount ?? 0
  const participatingMembers = participants.filter(({ participating }) => participating)
  const nonParticipatingMembers = participants.filter(({ participating }) => !participating)
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
    <Card className={status === VOTE_STATUS.CLOSED ? 'border-amber-300/70' : undefined}>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="flex flex-wrap items-center gap-2">
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
                <Button variant="ghost" size="icon" className="size-8" aria-label="투표 이름 수정" onClick={handleStartNameEdit}>
                  <Pencil />
                </Button>
              </span>
            )}
            <StatusBadge status={status} />
          </CardTitle>
          <p className="text-sm text-muted-foreground">{creatorNickname}님이 만든 투표</p>
        </div>
        <div className="flex items-center gap-1">
          {canManageDecision && hasCandidates && (
            <Button size="sm" variant="outline" onClick={onManageDecision}>
              {status === VOTE_STATUS.CLOSED ? '메뉴 확정' : '확정 메뉴 변경'}
            </Button>
          )}
          <VoteDeleteMenu teamId={teamId} sessionId={id} navigateAfterDelete={false} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-4" />{formatDate(closesAt, DATE_FORMATS.DATE_TIME)} 마감</span>
          <span className="flex items-center gap-1"><Utensils className="size-4" />후보 {candidates.length || session.candidateCount}</span>
        </div>

        {isParticipantsLoading ? (
          <p className="text-sm text-muted-foreground">참여자 목록을 불러오고 있어요...</p>
        ) : isParticipantsError ? (
          <p className="text-sm text-destructive">참여자 목록을 불러오지 못했습니다.</p>
        ) : (
          <ParticipationSummary
            participants={participatingMembers}
            nonParticipants={nonParticipatingMembers}
            isUpdating={false}
            canToggle={false}
            compact
          />
        )}

        {!hasCandidates && !isLoading ? (
          <div className="space-y-3 rounded-lg border border-dashed p-4">
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
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            <CheckCircle2 className="size-4" /> 확정 메뉴: {decidedCandidate.restaurant.name}
          </div>
        ) : status === VOTE_STATUS.CLOSED ? (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
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
          <div className="grid gap-3">
            {resultRows.map(({ candidate, result }) => (
              <div key={candidate.id} className="grid gap-1.5 sm:grid-cols-[minmax(120px,0.7fr)_minmax(180px,1fr)_80px] sm:items-center sm:gap-3">
                <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
                  {topVoteCount > 0 && result.voteCount === topVoteCount && <Trophy className="size-4 shrink-0 text-amber-500" />}
                  <span className="truncate">{candidate.restaurant.name}</span>
                </span>
                <Progress value={result.percentage} aria-label={`${candidate.restaurant.name} 득표율`} />
                <span className="text-right text-sm tabular-nums text-muted-foreground">{result.voteCount}표 · {result.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
