import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { RoadmapDisplay } from '@/components/roadmap'

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <Card className="w-full border-card-border bg-canvas shadow-none rounded-sm">
        <CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center rounded-pill bg-coral/10 px-3 py-1 font-body text-micro font-medium text-coral">
              Early Access
            </span>
          </div>
          <CardTitle className="font-body text-section-heading text-ink">
            Welcome to the Early Access Build
          </CardTitle>
          <p className="mt-1 font-body text-body text-muted">
            We are actively building &mdash; here is what is coming.
          </p>
        </CardHeader>
      </Card>

      <RoadmapDisplay />
    </div>
  )
}
