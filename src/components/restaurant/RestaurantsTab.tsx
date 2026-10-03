import { useEffect, useState } from 'react'
import { Utensils } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { useTeamRestaurants } from '@/hooks/restaurant/useTeamRestaurants'
import { AddRestaurantDialog } from './AddRestaurantDialog'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantFilterBar } from './RestaurantFilterBar'
import { RestaurantMapPanel } from './RestaurantMapPanel'
import type { OfficeLocation } from '@/types/restaurant'

const getOfficeStorageKey = (teamId: string) => `menu-solomon:office-location:${teamId}`

function readOfficeLocation(teamId: string): OfficeLocation | null {
  try {
    const stored = localStorage.getItem(getOfficeStorageKey(teamId))
    return stored ? JSON.parse(stored) as OfficeLocation : null
  } catch {
    return null
  }
}

export function RestaurantsTab({ teamId }: { teamId: string }) {
  const [officeLocation, setOfficeLocation] = useState<OfficeLocation | null>(() => readOfficeLocation(teamId))
  const {
    restaurants, totalCount, categoryCounts, registeredRestaurantIds, keyword, category, sort,
    setKeyword, setCategory, setSort, isLoading, isError, isAdding, isDeleting, addRestaurant, deleteRestaurant,
  } = useTeamRestaurants(teamId)

  const handleDelete = (teamRestaurantId: string) => deleteRestaurant(teamRestaurantId)
  const handleOfficeLocationChange = (location: OfficeLocation) => {
    setOfficeLocation(location)
    localStorage.setItem(getOfficeStorageKey(teamId), JSON.stringify(location))
  }

  useEffect(() => setOfficeLocation(readOfficeLocation(teamId)), [teamId])

  if (isLoading) return <ListSkeleton count={4} itemClassName="h-36" />
  if (isError) return <ErrorState />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RestaurantFilterBar keyword={keyword} category={category} categoryCounts={categoryCounts} sort={sort} onKeywordChange={setKeyword} onCategoryChange={setCategory} onSortChange={setSort} />
        <AddRestaurantDialog registeredRestaurantIds={registeredRestaurantIds} isAdding={isAdding} onAdd={addRestaurant} />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(360px,0.85fr)_minmax(480px,1.35fr)]">
        {restaurants.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title={totalCount === 0 ? '등록된 식당이 없어요' : '검색 결과가 없어요'}
            description={totalCount === 0 ? '팀원들과 함께 갈 맛집을 등록해 보세요.' : '다른 검색어나 카테고리를 선택해 보세요.'}
            action={totalCount === 0 ? (
              <AddRestaurantDialog
                triggerLabel="첫 식당 추가하기"
                registeredRestaurantIds={registeredRestaurantIds}
                isAdding={isAdding}
                onAdd={addRestaurant}
              />
            ) : undefined}
          />
        ) : (
          <div className="grid content-start auto-rows-max gap-4 lg:h-[calc(100vh-4rem)] lg:min-h-[560px] lg:max-h-[720px] lg:overflow-y-auto lg:pr-2">
            {restaurants.map((item) => (
              <RestaurantCard key={item.id} item={item} isDeleting={isDeleting} onDelete={handleDelete} />
            ))}
          </div>
        )}
        <RestaurantMapPanel restaurants={restaurants} officeLocation={officeLocation} onOfficeLocationChange={handleOfficeLocationChange} />
      </div>
    </div>
  )
}
