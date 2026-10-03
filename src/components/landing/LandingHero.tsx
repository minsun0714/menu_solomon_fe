import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function LandingHero() {
  return (
    <section className="space-y-6 py-8 text-center lg:text-left">
      <p className="text-sm font-medium text-primary">팀 점심 투표 서비스</p>
      <h1 className="text-4xl leading-tight font-bold tracking-tight lg:text-5xl">
        오늘 점심, <br className="hidden lg:block" />팀이 함께 정해요
      </h1>
      <p className="max-w-xl text-muted-foreground">
        식당을 모으고, 투표하고, 리뷰를 남기고, 지난 점심을 돌아보세요. 더 이상 “아무거나”는 없습니다.
      </p>
      <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
        <Button size="lg" asChild>
          <Link to={ROUTES.MY_TEAMS}>시작하기 <ArrowRight /></Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to={ROUTES.INVITATION('platform-dev-9f2k')}>초대 링크 미리보기</Link>
        </Button>
      </div>
    </section>
  )
}
