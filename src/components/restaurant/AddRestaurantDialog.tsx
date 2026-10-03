import { type FormEvent, useState } from 'react'
import { ChevronLeft, ChevronRight, LoaderCircle, MapPin, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRestaurantCatalogSearch } from '@/hooks/restaurant/useTeamRestaurants'

type AddRestaurantDialogProps = {
  registeredRestaurantIds: string[]
  isAdding: boolean
  onAdd: (restaurantId: string, onAdded: () => void) => void
  triggerLabel?: string
}

export function AddRestaurantDialog({ registeredRestaurantIds, isAdding, onAdd, triggerLabel = '식당 추가' }: AddRestaurantDialogProps) {
  const [open, setOpen] = useState(false)
  const {
    keyword, setKeyword, submittedKeyword, search, reset, results, pagination, page, setPage, isLoading,
  } = useRestaurantCatalogSearch()
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) reset()
  }
  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    search()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus /> {triggerLabel}</Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>식당 추가</DialogTitle>
            <DialogDescription>카카오맵에서 식당을 검색해 팀의 식당으로 추가하세요.</DialogDescription>
          </DialogHeader>
          <form className="flex gap-2" onSubmit={handleSearch}>
            <Input
              aria-label="식당 검색어"
              autoFocus
              placeholder="식당 이름, 메뉴, 지역으로 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Button type="submit" className="shrink-0" disabled={!keyword.trim() || isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : <Search />}
              검색
            </Button>
          </form>

          {!submittedKeyword && (
            <div className="rounded-xl border border-dashed px-4 py-10 text-center">
              <Search className="mx-auto mb-3 size-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">추가할 식당을 검색해 보세요</p>
              <p className="mt-1 text-xs text-muted-foreground">식당명뿐 아니라 메뉴나 지역으로도 찾을 수 있어요.</p>
            </div>
          )}

          {submittedKeyword && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <p><span className="font-semibold">‘{submittedKeyword}’</span> 검색 결과</p>
                <span className="text-xs text-muted-foreground">{pagination?.totalCount ?? 0}곳</span>
              </div>
              <div className="grid min-h-48 content-start gap-2">
                {!isLoading && results.length === 0 && (
                  <p className="py-16 text-center text-sm text-muted-foreground">검색 결과가 없어요. 다른 검색어를 입력해 보세요.</p>
                )}
                {results.map(({ id, name, category, address }) => {
                  const registered = registeredRestaurantIds.includes(id)
                  return (
                    <div key={id} className="flex items-center justify-between gap-3 rounded-xl border p-3.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{name}</p>
                          <Badge variant="secondary" className="shrink-0 font-normal">{category}</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" /> {address}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={registered ? 'secondary' : 'default'}
                        disabled={registered || isAdding}
                        onClick={() => onAdd(id, () => handleOpenChange(false))}
                      >
                        {registered ? '추가됨' : '추가'}
                      </Button>
                    </div>
                  )
                })}
              </div>

              {(pagination?.totalPages ?? 0) > 1 && (
                <div className="flex items-center justify-center gap-3 border-t pt-3">
                  <Button type="button" variant="outline" size="icon" disabled={page <= 1 || isLoading} onClick={() => setPage(page - 1)}>
                    <ChevronLeft /><span className="sr-only">이전 페이지</span>
                  </Button>
                  <span className="min-w-14 text-center text-sm"><strong>{page}</strong> / {pagination?.totalPages}</span>
                  <Button type="button" variant="outline" size="icon" disabled={!pagination?.hasNextPage || isLoading} onClick={() => setPage(page + 1)}>
                    <ChevronRight /><span className="sr-only">다음 페이지</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
