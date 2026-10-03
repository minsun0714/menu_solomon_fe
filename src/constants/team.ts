import type { TeamRole } from '@/types/team'

export const TEAM_ROLE = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const

export const TEAM_ROLE_LABEL = {
  ADMIN: '관리자',
  MEMBER: '멤버',
} satisfies Record<TeamRole, string>

export const MAX_TEAM_NAME_LENGTH = 30
export const MAX_TEAM_DESCRIPTION_LENGTH = 100
