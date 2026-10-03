import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type BackLinkProps = {
  to: string
  children: string
}

export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ArrowLeft className="size-4" />
      {children}
    </Link>
  )
}
