import { addHours } from '@/lib/date'
import { DEFAULT_VOTE_DURATION_HOURS, VOTE_STATUS } from '@/constants/vote'
import type {
  LunchBallot,
  LunchCandidate,
  LunchDecision,
  LunchVoteSession,
  VoteResult,
} from '@/types/vote'

export function calculateVoteResults(candidates: Pick<LunchCandidate, 'id'>[], ballots: LunchBallot[]): VoteResult[] {
  const totalBallots = ballots.length
  return candidates.map(({ id }) => {
    const voteCount = ballots.filter(({ candidateId }) => candidateId === id).length
    const percentage = totalBallots === 0 ? 0 : Math.round((voteCount / totalBallots) * 100)
    return { candidateId: id, voteCount, percentage }
  })
}

export function getVoteWinners(results: VoteResult[]): VoteResult[] {
  const topCount = Math.max(0, ...results.map(({ voteCount }) => voteCount))
  if (topCount === 0) return []
  return results.filter(({ voteCount }) => voteCount === topCount)
}

export function isVoteTied(winners: VoteResult[]): boolean {
  return winners.length > 1
}

export function isVotingExpired(session: Pick<LunchVoteSession, 'closesAt'>, now: number): boolean {
  return new Date(session.closesAt).getTime() <= now
}

export function isVoteOpen(session: LunchVoteSession, now: number): boolean {
  return session.status === VOTE_STATUS.OPEN && !isVotingExpired(session, now)
}

export function canEditVote(session: LunchVoteSession, isCreator: boolean): boolean {
  return isCreator && session.status === VOTE_STATUS.OPEN
}

export function canCastVote(session: LunchVoteSession, isParticipating: boolean, now: number): boolean {
  return isParticipating && isVoteOpen(session, now)
}

export function canRevote(session: LunchVoteSession, isCreator: boolean): boolean {
  return isCreator && session.status !== VOTE_STATUS.CONFIRMED
}

export function canConfirmLunch(
  session: LunchVoteSession,
  decision: LunchDecision | null,
  isCreator: boolean,
): boolean {
  return isCreator && decision === null && session.status === VOTE_STATUS.CLOSED
}

export function canEditDecision(decision: LunchDecision | null, isCreator: boolean): boolean {
  return isCreator && decision !== null
}

export function shouldAutoConfirm(winners: VoteResult[]): boolean {
  return winners.length === 1
}

export function addHoursToNow(hours: number = DEFAULT_VOTE_DURATION_HOURS): string {
  return addHours(new Date(), hours).toISOString()
}
