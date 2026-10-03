import { Timer } from 'lucide-react'
import { useNow } from '@/hooks/shared/useNow'
import { diffMs, formatRemaining } from '@/lib/date'

type CountdownProps = {
  closesAt: string
  isActive: boolean
}

export function Countdown({ closesAt, isActive }: CountdownProps) {
  const now = useNow()
  if (!isActive) return null
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm tabular-nums text-primary">
      <Timer className="size-3.5" />
      {formatRemaining(diffMs(closesAt, now))}
    </span>
  )
}
