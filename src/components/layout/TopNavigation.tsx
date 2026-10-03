import { Link, NavLink } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/common/UserAvatar'
import { APP_NAME } from '@/constants/config'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/auth/useAuth'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { cn } from '@/lib/cn'

export function TopNavigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const { openLoginDialog } = useRequireAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <UtensilsCrossed className="size-4" />
            </span>
            {APP_NAME}
          </Link>
          <nav aria-label="주요 메뉴" className="flex items-center gap-1 text-sm">
            <NavLink
              to={ROUTES.MY_TEAMS}
              className={({ isActive }) =>
                cn('rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent', isActive && 'bg-accent font-medium text-accent-foreground')
              }
            >
              내 팀
            </NavLink>
          </nav>
        </div>
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <UserAvatar user={user} className="size-6 border-0" />
                {user.nickname}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>데모 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout}>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" onClick={openLoginDialog}>
            로그인
          </Button>
        )}
      </div>
    </header>
  )
}
