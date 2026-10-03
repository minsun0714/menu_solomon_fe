import { Utensils } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { ROUTES } from '@/constants/routes'
import { useRequireAuth } from '@/hooks/auth/AuthPromptContext'
import { useTeamRestaurants } from '@/hooks/restaurant/useTeamRestaurants'
import { AddRestaurantDialog } from './AddRestaurantDialog'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantFilterBar } from './RestaurantFilterBar'

export function RestaurantsTab({ teamId }: { teamId: string }) {
  const navigate = useNavigate()
  const { requireAuth } = useRequireAuth()
  const {
    restaurants, totalCount, categories, registeredRestaurantIds, keyword, category,
    setKeyword, setCategory, isLoading, isError, isAdding, isDeleting, addRestaurant, deleteRestaurant,
  } = useTeamRestaurants(teamId)

  const handleOpenDetail = (teamRestaurantId: string) => navigate(ROUTES.RESTAURANT_DETAIL(teamId, teamRestaurantId))
  const handleDelete = (teamRestaurantId: string) => requireAuth(() => deleteRestaurant(teamRestaurantId))

  if (isLoading) return <ListSkeleton count={4} itemClassName="h-36" />
  if (isError) return <ErrorState />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RestaurantFilterBar keyword={keyword} category={category} categories={categories} onKeywordChange={setKeyword} onCategoryChange={setCategory} />
        <AddRestaurantDialog registeredRestaurantIds={registeredRestaurantIds} isAdding={isAdding} guard={requireAuth} onAdd={addRestaurant} />
      </div>
      <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">지도 연동은 추후 추가될 예정입니다.</p>
      {restaurants.length === 0 ? (
        <EmptyState icon={Utensils} title={totalCount === 0 ? '등록된 식당이 없어요' : '검색 결과가 없어요'} description="식당 추가 버튼으로 팀의 맛집을 등록해 보세요." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((item) => (
            <RestaurantCard key={item.id} item={item} isDeleting={isDeleting} onOpenDetail={handleOpenDetail} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
