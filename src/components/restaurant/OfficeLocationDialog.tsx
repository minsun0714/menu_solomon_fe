import { type FormEvent, useEffect, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, LoaderCircle, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { placeSearchService } from '@/services/placeSearchService'
import type { OfficeLocation, PlaceSearchPage } from '@/types/restaurant'

type OfficeLocationDialogProps = {
  value: OfficeLocation | null
  onSave: (location: OfficeLocation) => void
}

export function OfficeLocationDialog({ value, onSave }: OfficeLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchedKeyword, setSearchedKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<PlaceSearchPage | null>(null)
  const [selected, setSelected] = useState<OfficeLocation | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    if (!searchedKeyword) return
    let disposed = false
    setStatus('loading')

    placeSearchService.search(searchedKeyword, page, 5)
      .then((searchResult) => {
        if (!disposed) {
          setResult(searchResult)
          setStatus('idle')
        }
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })

    return () => { disposed = true }
  }, [page, searchedKeyword])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setKeyword('')
      setSearchedKeyword('')
      setPage(1)
      setResult(null)
      setSelected(null)
      setStatus('idle')
    }
  }
  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = keyword.trim()
    if (!query) return
    setSelected(null)
    setPage(1)
    setSearchedKeyword(query)
  }
  const handleSave = () => {
    if (!selected) return
    onSave(selected)
    handleOpenChange(false)
  }

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Building2 /> {value ? '사무실 위치 변경' : '사무실 주소 설정'}
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>사무실 주소 설정</DialogTitle>
            <DialogDescription>카카오맵에서 사무실이나 주소를 검색한 뒤 위치를 선택하세요.</DialogDescription>
          </DialogHeader>

          {value && (
            <div className="rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="font-medium">현재 위치</span>
              <span className="ml-2 text-muted-foreground">{value.name} · {value.address}</span>
            </div>
          )}

          <form className="flex gap-2" onSubmit={handleSearch}>
            <Input autoFocus aria-label="사무실 주소 검색" placeholder="회사명 또는 도로명 주소 검색" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            <Button type="submit" className="shrink-0" disabled={!keyword.trim() || status === 'loading'}>
              {status === 'loading' ? <LoaderCircle className="animate-spin" /> : <Search />} 검색
            </Button>
          </form>

          {!searchedKeyword ? (
            <div className="border-y px-4 py-6 text-center">
              <Building2 className="mx-auto mb-2 size-4 text-muted-foreground" />
              <p className="text-sm font-medium">사무실 위치를 검색해 보세요</p>
              <p className="mt-1 text-xs text-muted-foreground">회사명이나 정확한 주소를 입력하면 쉽게 찾을 수 있어요.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <p><span className="font-semibold">‘{searchedKeyword}’</span> 검색 결과</p>
                <span className="text-xs text-muted-foreground">{result?.totalCount ?? 0}곳</span>
              </div>
              <div className="grid min-h-52 content-start gap-2">
                {status === 'error' && <p className="py-16 text-center text-sm text-destructive">검색 중 오류가 발생했어요.</p>}
                {status !== 'error' && result?.items.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">검색 결과가 없어요.</p>}
                {result?.items.map((place) => {
                  const isSelected = selected?.kakaoPlaceId === place.kakaoPlaceId
                  return (
                    <button
                      key={place.kakaoPlaceId}
                      type="button"
                      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelected(place)}
                    >
                      <MapPin className={`size-5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{place.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{place.address}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
              {(result?.totalPages ?? 0) > 1 && (
                <div className="flex items-center justify-center gap-3 border-t pt-3">
                  <Button type="button" variant="outline" size="icon" disabled={page <= 1 || status === 'loading'} onClick={() => setPage(page - 1)}><ChevronLeft /><span className="sr-only">이전 페이지</span></Button>
                  <span className="min-w-14 text-center text-sm"><strong>{result?.page ?? page}</strong> / {result?.totalPages}</span>
                  <Button type="button" variant="outline" size="icon" disabled={!result?.hasNextPage || status === 'loading'} onClick={() => setPage(page + 1)}><ChevronRight /><span className="sr-only">다음 페이지</span></Button>
                </div>
              )}
            </div>
          )}
          <Button type="button" disabled={!selected} onClick={handleSave}>선택한 위치 저장</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
