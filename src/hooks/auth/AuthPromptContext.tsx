import { createContext, useContext } from 'react'

type AuthPromptValue = {
  /** Runs the action when authenticated, otherwise opens the login-required dialog. */
  requireAuth: (action: () => void) => void
  openLoginDialog: () => void
}

export const AuthPromptContext = createContext<AuthPromptValue | null>(null)

export function useRequireAuth(): AuthPromptValue {
  const value = useContext(AuthPromptContext)
  if (!value) throw new Error('useRequireAuth must be used within AuthPromptProvider')
  return value
}
