import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = '데이터를 불러오지 못했습니다.', onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-start justify-between gap-3 border-y border-destructive/30 bg-destructive/5 px-3 py-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2"><AlertCircle className="size-4 text-destructive" /><p className="text-sm text-destructive">{message}</p></div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
