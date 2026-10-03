import { History, MessageSquare, Users, Utensils, Vote } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Feature = { icon: LucideIcon; title: string; description: string }

const FEATURES: Feature[] = [
  { icon: Users, title: '팀 만들기', description: '팀을 만들고 초대 링크로 동료를 초대하세요.' },
  { icon: Utensils, title: '식당 추가', description: '팀이 자주 가는 맛집을 모아 두세요.' },
  { icon: Vote, title: '점심 투표', description: '마감 시간을 정하고 후보에 투표하세요.' },
  { icon: MessageSquare, title: '식당 리뷰', description: '별점과 한 줄 리뷰로 취향을 공유하세요.' },
  { icon: History, title: '점심 히스토리', description: '주간·월간으로 지난 점심을 확인하세요.' },
]

export function FeatureList() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">이렇게 사용해요</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ icon: Icon, title, description }, index) => (
          <Card key={title} className="gap-3">
            <CardHeader>
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-4" /></span>
              <CardTitle className="text-base">{index + 1}. {title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
