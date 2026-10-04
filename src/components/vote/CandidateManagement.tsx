import { useState } from 'react'
import { Plus, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Rating } from '@/components/common/Rating'
import { useCandidateManagement } from '@/hooks/vote/useCandidateManagement'
import type { CandidateDetail } from '@/types/vote'

type CandidateManagementProps = {
  teamId: string
  sessionId: string
  candidates: CandidateDetail[]
  canAdd: boolean
}

export function CandidateManagement({ teamId, sessionId, candidates, canAdd }: CandidateManagementProps) {
  const [open, setOpen] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const {
    keyword, setKeyword, recommended, searchResults, isRecommendedLoading, isRecommendedFetching,
    isAdding, refreshRecommendations, addCandidate, addRecommended,
  } = useCandidateManagement(teamId, sessionId, canAdd, showRecommendations)

  const candidateKakaoPlaceIds = candidates.map(({ restaurant }) => restaurant.kakaoPlaceId)
  const selectableResults = searchResults.filter(({ kakaoPlaceId }) => !candidateKakaoPlaceIds.includes(kakaoPlaceId))

  if (!canAdd) return null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full" onClick={() => setShowRecommendations((value) => !value)}>
          <Sparkles /> 오늘의 추천 점심
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setOpen(true)}><Plus /> 후보 추가</Button>
      </div>
      {showRecommendations && (
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-primary" />오늘의 추천 점심</CardTitle>
              <p className="text-xs text-muted-foreground">불참자 제외 · 평점 반영 · 최근 7일 확정 제외</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isRecommendedFetching}
              aria-label="다른 추천 보기"
              title="다른 추천 보기"
              onClick={refreshRecommendations}
            >
              <RefreshCw className={isRecommendedFetching ? 'animate-spin' : undefined} />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2">
            {isRecommendedLoading ? (
              <p className="text-sm text-muted-foreground">추천 메뉴를 찾고 있어요...</p>
            ) : recommended.length === 0 ? (
              <p className="text-sm text-muted-foreground">추천할 식당이 없어요.</p>
            ) : recommended.map(({ restaurant, averageRating, reason }) => (
              <div key={restaurant.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{restaurant.name} <span className="text-muted-foreground">· {restaurant.category}</span></p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Rating value={averageRating} />{reason}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isAdding}
                  onClick={() => addRecommended(restaurant.kakaoPlaceId, () => setShowRecommendations(false))}
                >
                  추가
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>후보 추가</DialogTitle>
            <DialogDescription>카카오맵에서 식당을 검색해 후보로 추가하세요.</DialogDescription>
          </DialogHeader>
          <Input placeholder="식당 이름, 메뉴, 지역으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <div className="grid max-h-72 gap-2 overflow-y-auto">
            {selectableResults.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">검색 결과가 없어요.</p>}
            {selectableResults.map(({ kakaoPlaceId, name, category, address }) => (
              <div key={kakaoPlaceId} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{name} <span className="text-muted-foreground">· {category}</span></p>
                  <p className="truncate text-xs text-muted-foreground">{address}</p>
                </div>
                <Button size="sm" disabled={isAdding} onClick={() => addCandidate(kakaoPlaceId, () => setOpen(false))}>추가</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
