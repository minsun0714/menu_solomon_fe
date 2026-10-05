import { useState } from 'react'
import { MapPinned, Plus, RefreshCw, Sparkles, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rating } from '@/components/common/Rating'
import { useCandidateManagement, type CandidateSourceTab } from '@/hooks/vote/useCandidateManagement'
import type { Place } from '@/types/restaurant'
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
  const [sourceTab, setSourceTab] = useState<CandidateSourceTab>('TEAM')
  const {
    keyword, setKeyword, recommended, teamRestaurants, searchResults, isRecommendedLoading, isRecommendedFetching,
    isSearching, isTeamRestaurantsLoading, isAdding, refreshRecommendations, addCandidate, addRecommended,
  } = useCandidateManagement(teamId, sessionId, canAdd, showRecommendations, open, sourceTab)

  const candidateKakaoPlaceIds = candidates.map(({ restaurant }) => restaurant.kakaoPlaceId)
  const isRegisteredCandidate = (kakaoPlaceId: string) => candidateKakaoPlaceIds.includes(kakaoPlaceId)
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setKeyword('')
      setSourceTab('TEAM')
    }
  }
  const handleSourceTabChange = (value: string) => {
    setSourceTab(value as CandidateSourceTab)
    setKeyword('')
  }

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
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>후보 추가</DialogTitle>
            <DialogDescription>팀 식당에서 고르거나 카카오맵에서 새로운 식당을 검색하세요.</DialogDescription>
          </DialogHeader>
          <Tabs value={sourceTab} onValueChange={handleSourceTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="TEAM"><Store /> 팀 식당</TabsTrigger>
              <TabsTrigger value="KAKAO"><MapPinned /> 카카오맵 검색</TabsTrigger>
            </TabsList>
            <Input
              placeholder={sourceTab === 'TEAM' ? '팀 식당 이름, 메뉴, 지역으로 검색' : '카카오맵에서 식당 검색'}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <TabsContent value="TEAM">
              <div className="grid max-h-80 gap-2 overflow-y-auto">
                {isTeamRestaurantsLoading ? (
                  <CandidateOptionsLoading />
                ) : teamRestaurants.length === 0 ? (
                  <CandidateOptionsEmpty message={keyword ? '검색된 팀 식당이 없어요.' : '등록된 팀 식당이 없어요.'} />
                ) : teamRestaurants.map(({ id, restaurant, averageRating, reviewCount }) => (
                  <CandidateOption
                    key={id}
                    place={restaurant}
                    averageRating={averageRating ?? 0}
                    reviewCount={reviewCount}
                    registered={isRegisteredCandidate(restaurant.kakaoPlaceId)}
                    isAdding={isAdding}
                    onAdd={() => addCandidate(restaurant.kakaoPlaceId, () => handleOpenChange(false))}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="KAKAO">
              <div className="grid max-h-80 gap-2 overflow-y-auto">
                {!keyword.trim() ? (
                  <CandidateOptionsEmpty message="추가할 식당을 검색해 보세요." />
                ) : isSearching ? (
                  <CandidateOptionsLoading />
                ) : searchResults.length === 0 ? (
                  <CandidateOptionsEmpty message="카카오맵 검색 결과가 없어요." />
                ) : searchResults.map((place) => (
                  <CandidateOption
                    key={place.kakaoPlaceId}
                    place={place}
                    registered={isRegisteredCandidate(place.kakaoPlaceId)}
                    isAdding={isAdding}
                    onAdd={() => addCandidate(place.kakaoPlaceId, () => handleOpenChange(false))}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type CandidateOptionProps = {
  place: Place
  averageRating?: number
  reviewCount?: number
  registered: boolean
  isAdding: boolean
  onAdd: () => void
}

function CandidateOption({ place, averageRating, reviewCount, registered, isAdding, onAdd }: CandidateOptionProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-medium">
          {place.name} <span className="text-muted-foreground">· {place.category}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">{place.address}</p>
        {averageRating !== undefined && <Rating value={averageRating} reviewCount={reviewCount} />}
      </div>
      <Button size="sm" variant={registered ? 'secondary' : 'default'} disabled={registered || isAdding} onClick={onAdd}>
        {registered ? '추가됨' : '추가'}
      </Button>
    </div>
  )
}

function CandidateOptionsLoading() {
  return <p className="py-8 text-center text-sm text-muted-foreground">식당을 불러오고 있어요...</p>
}

function CandidateOptionsEmpty({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>
}
