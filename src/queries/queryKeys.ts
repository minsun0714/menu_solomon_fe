export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  team: {
    all: ['team'] as const,
    detail: (teamId: string) => ['team', 'detail', teamId] as const,
    members: (teamId: string) => ['team', 'members', teamId] as const,
    preview: (inviteToken: string) => ['team', 'preview', inviteToken] as const,
  },
  restaurant: {
    all: ['restaurant'] as const,
    list: (teamId: string) => ['restaurant', 'list', teamId] as const,
    detail: (teamRestaurantId: string) => ['restaurant', 'detail', teamRestaurantId] as const,
    search: (keyword: string) => ['restaurant', 'search', keyword] as const,
  },
  review: {
    all: ['review'] as const,
    list: (teamRestaurantId: string) => ['review', 'list', teamRestaurantId] as const,
  },
  vote: {
    all: ['vote'] as const,
    sessions: (teamId: string) => ['vote', 'sessions', teamId] as const,
    detail: (sessionId: string) => ['vote', 'detail', sessionId] as const,
    participants: (sessionId: string) => ['vote', 'participants', sessionId] as const,
    teamParticipation: (teamId: string) => ['vote', 'team-participation', teamId] as const,
    candidates: (sessionId: string) => ['vote', 'candidates', sessionId] as const,
    recommended: (sessionId: string) => ['vote', 'recommended', sessionId] as const,
    results: (sessionId: string) => ['vote', 'results', sessionId] as const,
  },
  history: {
    all: ['history'] as const,
    weekly: (teamId: string, date: string) => ['history', 'weekly', teamId, date] as const,
    monthly: (teamId: string, month: string) => ['history', 'monthly', teamId, month] as const,
  },
} as const
