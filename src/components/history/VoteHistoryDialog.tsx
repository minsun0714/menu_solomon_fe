import { Trophy, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { useVoteSession } from '@/hooks/vote/useVoteSession'

type VoteHistoryDialogProps = {
  teamId: string
  sessionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoteHistoryDialog({ teamId, sessionId, open, onOpenChange }: VoteHistoryDialogProps) {
  const { candidates, results, winnerCandidates, participatingMembers, decision, isLoading, isError } =
    useVoteSession(teamId, sessionId)
  const winnerIds = winnerCandidates.map(({ id }) => id)
  const decidedRestaurant = candidates.find(({ restaurantId }) => restaurantId === decision?.restaurantId)?.restaurant

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>투표 #{sessionId} 결과</DialogTitle>
          <DialogDescription>
            {decidedRestaurant ? `확정 메뉴: ${decidedRestaurant.name}` : '후보별 최종 득표 결과입니다.'}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <ListSkeleton count={3} />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">투표 결과를 불러오지 못했습니다.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" /> 참여 {participatingMembers.length}명
            </div>
            <div className="grid gap-3">
              {candidates.map((candidate) => {
                const result = results.find(({ candidateId }) => candidateId === candidate.id)
                const voteCount = result?.voteCount ?? 0
                const percentage = result?.percentage ?? 0
                return (
                  <div key={candidate.id} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{candidate.restaurant.name}</span>
                      <div className="flex items-center gap-2">
                        {winnerIds.includes(candidate.id) && <Badge variant="success"><Trophy /> 최다 득표</Badge>}
                        <span className="text-sm tabular-nums text-muted-foreground">{voteCount}표 · {percentage}%</span>
                      </div>
                    </div>
                    <Progress value={percentage} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
