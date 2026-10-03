import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthPromptProvider } from '@/components/auth/AuthPromptProvider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthPromptProvider>
          <RouterProvider router={router} />
        </AuthPromptProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)
