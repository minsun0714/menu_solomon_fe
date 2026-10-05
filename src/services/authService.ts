import { api } from '@/lib/api'
import type { User } from '@/types/user'

export const authService = {
  getCurrentUser() {
    return api.get<User>('/session/me')
  },

  updateNickname(nickname: string) {
    return api.patch<User>('/session/me', { nickname })
  },
}
