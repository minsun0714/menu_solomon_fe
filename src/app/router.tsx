import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ROUTES } from '@/constants/routes'
import { LandingPage } from '@/pages/LandingPage'
import { RestaurantDetailPage } from '@/pages/RestaurantDetailPage'
import { TeamDetailPage } from '@/pages/TeamDetailPage'
import { TeamInvitationPage } from '@/pages/TeamInvitationPage'
import { VoteDetailPage } from '@/pages/VoteDetailPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.LANDING, element: <LandingPage /> },
      { path: '/teams', element: <Navigate to={ROUTES.LANDING} replace /> },
      { path: ROUTES.INVITATION(), element: <TeamInvitationPage /> },
      { path: ROUTES.TEAM_DETAIL(), element: <TeamDetailPage /> },
      { path: ROUTES.VOTE_DETAIL(), element: <VoteDetailPage /> },
      { path: ROUTES.RESTAURANT_DETAIL(), element: <RestaurantDetailPage /> },
    ],
  },
])
