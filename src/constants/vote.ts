import type { CandidateSource, ConfirmationType, VoteStatus } from '@/types/vote'

export const DEFAULT_VOTE_DURATION_HOURS = 3
export const MAX_VOTE_NAME_LENGTH = 40

export const VOTE_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  CONFIRMED: 'CONFIRMED',
} as const

export const CONFIRMATION_TYPE = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
} as const

export const CANDIDATE_SOURCE = {
  MANUAL: 'MANUAL',
  RECOMMENDED: 'RECOMMENDED',
} as const

export const VOTE_STATUS_LABEL = {
  OPEN: '투표 중',
  CLOSED: '종료',
  CONFIRMED: '확정',
} satisfies Record<VoteStatus, string>

export const CONFIRMATION_TYPE_LABEL = {
  AUTO: '자동 확정',
  MANUAL: '수동 확정',
} satisfies Record<ConfirmationType, string>

export const CANDIDATE_SOURCE_LABEL = {
  MANUAL: '직접 추가',
  RECOMMENDED: '추천',
} satisfies Record<CandidateSource, string>

export const RECOMMENDATION_EXCLUDE_DAYS = 7
export const RECOMMENDATION_LIMIT = 1
