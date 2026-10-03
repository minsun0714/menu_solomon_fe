import { DEMO_USER_ID, db, getUserOrThrow, simulateLatency } from '@/mocks/api/db'
import type { User } from '@/types/user'

export const authService = {
  getCurrentUser(): Promise<User | null> {
    return simulateLatency(() => (db.currentUserId ? getUserOrThrow(db.currentUserId) : null))
  },

  login(): Promise<User> {
    return simulateLatency(() => {
      db.currentUserId = DEMO_USER_ID
      return getUserOrThrow(DEMO_USER_ID)
    })
  },

  logout(): Promise<void> {
    return simulateLatency(() => {
      db.currentUserId = null
    })
  },
}
