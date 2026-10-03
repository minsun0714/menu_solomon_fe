import { useCurrentUserQuery } from './useCurrentUserQuery'
import { useLoginMutation, useLogoutMutation } from './useAuthMutations'

export function useAuth() {
  const { data: user = null, isLoading } = useCurrentUserQuery()
  const { mutate: login, isPending: isLoggingIn } = useLoginMutation()
  const { mutate: logout } = useLogoutMutation()

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    isLoggingIn,
    login: (onSuccess?: () => void) => login(undefined, { onSuccess }),
    logout: () => logout(),
  }
}
