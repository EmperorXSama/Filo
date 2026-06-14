import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { roadmapConfig } from '@/data/roadmap'
import type { FeatureStatus, RoadmapFeature } from '@/types/roadmap'
import { StatusBadge } from '@/components/roadmap/StatusBadge'

const STATUS_DOT: Record<FeatureStatus, string> = {
  live: 'bg-emerald-500',
  'in-development': 'bg-blue-500',
  planned: 'bg-amber-500',
  future: 'bg-purple-500',
}

const BORDER_ACCENT: Record<FeatureStatus, string> = {
  live: 'border-l-emerald-500',
  'in-development': 'border-l-blue-500',
  planned: 'border-l-amber-500',
  future: 'border-l-purple-500',
}

function usePhasesWithLive() {
  return useMemo(() => {
    const phases = roadmapConfig.phases.map((p) => ({
      ...p,
      features: [...p.features],
    }))
    phases[0] = {
      ...phases[0],
      features: [...roadmapConfig.liveFeatures, ...phases[0].features],
    }
    return phases
  }, [])
}

function TimelineLine() {
  return (
    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 max-md:left-8">
      <div className="h-full w-full bg-gray-200" />
    </div>
  )
}

function TimelineDot({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-0 z-10 -translate-x-1/2 max-md:left-8"
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
        <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      </div>
    </motion.div>
  )
}

function FeatureExpanded({
  feature,
  version,
  phaseLabel,
}: {
  feature: RoadmapFeature
  version?: string
  phaseLabel?: string
}) {
  const IconComponent = feature
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
        feature.icon
      ]
    : null

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="border-t border-gray-100 pb-2 pt-4">
        <div className="flex items-start gap-3 pl-1">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            {IconComponent && <IconComponent className="h-3.5 w-3.5 text-gray-500" />}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm leading-relaxed text-gray-600">
              {feature.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <StatusBadge status={feature.status} />
              {version && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-500">
                  {version}
                </span>
              )}
              {phaseLabel && (
                <span className="text-gray-400">
                  Phase: {phaseLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FeatureRow({
  feature,
  index,
  isExpanded,
  onToggle,
  baseInView,
  version,
  phaseLabel,
}: {
  feature: RoadmapFeature
  index: number
  isExpanded: boolean
  onToggle: () => void
  baseInView: boolean
  version?: string
  phaseLabel?: string
}) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    feature.icon
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={baseInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.05, ease: 'easeOut' }}
    >
      <button
        onClick={onToggle}
        className={`group w-full rounded-xl border border-gray-200/70 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${BORDER_ACCENT[feature.status]} border-l-4`}
      >
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[feature.status]}`} />

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            {IconComponent ? (
              <IconComponent className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <div className="h-3.5 w-3.5 rounded bg-gray-300" />
            )}
          </div>

          <span className="flex-1 text-sm font-medium text-gray-900">
            {feature.title}
          </span>

          <StatusBadge status={feature.status} />

          <ChevronDown
            className={`h-3.5 w-3.5 text-gray-300 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <FeatureExpanded
            feature={feature}
            version={version}
            phaseLabel={phaseLabel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PhaseCard({
  phase,
  side,
  versions,
}: {
  phase: { id: string; title: string; version: string; status: FeatureStatus; features: RoadmapFeature[] }
  side: 'left' | 'right'
  versions: Map<string, string>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const isLeft = side === 'left'

  return (
    <div ref={ref} className="relative mb-16 last:mb-0">
      <TimelineDot isInView={isInView} />

      <div className={`max-md:pl-16 ${isLeft ? 'md:pr-[calc(50%+32px)]' : 'md:pl-[calc(50%+32px)]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="rounded-xl border border-gray-200/70 bg-white px-5 py-4 shadow-sm">
            <div className="mb-0.5 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-gray-500">
              {phase.version}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
          </div>
        </motion.div>

        <div className="mt-3 space-y-2">
          {phase.features.map((feature, i) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              index={i}
              isExpanded={expandedId === feature.id}
              onToggle={() => handleToggle(feature.id)}
              baseInView={isInView}
              version={versions.get(feature.id) ?? phase.version}
              phaseLabel={phase.title}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function RoadmapDisplay() {
  const phases = usePhasesWithLive()

  const versions = useMemo(() => {
    const map = new Map<string, string>()
    for (const phase of roadmapConfig.phases) {
      for (const feature of phase.features) {
        map.set(feature.id, phase.version)
      }
    }
    return map
  }, [])

  return (
    <div className="rounded-xl border border-gray-200/50 bg-[#FAFAFA]">
      <div className="relative px-6 py-16 max-md:px-4 md:px-10">
        <div className="mx-auto max-w-5xl">
          <TimelineLine />

          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              side={index % 2 === 0 ? 'left' : 'right'}
              versions={versions}
            />
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative mt-10 text-center"
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-purple-200 bg-purple-50">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
              </div>
            </div>
            <p className="pt-14 text-sm font-medium text-gray-400">
              And beyond &mdash; more features on the horizon
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
