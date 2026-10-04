export const ROUTES = {
  LANDING: '/',
  INVITATION: (inviteCode: string = ':inviteCode') => `/invite/${inviteCode}`,
  TEAM_DETAIL: (teamId: string = ':teamId') => `/teams/${teamId}`,
  VOTE_DETAIL: (teamId: string = ':teamId', sessionId: string = ':sessionId') =>
    `/teams/${teamId}/votes/${sessionId}`,
  RESTAURANT_DETAIL: (teamId: string = ':teamId', teamRestaurantId: string = ':teamRestaurantId') =>
    `/teams/${teamId}/restaurants/${teamRestaurantId}`,
} as const

export const TEAM_TAB = {
  VOTE: 'vote',
  RESTAURANTS: 'restaurants',
  HISTORY: 'history',
} as const

export type TeamTab = (typeof TEAM_TAB)[keyof typeof TEAM_TAB]

export function parseTeamTab(value: string | null): TeamTab {
  return Object.values(TEAM_TAB).find((tab) => tab === value) ?? TEAM_TAB.RESTAURANTS
}
