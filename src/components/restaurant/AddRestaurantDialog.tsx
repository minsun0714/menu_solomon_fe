import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRestaurantCatalogSearch } from '@/hooks/restaurant/useTeamRestaurants'

type AddRestaurantDialogProps = {
  registeredRestaurantIds: string[]
  isAdding: boolean
  guard: (action: () => void) => void
  onAdd: (restaurantId: string, onAdded: () => void) => void
}

export function AddRestaurantDialog({ registeredRestaurantIds, isAdding, guard, onAdd }: AddRestaurantDialogProps) {
  const [open, setOpen] = useState(false)
  const { keyword, setKeyword, results } = useRestaurantCatalogSearch()
  const selectable = results.filter(({ id }) => !registeredRestaurantIds.includes(id))

  return (
    <>
      <Button onClick={() => guard(() => setOpen(true))}><Plus /> 식당 추가</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>식당 추가</DialogTitle>
            <DialogDescription>식당 목록(목업)에서 검색해 팀 식당으로 추가하세요. 지도 연동은 추후 제공됩니다.</DialogDescription>
          </DialogHeader>
          <Input placeholder="식당 이름, 카테고리, 주소 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <div className="grid max-h-72 gap-2 overflow-y-auto">
            {selectable.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">추가할 수 있는 식당이 없어요.</p>}
            {selectable.map(({ id, name, category, address }) => (
              <div key={id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{name} <span className="text-muted-foreground">· {category}</span></p>
                  <p className="truncate text-xs text-muted-foreground">{address}</p>
                </div>
                <Button size="sm" disabled={isAdding} onClick={() => onAdd(id, () => setOpen(false))}>추가</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
