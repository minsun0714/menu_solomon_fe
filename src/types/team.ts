import type { User } from './user'

export type TeamRole = 'ADMIN' | 'MEMBER'

export type Team = {
  id: string
  name: string
  description: string
}

export type TeamDetail = Team & {
  myRole: TeamRole
}

export type TeamInvite = {
  inviteUrl: string
}

export type TeamMember = {
  id: string
  teamId: string
  userId: string
  role: TeamRole
  joinedAt: string
}

export type TeamMemberProfile = TeamMember & { user: Pick<User, 'id' | 'nickname'>; isMe?: boolean }

export type TeamSummary = Team & {
  memberCount: number
  myRole: TeamRole
}

export type TeamPreview = Team & {
  memberCount: number
  members: TeamMemberProfile[]
  isAlreadyMember: boolean
}

export type TeamRequest = {
  name: string
  description: string
}
