import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DIALOG_MESSAGES } from '@/constants/messages'
import { ROUTES } from '@/constants/routes'
import { useVoteManagement } from '@/hooks/vote/useVoteManagement'
import { cn } from '@/lib/cn'

type VoteDeleteMenuProps = {
  teamId: string
  sessionId: string
  className?: string
  navigateAfterDelete?: boolean
}

export function VoteDeleteMenu({ teamId, sessionId, className, navigateAfterDelete = true }: VoteDeleteMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { isPending, deleteVote } = useVoteManagement(teamId, sessionId)
  const handleDelete = () => deleteVote(navigateAfterDelete ? () => navigate(ROUTES.TEAM_DETAIL(teamId)) : undefined)

  return (
    <div className={cn('z-10', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isPending} aria-label="투표 메뉴" title="투표 메뉴">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setDialogOpen(true)}>
            <Trash2 /> 투표 삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{DIALOG_MESSAGES.DELETE_VOTE.title}</AlertDialogTitle>
            <AlertDialogDescription>{DIALOG_MESSAGES.DELETE_VOTE.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={handleDelete}>
              {DIALOG_MESSAGES.DELETE_VOTE.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
