import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL_CATEGORIES, RESTAURANT_SORT, RESTAURANT_SORT_LABEL, type RestaurantCategoryCount, type RestaurantSort } from '@/domain/restaurantRules'

type RestaurantFilterBarProps = {
  keyword: string
  category: string
  categoryCounts: RestaurantCategoryCount[]
  sort: RestaurantSort
  onKeywordChange: (keyword: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: RestaurantSort) => void
}

export function RestaurantFilterBar({ keyword, category, categoryCounts, sort, onKeywordChange, onCategoryChange, onSortChange }: RestaurantFilterBarProps) {
  const categories = [
    { category: ALL_CATEGORIES, count: categoryCounts.reduce((sum, item) => sum + item.count, 0) },
    ...categoryCounts,
  ]
  return (
    <div className="grid flex-1 gap-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-64 max-w-sm flex-1">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="식당 이름, 메뉴, 지역으로 검색..." value={keyword} onChange={(e) => onKeywordChange(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <Select value={sort} onValueChange={(value) => onSortChange(value as RestaurantSort)}>
            <SelectTrigger className="w-40" aria-label="식당 정렬"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(RESTAURANT_SORT).map((value) => (
                <SelectItem key={value} value={value}>{RESTAURANT_SORT_LABEL[value]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="카테고리 필터">
        {categories.map((item) => {
          const selected = category === item.category
          return (
            <button key={item.category} type="button" className="cursor-pointer" aria-pressed={selected} onClick={() => onCategoryChange(item.category)}>
              <Badge variant={selected ? 'default' : 'outline'} className="px-3 py-1 text-xs transition-colors hover:bg-accent hover:text-accent-foreground">
                {item.category === ALL_CATEGORIES ? '전체' : item.category}
                <span className={selected ? 'text-primary-foreground/75' : 'text-muted-foreground'}>{item.count}</span>
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
