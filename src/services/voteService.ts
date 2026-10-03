import { CANDIDATE_SOURCE, CONFIRMATION_TYPE, RECOMMENDATION_EXCLUDE_DAYS, RECOMMENDATION_LIMIT, VOTE_STATUS } from '@/constants/vote'
import { MS_PER_DAY } from '@/constants/date'
import { calculateVoteResults, canCastVote, isVoteOpen } from '@/domain/voteRules'
import { ApiError } from '@/mocks/api/errors'
import {
  db,
  defaultClosesAt,
  findOrThrow,
  getAverageRatingOfRestaurant,
  getMemberNickname,
  getMyMember,
  getSessionOrThrow,
  getTeamOrThrow,
  getUserOrThrow,
  nextId,
  settleSession,
  simulateLatency,
} from '@/mocks/api/db'
import type {
  CandidateDetail,
  CandidateSource,
  CreateVoteRequest,
  LunchBallot,
  LunchCandidate,
  LunchDecision,
  LunchVoteSession,
  ParticipantDetail,
  RecommendedCandidate,
  TeamParticipation,
  UpdateVoteRequest,
  VoteResultsSnapshot,
  VoteSessionDetail,
  VoteSessionSummary,
} from '@/types/vote'

function getMyMemberOfSession(sessionId: string) {
  return getMyMember(getSessionOrThrow(sessionId).teamId)
}

function assertCreator(session: LunchVoteSession) {
  if (getMyMember(session.teamId).id !== session.createdByTeamMemberId) {
    throw new ApiError('FORBIDDEN', '투표를 만든 사람만 할 수 있습니다.')
  }
}

function currentMemberIdOf(teamId: string): string | null {
  const userId = db.currentUserId
  return db.members.find((m) => m.teamId === teamId && m.userId === userId)?.id ?? null
}

function toSummary(session: LunchVoteSession): VoteSessionSummary {
  const myMemberId = currentMemberIdOf(session.teamId)
  const myBallot = db.ballots.find((b) => b.sessionId === session.id && b.teamMemberId === myMemberId)
  return {
    ...session,
    creatorNickname: getMemberNickname(session.createdByTeamMemberId),
    participantCount: db.participants.filter((p) => p.sessionId === session.id && p.participating).length,
    candidateCount: db.candidates.filter((c) => c.sessionId === session.id).length,
    ballotCount: db.ballots.filter((b) => b.sessionId === session.id).length,
    myBallotCandidateId: myBallot?.candidateId ?? null,
  }
}

function toCandidateDetail(candidate: LunchCandidate, teamId: string): CandidateDetail {
  const restaurant = findOrThrow(db.restaurants.find(({ id }) => id === candidate.restaurantId), '식당을 찾을 수 없습니다.')
  return { ...candidate, restaurant, averageRating: getAverageRatingOfRestaurant(restaurant.id, teamId) }
}

function findOwnBallot(ballotId: string): LunchBallot {
  const ballot = findOrThrow(db.ballots.find(({ id }) => id === ballotId), '투표 내역을 찾을 수 없습니다.')
  const session = getSessionOrThrow(ballot.sessionId)
  if (getMyMember(session.teamId).id !== ballot.teamMemberId) throw new ApiError('FORBIDDEN', '본인의 투표만 변경할 수 있습니다.')
  if (!isVoteOpen(session, Date.now())) throw new ApiError('CONFLICT', '투표가 종료되었습니다.')
  return ballot
}

function findDecision(decisionId: string): { decision: LunchDecision; session: LunchVoteSession } {
  const decision = findOrThrow(db.decisions.find(({ id }) => id === decisionId), '확정 내역을 찾을 수 없습니다.')
  const session = getSessionOrThrow(decision.sessionId)
  assertCreator(session)
  return { decision, session }
}

