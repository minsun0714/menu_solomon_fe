import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const PREVIEW_OPTIONS = [
  { name: '한울 김치찌개', category: '한식', votes: 3, percentage: 50 },
  { name: '스시 오마카세 하루', category: '일식', votes: 2, percentage: 33 },
  { name: '파스타 보노', category: '양식', votes: 1, percentage: 17 },
]

export function VotePreviewCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>오늘의 점심 투표 (예시)</CardTitle>
        <Badge>투표 중</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {PREVIEW_OPTIONS.map(({ name, category, votes, percentage }) => (
          <div key={name} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{name} <span className="text-muted-foreground">· {category}</span></span>
              <span className="text-muted-foreground tabular-nums">{votes}표 · {percentage}%</span>
            </div>
            <Progress value={percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
