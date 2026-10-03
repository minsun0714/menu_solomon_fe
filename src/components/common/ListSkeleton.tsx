import { Skeleton } from '@/components/ui/skeleton'

type ListSkeletonProps = {
  count?: number
  itemClassName?: string
}

export function ListSkeleton({ count = 3, itemClassName = 'h-28' }: ListSkeletonProps) {
  return (
    <div className="grid gap-3" aria-busy="true" aria-label="불러오는 중">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={itemClassName} />
      ))}
    </div>
  )
}
