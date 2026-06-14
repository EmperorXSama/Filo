import { SiteHeader } from '@/layouts/SiteHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Code2, Container, Database, Paintbrush, Server, TestTube, type LucideIcon } from 'lucide-react'
import { RoadmapDisplay } from '@/components/roadmap'

interface StackCategory {
  icon: LucideIcon
  title: string
  items: string[]
}

const STACK_CATEGORIES: StackCategory[] = [
  {
    icon: Code2,
    title: 'Frontend',
    items: ['React 19', 'TypeScript 6', 'Vite 8', 'react-router-dom v7'],
  },
  {
    icon: Paintbrush,
    title: 'UI & Styling',
    items: ['Tailwind CSS 3', 'shadcn/ui Components', 'animejs', 'lucide-react'],
  },
  {
    icon: Database,
    title: 'State & Data',
    items: ['TanStack React Query v5', 'Zustand', 'Axios', 'react-hook-form + Zod'],
  },
  {
    icon: TestTube,
    title: 'Testing & Quality',
    items: ['Vitest', 'React Testing Library', 'ESLint', 'Prettier + Husky'],
  },
  {
    icon: Server,
    title: 'Backend',
    items: ['.NET (ASP.NET Core)', 'RESTful API', 'Entity Framework'],
  },
  {
    icon: Container,
    title: 'Infrastructure',
    items: ['Docker', 'Nginx', 'Linux Alpine'],
  },
]

export function KnowMore() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />

      <main className="flex-1">
        <section className="w-full border-b border-hairline">
          <div className="mx-auto max-w-4xl px-xl py-section text-center">
            <h1 className="font-display text-section-display text-ink">
              About Filo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-body-large text-muted">
              An intelligent document management platform &mdash; currently in
              active development.
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-5xl px-xl py-section">
            <h2 className="text-center font-body text-section-heading text-ink">
              Built With
            </h2>
            <div className="mt-xxl grid gap-xl sm:grid-cols-2 lg:grid-cols-3">
              {STACK_CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <Card
                    key={cat.title}
                    className="border-card-border bg-canvas shadow-none rounded-sm"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-soft-stone">
                          <Icon className="h-5 w-5 text-ink" />
                        </div>
                        <CardTitle className="font-body text-feature-heading text-ink">
                          {cat.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5">
                        {cat.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 font-body text-body text-muted"
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-muted" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="w-full bg-soft-stone">
          <div className="mx-auto max-w-5xl px-xl py-section">
            <h2 className="text-center font-body text-section-heading text-ink">
              What&apos;s Coming
            </h2>
            <p className="mt-2 text-center font-body text-body text-muted">
              We are actively building &mdash; here is what is coming.
            </p>

            <div className="mt-xxl">
              <RoadmapDisplay />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-canvas py-xl">
        <div className="mx-auto max-w-4xl px-xl text-center">
          <p className="font-body text-micro text-muted">
            &copy; {new Date().getFullYear()} Filo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
