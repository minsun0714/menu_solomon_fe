import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Rating } from '@/components/common/Rating'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useCandidateManagement } from '@/hooks/vote/useCandidateManagement'
import type { CandidateDetail } from '@/types/vote'

type CandidateManagementProps = {
  teamId: string
  sessionId: string
  candidates: CandidateDetail[]
  canAdd: boolean
}

export function CandidateManagement({ teamId, sessionId, candidates, canAdd }: CandidateManagementProps) {
  const { requireAuth } = useRequireAuth()
  const [open, setOpen] = useState(false)
  const { keyword, setKeyword, recommended, searchResults, isAdding, addCandidate, addRecommended } =
    useCandidateManagement(teamId, sessionId, canAdd)

  const candidateRestaurantIds = candidates.map(({ restaurantId }) => restaurantId)
  const selectableResults = searchResults.filter(({ id }) => !candidateRestaurantIds.includes(id))

  if (!canAdd) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-primary" />오늘의 추천 점심</CardTitle>
          <span className="text-xs text-muted-foreground">불참자 제외 · 평점 반영 · 최근 7일 확정 제외 (목업)</span>
        </CardHeader>
        <CardContent className="grid gap-2">
          {recommended.length === 0 && <p className="text-sm text-muted-foreground">추천할 식당이 없어요.</p>}
          {recommended.map(({ restaurant, averageRating, reason }) => (
            <div key={restaurant.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{restaurant.name} <span className="text-muted-foreground">· {restaurant.category}</span></p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Rating value={averageRating} />{reason}</div>
              </div>
              <Button size="sm" variant="outline" disabled={isAdding} onClick={() => requireAuth(() => addRecommended(restaurant.id))}>추가</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => requireAuth(() => setOpen(true))}><Plus /> 후보 추가</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>후보 추가</DialogTitle>
            <DialogDescription>식당 목록(목업)에서 검색해 후보로 추가하세요.</DialogDescription>
          </DialogHeader>
          <Input placeholder="식당 이름, 카테고리, 주소 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <div className="grid max-h-72 gap-2 overflow-y-auto">
            {selectableResults.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">검색 결과가 없어요.</p>}
            {selectableResults.map(({ id, name, category, address }) => (
              <div key={id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{name} <span className="text-muted-foreground">· {category}</span></p>
                  <p className="truncate text-xs text-muted-foreground">{address}</p>
                </div>
                <Button size="sm" disabled={isAdding} onClick={() => addCandidate(id, () => setOpen(false))}>추가</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
