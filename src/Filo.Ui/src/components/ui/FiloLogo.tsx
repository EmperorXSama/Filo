import { useEffect, useId } from 'react'
import { animate, stagger } from 'animejs'
import { cn } from '@/utils/cn'

interface FiloLogoProps {
  className?: string
  showIndicator?: boolean
  loop?: boolean
}

export function FiloLogo({ className, showIndicator = true, loop = false }: FiloLogoProps) {
  const id = useId()
  const gradId = `flg-${id}`
  const svgId = `flsvg-${id}`

  useEffect(() => {
    const svg = document.querySelector(`[data-flogo="${svgId}"]`)
    if (!svg) return

    const drawPaths = Array.from(svg.querySelectorAll('[stroke]'))
    drawPaths.forEach((el) => {
      const geom = el as SVGGeometryElement
      const len = geom.getTotalLength()
      geom.setAttribute('stroke-dasharray', String(len))
      geom.setAttribute('stroke-dashoffset', String(len))
    })

    const draw = animate(drawPaths, {
      strokeDashoffset: [0],
      duration: 800,
      delay: stagger(100, { from: 'first' }),
      easing: 'easeOutCubic',
      loop,
      direction: loop ? 'alternate' : undefined,
    })

    return () => { draw.pause() }
  }, [svgId, loop])

  useEffect(() => {
    if (!showIndicator) return

    const svg = document.querySelector(`[data-flogo="${svgId}"]`)
    if (!svg) return

    const indicator = svg.querySelector('.flogo-indicator')
    if (!indicator) return

    const pulse = animate(indicator, {
      opacity: [1, 0.2],
      duration: 1400,
      easing: 'easeInOutSine',
      loop: true,
    })

    return () => { pulse.pause() }
  }, [svgId, showIndicator])

  return (
    <svg
      data-flogo={svgId}
      viewBox="0 0 240 40"
      className={cn('h-9 w-auto', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1863dc" />
          <stop offset="100%" stopColor="#9b60aa" />
        </linearGradient>
      </defs>

      <path
        d="M 8,32 L 8,8 L 32,8 M 8,20 L 26,20"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <path
        d="M 46,8 L 46,32"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M 46,4 L 49.5,7.5 L 46,11 L 42.5,7.5 Z"
        fill={`url(#${gradId})`}
      />

      <path
        d="M 60,8 L 60,32 L 86,32"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle
        cx="108"
        cy="20"
        r="12"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        fill="none"
      />

      {showIndicator && (
        <rect
          className="flogo-indicator"
          x="150"
          y="8"
          width="2.5"
          height="24"
          rx="1.25"
          fill="#ff7759"
        />
      )}
    </svg>
  )
}
