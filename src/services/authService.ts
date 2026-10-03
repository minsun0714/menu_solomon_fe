import { db, getUserOrThrow, simulateLatency } from '@/mocks/api/db'

export const authService = {
  getCurrentUser() {
    return simulateLatency(() => getUserOrThrow(db.currentUserId))
  },
}
