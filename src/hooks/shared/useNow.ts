import { useEffect, useState } from 'react'
import { COUNTDOWN_TICK_MS } from '@/constants/config'

export function useNow(tickMs: number = COUNTDOWN_TICK_MS): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timerId = setInterval(() => setNow(Date.now()), tickMs)
    return () => clearInterval(timerId)
  }, [tickMs])

  return now
}
