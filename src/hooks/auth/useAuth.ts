import { useCurrentUserQuery } from './useCurrentUserQuery'

export function useAuth() {
  const { data: user = null, isLoading } = useCurrentUserQuery()

  return {
    user,
    isLoading,
  }
}
