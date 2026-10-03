import { useMemo, useState, type ReactNode } from 'react'
import { AuthPromptContext } from '@/hooks/auth/AuthPromptContext'
import { useAuth } from '@/hooks/auth/useAuth'
import { LoginRequiredDialog } from './LoginRequiredDialog'

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoggingIn, login } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({
      requireAuth: (action: () => void) => (isAuthenticated ? action() : setIsOpen(true)),
      openLoginDialog: () => setIsOpen(true),
    }),
    [isAuthenticated],
  )

  const handleLogin = () => login(() => setIsOpen(false))

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <LoginRequiredDialog open={isOpen} isLoggingIn={isLoggingIn} onOpenChange={setIsOpen} onLogin={handleLogin} />
    </AuthPromptContext.Provider>
  )
}
