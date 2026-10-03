import { Badge } from '@/components/ui/badge'
import { VOTE_STATUS, VOTE_STATUS_LABEL } from '@/constants/vote'
import type { VoteStatus } from '@/types/vote'

const STATUS_VARIANT = {
  [VOTE_STATUS.OPEN]: 'default',
  [VOTE_STATUS.CLOSED]: 'warning',
  [VOTE_STATUS.CONFIRMED]: 'success',
} as const satisfies Record<VoteStatus, 'default' | 'warning' | 'success'>

export function StatusBadge({ status }: { status: VoteStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{VOTE_STATUS_LABEL[status]}</Badge>
}
