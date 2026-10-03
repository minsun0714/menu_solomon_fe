import { FeatureList } from '@/components/landing/FeatureList'
import { LandingHero } from '@/components/landing/LandingHero'
import { VotePreviewCard } from '@/components/landing/VotePreviewCard'

export function LandingPage() {
  return (
    <div className="space-y-12">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <LandingHero />
        <VotePreviewCard />
      </div>
      <FeatureList />
    </div>
  )
}
