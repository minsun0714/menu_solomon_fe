import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL_CATEGORIES } from '@/domain/restaurantRules'

type RestaurantFilterBarProps = {
  keyword: string
  category: string
  categories: string[]
  onKeywordChange: (keyword: string) => void
  onCategoryChange: (category: string) => void
}

export function RestaurantFilterBar({ keyword, category, categories, onKeywordChange, onCategoryChange }: RestaurantFilterBarProps) {
  return (
    <div className="flex flex-1 gap-2">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="식당 이름 또는 주소 검색" value={keyword} onChange={(e) => onKeywordChange(e.target.value)} />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-32" aria-label="카테고리 필터"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES}>전체</SelectItem>
          {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}
