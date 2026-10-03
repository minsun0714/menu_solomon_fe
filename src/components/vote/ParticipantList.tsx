import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import type { ParticipantDetail } from '@/types/vote'

export function ParticipantList({ participants }: { participants: ParticipantDetail[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>참여자 {participants.filter(({ participating }) => participating).length}명</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {participants.map(({ id, nickname, participating }) => (
          <Badge key={id} variant={participating ? 'secondary' : 'outline'} className={cn(!participating && 'text-muted-foreground line-through')}>
            {nickname}
          </Badge>
        ))}
      </CardContent>
    </Card>
  )
}
