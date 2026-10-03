import type { User } from './user'

export type TeamRole = 'ADMIN' | 'MEMBER'

export type Team = {
  id: string
  name: string
  description: string
  inviteToken: string
}

export type TeamMember = {
  id: string
  teamId: string
  userId: string
  role: TeamRole
  joinedAt: string
}

export type TeamMemberProfile = TeamMember & { user: User }

export type TeamSummary = Team & {
  memberCount: number
  myRole: TeamRole
  activeVoteCount: number
  latestLunch: { restaurantName: string; confirmedAt: string } | null
}

export type TeamPreview = Team & {
  memberCount: number
  members: TeamMemberProfile[]
}

export type TeamRequest = {
  name: string
  description: string
}
