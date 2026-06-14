import { motion } from 'framer-motion'
import {
  Check,
  Clock,
  Sparkles,
  Loader,
  type LucideIcon,
} from 'lucide-react'
import type { FeatureStatus } from '@/types/roadmap'

interface StatusBadgeProps {
  status: FeatureStatus
  className?: string
}

const STATUS_CONFIG: Record<
  FeatureStatus,
  { icon: LucideIcon; label: string; bg: string; text: string; border: string; pulse?: boolean }
> = {
  live: {
    icon: Check,
    label: 'Live',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  'in-development': {
    icon: Loader,
    label: 'In Development',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    pulse: true,
  },
  planned: {
    icon: Clock,
    label: 'Planned',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  future: {
    icon: Sparkles,
    label: 'Future',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.bg} ${config.text} ${config.border} ${className ?? ''}`}
    >
      {config.pulse ? (
        <span className="relative flex h-3 w-3 items-center justify-center">
          <motion.span
            className="absolute h-full w-full rounded-full bg-blue-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Icon className="relative h-2.5 w-2.5" />
        </span>
      ) : (
        <Icon className="h-2.5 w-2.5" />
      )}
      {config.label}
    </span>
  )
}