export const voteService = {
  getVoteSessions(teamId: string): Promise<VoteSessionSummary[]> {
    return simulateLatency(() => {
      getTeamOrThrow(teamId)
      db.sessions.filter((s) => s.teamId === teamId).forEach(({ id }) => settleSession(id))
      return db.sessions
        .filter((s) => s.teamId === teamId)
        .map(toSummary)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    })
  },

  getVoteSession(sessionId: string): Promise<VoteSessionDetail> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      return {
        session,
        creatorNickname: getMemberNickname(session.createdByTeamMemberId),
        decision: db.decisions.find((d) => d.sessionId === sessionId) ?? null,
      }
    })
  },

  createVote(teamId: string, { closesAt }: CreateVoteRequest): Promise<LunchVoteSession> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      const session: LunchVoteSession = {
        id: nextId('s'),
        teamId,
        createdByTeamMemberId: me.id,
        status: VOTE_STATUS.OPEN,
        closesAt: closesAt || defaultClosesAt(),
        createdAt: new Date().toISOString(),
      }
      db.sessions.push(session)
      db.members
        .filter((m) => m.teamId === teamId)
        .forEach((m) =>
          db.participants.push({ id: nextId('p'), sessionId: session.id, teamMemberId: m.id, participating: !db.optedOutMemberIds.has(m.id) }),
        )
      return session
    })
  },

  updateVote(sessionId: string, { closesAt }: UpdateVoteRequest): Promise<LunchVoteSession> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      assertCreator(session)
      if (session.status !== VOTE_STATUS.OPEN) throw new ApiError('CONFLICT', '진행 중인 투표만 수정할 수 있습니다.')
      session.closesAt = closesAt
      return session
    })
  },

  deleteVote(sessionId: string): Promise<void> {
    return simulateLatency(() => {
      assertCreator(getSessionOrThrow(sessionId))
      db.sessions = db.sessions.filter(({ id }) => id !== sessionId)
      db.participants = db.participants.filter((p) => p.sessionId !== sessionId)
      db.candidates = db.candidates.filter((c) => c.sessionId !== sessionId)
      db.ballots = db.ballots.filter((b) => b.sessionId !== sessionId)
      db.decisions = db.decisions.filter((d) => d.sessionId !== sessionId)
    })
  },

  getParticipants(sessionId: string): Promise<ParticipantDetail[]> {
    return simulateLatency(() => {
      getSessionOrThrow(sessionId)
      return db.participants
        .filter((p) => p.sessionId === sessionId)
        .map((p) => ({ ...p, nickname: getMemberNickname(p.teamMemberId) }))
    })
  },

  updateParticipation(sessionId: string, participating: boolean): Promise<void> {
    return simulateLatency(() => {
      const me = getMyMemberOfSession(sessionId)
      const participant = findOrThrow(
        db.participants.find((p) => p.sessionId === sessionId && p.teamMemberId === me.id),
        '참여자 정보를 찾을 수 없습니다.',
      )
      participant.participating = participating
    })
  },

  getTeamParticipation(teamId: string): Promise<TeamParticipation[]> {
    return simulateLatency(() => {
      getTeamOrThrow(teamId)
      return db.members
        .filter((m) => m.teamId === teamId)
        .map((m) => ({
          teamMemberId: m.id,
          nickname: getUserOrThrow(m.userId).nickname,
          participating: !db.optedOutMemberIds.has(m.id),
        }))
    })
  },

  updateTeamParticipation(teamId: string, participating: boolean): Promise<void> {
    return simulateLatency(() => {
      const me = getMyMember(teamId)
      if (participating) db.optedOutMemberIds.delete(me.id)
      else db.optedOutMemberIds.add(me.id)
      const openSessionIds = db.sessions.filter((s) => s.teamId === teamId && s.status === VOTE_STATUS.OPEN).map(({ id }) => id)
      db.participants
        .filter((p) => p.teamMemberId === me.id && openSessionIds.includes(p.sessionId))
        .forEach((p) => {
          p.participating = participating
        })
    })
  },

  getCandidates(sessionId: string): Promise<CandidateDetail[]> {
    return simulateLatency(() => {
      const { teamId } = getSessionOrThrow(sessionId)
      return db.candidates.filter((c) => c.sessionId === sessionId).map((c) => toCandidateDetail(c, teamId))
    })
  },

  addCandidate(sessionId: string, restaurantId: string, source: CandidateSource = CANDIDATE_SOURCE.MANUAL): Promise<LunchCandidate> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      getMyMember(session.teamId)
      if (session.status !== VOTE_STATUS.OPEN) throw new ApiError('CONFLICT', '진행 중인 투표에만 후보를 추가할 수 있습니다.')
      findOrThrow(db.restaurants.find(({ id }) => id === restaurantId), '식당을 찾을 수 없습니다.')
      if (db.candidates.some((c) => c.sessionId === sessionId && c.restaurantId === restaurantId)) {
        throw new ApiError('CONFLICT', '이미 후보에 있는 식당입니다.')
      }
      const candidate: LunchCandidate = { id: nextId('c'), sessionId, restaurantId, source }
      db.candidates.push(candidate)
      return candidate
    })
  },

  getRecommendedCandidates(sessionId: string): Promise<RecommendedCandidate[]> {
    return simulateLatency(() => {
      const { teamId } = getSessionOrThrow(sessionId)
      const cutoff = Date.now() - RECOMMENDATION_EXCLUDE_DAYS * MS_PER_DAY
      const teamSessionIds = db.sessions.filter((s) => s.teamId === teamId).map(({ id }) => id)
      const recentlyConfirmed = db.decisions
        .filter((d) => teamSessionIds.includes(d.sessionId) && new Date(d.confirmedAt).getTime() >= cutoff)
        .map(({ restaurantId }) => restaurantId)
      const candidateIds = db.candidates.filter((c) => c.sessionId === sessionId).map(({ restaurantId }) => restaurantId)
      const participantCount = db.participants.filter((p) => p.sessionId === sessionId && p.participating).length

      return db.teamRestaurants
        .filter((tr) => tr.teamId === teamId)
        .map(({ restaurantId }) => restaurantId)
        .filter((restaurantId) => !recentlyConfirmed.includes(restaurantId) && !candidateIds.includes(restaurantId))
        .flatMap((restaurantId) => {
          const restaurant = db.restaurants.find(({ id }) => id === restaurantId)
          if (!restaurant) return []
          const averageRating = getAverageRatingOfRestaurant(restaurantId, teamId)
          return [{ restaurant, averageRating, reason: `참여자 ${participantCount}명 기준 · 최근 ${RECOMMENDATION_EXCLUDE_DAYS}일 내 선택 안 함` }]
        })
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, RECOMMENDATION_LIMIT)
    })
  },

  submitBallot(sessionId: string, candidateId: string): Promise<LunchBallot> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      const me = getMyMember(session.teamId)
      const participant = db.participants.find((p) => p.sessionId === sessionId && p.teamMemberId === me.id)
      if (!canCastVote(session, participant?.participating ?? false, Date.now())) {
        throw new ApiError('CONFLICT', '투표할 수 없는 상태입니다.')
      }
      findOrThrow(db.candidates.find((c) => c.id === candidateId && c.sessionId === sessionId), '후보를 찾을 수 없습니다.')
      if (db.ballots.some((b) => b.sessionId === sessionId && b.teamMemberId === me.id)) {
        throw new ApiError('CONFLICT', '이미 투표했습니다.')
      }
      const now = new Date().toISOString()
      const ballot: LunchBallot = { id: nextId('b'), sessionId, candidateId, teamMemberId: me.id, createdAt: now, updatedAt: now }
      db.ballots.push(ballot)
      return ballot
    })
  },

  updateBallot(ballotId: string, candidateId: string): Promise<LunchBallot> {
    return simulateLatency(() => {
      const ballot = findOwnBallot(ballotId)
      findOrThrow(db.candidates.find((c) => c.id === candidateId && c.sessionId === ballot.sessionId), '후보를 찾을 수 없습니다.')
      ballot.candidateId = candidateId
      ballot.updatedAt = new Date().toISOString()
      return ballot
    })
  },

  deleteBallot(ballotId: string): Promise<void> {
    return simulateLatency(() => {
      findOwnBallot(ballotId)
      db.ballots = db.ballots.filter(({ id }) => id !== ballotId)
    })
  },

  getVoteResults(sessionId: string): Promise<VoteResultsSnapshot> {
    return simulateLatency(() => {
      getSessionOrThrow(sessionId)
      const candidates = db.candidates.filter((c) => c.sessionId === sessionId)
      const ballots = db.ballots.filter((b) => b.sessionId === sessionId)
      return { results: calculateVoteResults(candidates, ballots), ballots }
    })
  },

  revote(sessionId: string, candidateIds?: string[]): Promise<LunchVoteSession> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      assertCreator(session)
      if (session.status === VOTE_STATUS.CONFIRMED) throw new ApiError('CONFLICT', '확정된 투표는 재투표할 수 없습니다.')
      db.ballots = db.ballots.filter((b) => b.sessionId !== sessionId)
      if (candidateIds && candidateIds.length > 0) {
        db.candidates = db.candidates.filter((c) => c.sessionId !== sessionId || candidateIds.includes(c.id))
      }
      session.status = VOTE_STATUS.OPEN
      session.closesAt = defaultClosesAt()
      return session
    })
  },

  confirmLunch(sessionId: string, restaurantId: string): Promise<LunchDecision> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      assertCreator(session)
      if (session.status !== VOTE_STATUS.CLOSED) throw new ApiError('CONFLICT', '종료된 투표만 확정할 수 있습니다.')
      findOrThrow(db.candidates.find((c) => c.sessionId === sessionId && c.restaurantId === restaurantId), '후보에 없는 식당입니다.')
      const decision: LunchDecision = {
        id: nextId('d'),
        sessionId,
        restaurantId,
        confirmedByTeamMemberId: getMyMember(session.teamId).id,
        confirmationType: CONFIRMATION_TYPE.MANUAL,
        confirmedAt: new Date().toISOString(),
      }
      db.decisions.push(decision)
      session.status = VOTE_STATUS.CONFIRMED
      return decision
    })
  },

  updateDecision(decisionId: string, restaurantId: string): Promise<LunchDecision> {
    return simulateLatency(() => {
      const { decision } = findDecision(decisionId)
      findOrThrow(db.candidates.find((c) => c.sessionId === decision.sessionId && c.restaurantId === restaurantId), '후보에 없는 식당입니다.')
      decision.restaurantId = restaurantId
      return decision
    })
  },

  deleteDecision(decisionId: string): Promise<void> {
    return simulateLatency(() => {
      const { session } = findDecision(decisionId)
      db.decisions = db.decisions.filter(({ id }) => id !== decisionId)
      session.status = VOTE_STATUS.CLOSED
    })
  },
}
