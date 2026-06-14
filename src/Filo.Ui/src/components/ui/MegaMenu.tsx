import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'
import { NavigationLink } from './NavigationLink'
import { ProjectCard } from './ProjectCard'
import type { MegaMenuColumn, ProjectCardConfig } from '@/types/navigation'

interface MegaMenuProps {
  isOpen: boolean
  columns?: MegaMenuColumn[]
  projects?: ProjectCardConfig[]
  className?: string
}

function MegaMenuColumnSection({ column }: { column: MegaMenuColumn }) {
  if (column.featured && column.card) {
    return (
      <div className="flex flex-col">
        <div className="mb-lg">
          <span className="font-body text-micro text-muted">{column.title}</span>
          {column.description && (
            <p className="mt-xs font-body text-caption text-body-muted">{column.description}</p>
          )}
        </div>
        <a
          href={column.card.href}
          className="group flex flex-col rounded-lg border border-hairline bg-soft-stone/30 p-xl transition-colors hover:bg-soft-stone/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
        >
          <span className="font-body text-feature-heading text-ink">{column.card.heading}</span>
          <span className="mt-md line-clamp-2 font-body text-caption text-body-muted">
            {column.card.description}
          </span>
          <span className="mt-lg font-body text-micro text-action-blue underline-offset-2 transition-colors group-hover:underline">
            Learn more &rarr;
          </span>
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-lg">
        <span className="font-body text-micro text-muted">{column.title}</span>
        {column.description && (
          <p className="mt-xs font-body text-caption text-body-muted">{column.description}</p>
        )}
      </div>
      {column.links && column.links.length > 0 && (
        <ul className="space-y-md">
          {column.links.map((link) => (
            <li key={link.label}>
              <NavigationLink
                href={link.href}
                className="flex flex-col gap-0"
              >
                <span className="font-body text-caption text-ink">{link.label}</span>
                {link.description && (
                  <span className="mt-0.5 font-body text-micro text-body-muted">
                    {link.description}
                  </span>
                )}
              </NavigationLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function MegaMenu({ isOpen, columns, projects, className }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const columnsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    let cancelled = false
    const panel = panelRef.current

    import('animejs').then(({ animate, stagger }) => {
      if (cancelled || !panelRef.current) return

      animate(panel, {
        opacity: [0, 1],
        translateY: [-4, 0],
        duration: 200,
        easing: 'easeOutCubic',
        begin: () => {
          if (columnsRef.current && columnsRef.current.children.length > 0) {
            const childElements = Array.from(columnsRef.current.children) as HTMLElement[]
            const colDelay = stagger(40, { from: 'first' })
            animate(childElements, {
              opacity: [0, 1],
              translateY: [12, 0],
              duration: 250,
              delay: colDelay,
              easing: 'easeOutCubic',
            })
          }
        },
      })
    })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-[calc(100%+4px)] z-50 transition-all duration-150 ease-in',
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[-8px] pointer-events-none',
        projects ? 'left-1/2 ml-[-440px]' : 'left-0 right-0 mx-auto max-w-7xl px-xl lg:px-xxl',
        className,
      )}
    >
      <div
        className={cn(
          'rounded-md border border-hairline bg-canvas shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)]',
          projects && 'w-[880px]',
        )}
      >
        {projects ? (
          <div ref={columnsRef} className="flex flex-col gap-xl p-xl">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        ) : (
          <div
            ref={columnsRef}
            className="grid gap-xxl p-xxl"
            style={{
              gridTemplateColumns: columns && columns.length > 0
                ? `2fr ${columns.filter((c) => !c.featured).map(() => '1fr').join(' ')}`
                : undefined,
            }}
          >
            {columns?.map((column) => (
              <div key={column.title} className="min-w-0">
                <MegaMenuColumnSection column={column} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
