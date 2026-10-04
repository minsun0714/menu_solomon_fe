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
  const sessionBallots = db.ballots.filter((b) => b.sessionId === session.id)
  const myBallots = db.ballots.filter((b) => b.sessionId === session.id && b.teamMemberId === myMemberId)
  return {
    ...session,
    creatorNickname: getMemberNickname(session.createdByTeamMemberId),
    participantCount: db.participants.filter((p) => p.sessionId === session.id && p.participating).length,
    candidateCount: db.candidates.filter((c) => c.sessionId === session.id).length,
    ballotCount: new Set(sessionBallots.map(({ teamMemberId }) => teamMemberId)).size,
    myBallotCandidateIds: myBallots.map(({ candidateId }) => candidateId),
  }
}

function toCandidateDetail(candidate: LunchCandidate, teamId: string): CandidateDetail {
  const restaurant = findOrThrow(db.restaurants.find(({ id }) => id === candidate.restaurantId), '식당을 찾을 수 없습니다.')
  return { ...candidate, restaurant, averageRating: getAverageRatingOfRestaurant(restaurant.id, teamId) }
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
      getMyMember(teamId)
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
      getMyMember(session.teamId)
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
          db.participants.push({ id: nextId('p'), sessionId: session.id, teamMemberId: m.id, participating: true }),
        )
      return session
    })
  },

  updateVote(sessionId: string, { closesAt, name }: UpdateVoteRequest): Promise<LunchVoteSession> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      getMyMember(session.teamId)
      if (session.status !== VOTE_STATUS.OPEN) throw new ApiError('CONFLICT', '진행 중인 투표만 수정할 수 있습니다.')
      if (closesAt !== undefined) session.closesAt = closesAt
      if (name !== undefined) {
        const trimmedName = name.trim()
        if (!trimmedName) throw new ApiError('BAD_REQUEST', '투표 이름을 입력해 주세요.')
        session.name = trimmedName
      }
      return session
    })
  },

  deleteVote(sessionId: string): Promise<void> {
    return simulateLatency(() => {
      getMyMemberOfSession(sessionId)
      db.sessions = db.sessions.filter(({ id }) => id !== sessionId)
      db.participants = db.participants.filter((p) => p.sessionId !== sessionId)
      db.candidates = db.candidates.filter((c) => c.sessionId !== sessionId)
      db.ballots = db.ballots.filter((b) => b.sessionId !== sessionId)
      db.decisions = db.decisions.filter((d) => d.sessionId !== sessionId)
    })
  },

  getParticipants(sessionId: string): Promise<ParticipantDetail[]> {
    return simulateLatency(() => {
      getMyMemberOfSession(sessionId)
      return db.participants
        .filter((p) => p.sessionId === sessionId)
        .map((p) => ({ ...p, nickname: getMemberNickname(p.teamMemberId) }))
    })
  },

  updateParticipation(sessionId: string, teamMemberId: string, participating: boolean): Promise<void> {
    return simulateLatency(() => {
      getMyMemberOfSession(sessionId)
      const participant = findOrThrow(
        db.participants.find((p) => p.sessionId === sessionId && p.teamMemberId === teamMemberId),
        '참여자 정보를 찾을 수 없습니다.',
      )
      participant.participating = participating
      if (!participating) {
        db.ballots = db.ballots.filter((ballot) => !(ballot.sessionId === sessionId && ballot.teamMemberId === teamMemberId))
      }
    })
  },

  getCandidates(sessionId: string): Promise<CandidateDetail[]> {
    return simulateLatency(() => {
      const { teamId } = getSessionOrThrow(sessionId)
      getMyMember(teamId)
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

  deleteCandidate(sessionId: string, candidateId: string): Promise<void> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      getMyMember(session.teamId)
      if (session.status !== VOTE_STATUS.OPEN) throw new ApiError('CONFLICT', '진행 중인 투표의 후보만 삭제할 수 있습니다.')
      findOrThrow(
        db.candidates.find((candidate) => candidate.id === candidateId && candidate.sessionId === sessionId),
        '후보를 찾을 수 없습니다.',
      )
      db.candidates = db.candidates.filter((candidate) => candidate.id !== candidateId)
      db.ballots = db.ballots.filter((ballot) => ballot.candidateId !== candidateId)
    })
  },

  getRecommendedCandidates(sessionId: string, page = 0): Promise<RecommendedCandidate[]> {
    return simulateLatency(() => {
      const { teamId } = getSessionOrThrow(sessionId)
      getMyMember(teamId)
      const cutoff = Date.now() - RECOMMENDATION_EXCLUDE_DAYS * MS_PER_DAY
      const teamSessionIds = db.sessions.filter((s) => s.teamId === teamId).map(({ id }) => id)
      const recentlyConfirmed = db.decisions
        .filter((d) => teamSessionIds.includes(d.sessionId) && new Date(d.confirmedAt).getTime() >= cutoff)
        .map(({ restaurantId }) => restaurantId)
      const candidateIds = db.candidates.filter((c) => c.sessionId === sessionId).map(({ restaurantId }) => restaurantId)
      const participantCount = db.participants.filter((p) => p.sessionId === sessionId && p.participating).length

      const eligible = db.teamRestaurants
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

      if (eligible.length <= RECOMMENDATION_LIMIT) return eligible
      const offset = (page * RECOMMENDATION_LIMIT) % eligible.length
      return Array.from(
        { length: RECOMMENDATION_LIMIT },
        (_, index) => eligible[(offset + index) % eligible.length],
      )
    })
  },

  saveBallots(sessionId: string, candidateIds: string[]): Promise<LunchBallot[]> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      const me = getMyMember(session.teamId)
      const participant = db.participants.find((p) => p.sessionId === sessionId && p.teamMemberId === me.id)
      if (!canCastVote(session, participant?.participating ?? false, Date.now())) {
        throw new ApiError('CONFLICT', '투표할 수 없는 상태입니다.')
      }
      const uniqueCandidateIds = [...new Set(candidateIds)]
      if (uniqueCandidateIds.length === 0) throw new ApiError('BAD_REQUEST', '한 개 이상의 후보를 선택해 주세요.')
      uniqueCandidateIds.forEach((candidateId) =>
        findOrThrow(db.candidates.find((c) => c.id === candidateId && c.sessionId === sessionId), '후보를 찾을 수 없습니다.'),
      )
      const now = new Date().toISOString()
      db.ballots = db.ballots.filter((ballot) => !(ballot.sessionId === sessionId && ballot.teamMemberId === me.id))
      const ballots = uniqueCandidateIds.map((candidateId) => ({
        id: nextId('b'), sessionId, candidateId, teamMemberId: me.id, createdAt: now, updatedAt: now,
      }))
      db.ballots.push(...ballots)
      return ballots
    })
  },

  deleteBallots(sessionId: string): Promise<void> {
    return simulateLatency(() => {
      const session = getSessionOrThrow(sessionId)
      const me = getMyMember(session.teamId)
      if (!isVoteOpen(session, Date.now())) throw new ApiError('CONFLICT', '투표가 종료되었습니다.')
      db.ballots = db.ballots.filter((ballot) => !(ballot.sessionId === sessionId && ballot.teamMemberId === me.id))
    })
  },

  getVoteResults(sessionId: string): Promise<VoteResultsSnapshot> {
    return simulateLatency(() => {
      getMyMemberOfSession(sessionId)
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
