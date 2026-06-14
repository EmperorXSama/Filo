import { lazy, Suspense } from 'react'
import { SiteHeader } from '@/layouts/SiteHeader'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

const HeroShowcase = lazy(() =>
  import('@/components/ui/HeroShowcase').then((m) => ({ default: m.HeroShowcase })),
)

export function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      <LoadingScreen minimumDuration={2000} />
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<div className="h-full w-full" />}>
          <HeroShowcase />
        </Suspense>
      </main>
    </div>
  )
}
