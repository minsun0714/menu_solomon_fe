import { MOCK_API_DELAY_MS } from '@/constants/config'
import { DEFAULT_VOTE_DURATION_HOURS, VOTE_STATUS, CONFIRMATION_TYPE } from '@/constants/vote'
import { calculateVoteResults, getVoteWinners, isVotingExpired, shouldAutoConfirm } from '@/domain/voteRules'
import { addHours } from '@/lib/date'
import {
  CURRENT_USER_ID,
  seedBallots,
  seedCandidates,
  seedDecisions,
  seedMembers,
  seedParticipants,
  seedRestaurants,
  seedReviews,
  seedSessions,
  seedTeamRestaurants,
  seedInviteTokens,
  seedTeams,
  seedUsers,
} from '../data/seed'
import { ApiError } from './errors'

export const db = {
  currentUserId: null as string | null,
  users: [...seedUsers],
  teams: [...seedTeams],
  inviteTokens: { ...seedInviteTokens } as Record<string, string>,
  members: [...seedMembers],
  restaurants: [...seedRestaurants],
  teamRestaurants: [...seedTeamRestaurants],
  reviews: [...seedReviews],
  sessions: [...seedSessions],
  participants: [...seedParticipants],
  candidates: [...seedCandidates],
  ballots: [...seedBallots],
  decisions: [...seedDecisions],
}

export const DEMO_USER_ID = CURRENT_USER_ID

let sequence = 1000
export function nextId(prefix: string): string {
  sequence += 1
  return `${prefix}${sequence}`
}

export function simulateLatency<T>(value: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(value())
      } catch (error) {
        reject(error)
      }
    }, MOCK_API_DELAY_MS)
  })
}

export function requireUserId(): string {
  if (!db.currentUserId) throw new ApiError('UNAUTHORIZED', '로그인이 필요합니다.')
  return db.currentUserId
}

export function findOrThrow<T>(item: T | undefined, message: string): T {
  if (item === undefined) throw new ApiError('NOT_FOUND', message)
  return item
}

export function getTeamOrThrow(teamId: string) {
  return findOrThrow(db.teams.find(({ id }) => id === teamId), '팀을 찾을 수 없습니다.')
}

export function getMyMember(teamId: string) {
  const userId = requireUserId()
  return findOrThrow(
    db.members.find((member) => member.teamId === teamId && member.userId === userId),
    '팀 멤버가 아닙니다.',
  )
}

export function getUserOrThrow(userId: string) {
  return findOrThrow(db.users.find(({ id }) => id === userId), '사용자를 찾을 수 없습니다.')
}

export function getMemberNickname(teamMemberId: string | null): string {
  const member = db.members.find(({ id }) => id === teamMemberId)
  return member ? getUserOrThrow(member.userId).nickname : '알 수 없음'
}

export function getSessionOrThrow(sessionId: string) {
  const session = findOrThrow(db.sessions.find(({ id }) => id === sessionId), '투표를 찾을 수 없습니다.')
  settleSession(session.id)
  return db.sessions.find(({ id }) => id === sessionId) ?? session
}

export function getAverageRatingOfRestaurant(restaurantId: string, teamId?: string): number {
  const teamRestaurantIds = db.teamRestaurants
    .filter((tr) => tr.restaurantId === restaurantId && (!teamId || tr.teamId === teamId))
    .map(({ id }) => id)
  const ratings = db.reviews.filter(({ teamRestaurantId }) => teamRestaurantIds.includes(teamRestaurantId))
  if (ratings.length === 0) return 0
  return Math.round((ratings.reduce((sum, { rating }) => sum + rating, 0) / ratings.length) * 10) / 10
}

/** Closes an expired session and auto-confirms a unique winner. */
export function settleSession(sessionId: string): void {
  const session = db.sessions.find(({ id }) => id === sessionId)
  if (!session || session.status !== VOTE_STATUS.OPEN || !isVotingExpired(session, Date.now())) return

  const candidates = db.candidates.filter((c) => c.sessionId === sessionId)
  const ballots = db.ballots.filter((b) => b.sessionId === sessionId)
  const winners = getVoteWinners(calculateVoteResults(candidates, ballots))

  if (shouldAutoConfirm(winners)) {
    const winnerCandidate = candidates.find(({ id }) => id === winners[0].candidateId)
    if (winnerCandidate) {
      db.decisions.push({
        id: nextId('d'),
        sessionId,
        restaurantId: winnerCandidate.restaurantId,
        confirmedByTeamMemberId: null,
        confirmationType: CONFIRMATION_TYPE.AUTO,
        confirmedAt: new Date().toISOString(),
      })
      session.status = VOTE_STATUS.CONFIRMED
      return
    }
  }
  session.status = VOTE_STATUS.CLOSED
}

export function defaultClosesAt(): string {
  return addHours(new Date(), DEFAULT_VOTE_DURATION_HOURS).toISOString()
}
