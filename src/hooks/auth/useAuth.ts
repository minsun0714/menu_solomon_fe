import { useCurrentUserQuery } from './useCurrentUserQuery'

export function useAuth() {
  const { data: user = null, isLoading, isError, refetch } = useCurrentUserQuery()

  return {
    user,
    isLoading,
    isError,
    refetch,
  }
}
