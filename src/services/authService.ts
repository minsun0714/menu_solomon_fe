import { api } from '@/lib/api'
import { analytics } from '@/lib/analytics'
import type { User } from '@/types/user'

export const authService = {
  async getCurrentUser() {
    const user = await api.get<User>('/session/me')
    analytics.identify(user.id)
    return user
  },

  updateNickname(nickname: string) {
    return api.patch<User>('/session/me', { nickname })
  },
}
