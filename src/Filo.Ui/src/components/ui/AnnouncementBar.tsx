import { useState, useRef, useEffect, type ReactNode } from 'react'
import { animate } from 'animejs'
import { cn } from '@/utils/cn'

interface AnnouncementBarProps {
  children: ReactNode
  className?: string
}

export function AnnouncementBar({ children, className }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const handleDismiss = () => {
    if (!barRef.current) return

    animate(barRef.current, {
      translateY: '-100%',
      opacity: [1, 0],
      duration: 300,
      easing: 'easeOutCubic',
      complete: () => setHidden(true),
    })

    setDismissed(true)
  }

  useEffect(() => {
    return () => {
      setHidden(false)
    }
  }, [])

  if (hidden) return null

  return (
    <div
      ref={barRef}
      className={cn(
        'relative flex w-full items-center justify-center bg-cohere-black px-section',
        dismissed && 'pointer-events-none',
        className,
      )}
    >
      <span className="font-body text-caption text-on-dark px-lg py-sm">{children}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-xl top-1/2 -translate-y-1/2 text-on-dark/50 transition-colors hover:text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 focus-visible:ring-offset-cohere-black"
        aria-label="Dismiss announcement"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1 1L9 9M9 1L1 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
