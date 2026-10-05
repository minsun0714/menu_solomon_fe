import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TOAST_MESSAGES } from '@/constants/messages'
import { ApiError } from '@/lib/api'

type AppMutationOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>
  invalidateKeys: (variables: TVariables, data: TData) => QueryKey[]
  successMessage?: string
  trackSuccess?: (data: TData, variables: TVariables) => void
}

export function useAppMutation<TData, TVariables = void>({
  mutationFn,
  invalidateKeys,
  successMessage,
  trackSuccess,
}: AppMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: async (data, variables) => {
      trackSuccess?.(data, variables)
      await Promise.all(invalidateKeys(variables, data).map((queryKey) => queryClient.invalidateQueries({ queryKey })))
      if (successMessage) toast.success(successMessage)
    },
    onError: (error) => {
      if (error instanceof ApiError && Object.keys(error.problem.fieldErrors ?? {}).length > 0) return
      toast.error(error.message || TOAST_MESSAGES.GENERIC_ERROR)
    },
  })
}
