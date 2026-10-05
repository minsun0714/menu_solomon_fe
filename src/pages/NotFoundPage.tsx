import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
      <div className="w-full border-y py-10 sm:py-14">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">페이지를 찾을 수 없습니다.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          주소가 잘못되었거나 페이지가 이동되었을 수 있습니다.
        </p>
        <Button asChild className="mt-6">
          <Link to={ROUTES.LANDING}>홈으로 이동</Link>
        </Button>
      </div>
    </section>
  )
}
