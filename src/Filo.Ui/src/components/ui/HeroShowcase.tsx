import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate } from 'animejs'
import { cn } from '@/utils/cn'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface CardConfig {
  id: number
  src: string
  size: string
}

interface RowConfig {
  direction: 'left' | 'right'
  speed: number
}

const imageModules = import.meta.glob('@/assets/img/*.jpg', { eager: true, query: '?url' })
const IMAGES = shuffle(Object.values(imageModules).map((m) => (m as { default: string }).default))

const SIZES = ['w-[clamp(12rem,22vw,22rem)] h-[clamp(12rem,22vw,22rem)]']

function generateCards(count: number, images: string[]): CardConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    src: images[i % images.length],
    size: SIZES[i % SIZES.length],
  }))
}

const ROWS: RowConfig[] = [
  { direction: 'left', speed: 50 },
  { direction: 'right', speed: 60 },
  { direction: 'left', speed: 70 },
  { direction: 'right', speed: 40 },
]

const CARDS_PER_ROW = 10
const IMAGES_PER_ROW = Math.floor(IMAGES.length / ROWS.length)
const ROW_IMAGE_SETS = ROWS.map((_, i) =>
  IMAGES.slice(i * IMAGES_PER_ROW, (i + 1) * IMAGES_PER_ROW),
)
const ROW_CARDS = ROW_IMAGE_SETS.map((images) => generateCards(CARDS_PER_ROW, images))

const MarqueeRow = memo(function MarqueeRow({
  cards,
  direction,
  speed,
  rowIndex,
  onReady,
}: {
  cards: CardConfig[]
  direction: 'left' | 'right'
  speed: number
  rowIndex: number
  onReady?: () => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const rowAnimDone = useRef(false)

  useEffect(() => {
    const delay = rowIndex * 100 + 600
    const tid = setTimeout(() => setVisible(true), delay)

    const row = rowRef.current
    if (!row) return

    const entrance = animate(row, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 600,
      delay: rowIndex * 100,
      easing: 'easeOutCubic',
      complete: () => {
        rowAnimDone.current = true
        row.style.opacity = ''
        row.style.transform = ''
        onReady?.()
      },
    })

    return () => {
      clearTimeout(tid)
      entrance.pause()
    }
  }, [rowIndex, onReady])

  useEffect(() => {
    if (!visible || !trackRef.current) return

    const el = trackRef.current
    const oneSetWidth = el.scrollWidth / 2
    if (oneSetWidth === 0) return

    let x = direction === 'right' ? -oneSetWidth : 0
    let prev = performance.now()
    let raf: number
    let running = true

    function tick(now: number) {
      if (!running) return
      const dt = Math.min(now - prev, 50)
      prev = now

      if (direction === 'left') {
        x -= speed * (dt / 1000)
        if (x <= -oneSetWidth) x = 0
      } else {
        x += speed * (dt / 1000)
        if (x >= 0) x = -oneSetWidth
      }

      el.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(raf)
    }
  }, [visible, direction, speed])

  return (
    <div
      ref={rowRef}
      className="flex"
      style={{ opacity: 0, transform: 'translateY(40px)' }}
    >
      {visible && (
        <div
          ref={trackRef}
          className="flex shrink-0 items-center gap-xs"
        >
          {[...cards, ...cards].map((card, i) => (
            <img key={i} src={card.src} className={`shrink-0 rounded-md object-cover ${card.size} rotate-[270deg]`} alt="" />
          ))}
        </div>
      )}
    </div>
  )
})

const CYCLING_WORDS = ['files', 'images', 'docs']
const PREFIX = 'Your '
const WORD_DURING_TYPING = 'files'
const SUFFIX = 'intelligently managed'
const TOTAL_TYPING_CHARS = PREFIX.length + WORD_DURING_TYPING.length + 1 + SUFFIX.length

const ScrambledWord = memo(function ScrambledWord({ word, className }: { word: string; className?: string }) {
  const [display, setDisplay] = useState(word)
  const prevWord = useRef(word)

  useEffect(() => {
    if (word === prevWord.current) return
    prevWord.current = word

    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const duration = 800
    const start = performance.now()
    let timer: ReturnType<typeof setTimeout>

    function tick() {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const settled = Math.floor(progress * word.length)

      let result = ''
      for (let i = 0; i < word.length; i++) {
        if (i < settled) {
          result += word[i]
        } else {
          result += letters[Math.floor(Math.random() * letters.length)]
        }
      }

      setDisplay(result)

      if (progress < 1) {
        timer = setTimeout(tick, 50)
      }
    }

    timer = setTimeout(tick, 50)
    return () => clearTimeout(timer)
  }, [word])

  return <span className={className}>{display}</span>
})

function HeroHeading() {
  const [chars, setChars] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [activeWord, setActiveWord] = useState(CYCLING_WORDS[0])
  const wordIdx = useRef(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setChars((c) => {
        if (c >= TOTAL_TYPING_CHARS) {
          clearInterval(timer)
          setTypingDone(true)
          return c
        }
        return c + 1
      })
    }, 60)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!typingDone) return
    const interval = setInterval(() => {
      wordIdx.current = (wordIdx.current + 1) % CYCLING_WORDS.length
      setActiveWord(CYCLING_WORDS[wordIdx.current])
    }, 3000)
    return () => clearInterval(interval)
  }, [typingDone])

  const prefixChars = typingDone ? PREFIX.length : Math.min(chars, PREFIX.length)
  const wordChars = typingDone
    ? WORD_DURING_TYPING.length
    : Math.max(0, Math.min(chars - PREFIX.length, WORD_DURING_TYPING.length))
  const showComma = typingDone || chars > PREFIX.length + WORD_DURING_TYPING.length
  const suffixChars = typingDone
    ? SUFFIX.length
    : Math.max(0, Math.min(chars - PREFIX.length - WORD_DURING_TYPING.length - 1, SUFFIX.length))

  return (
    <h1 className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none tracking-[-1.44px] font-normal text-ink">
      {PREFIX.slice(0, prefixChars)}
      {typingDone ? (
        <ScrambledWord word={activeWord} className="text-coral transition-all duration-200" />
      ) : wordChars > 0 ? (
        <span className="text-coral">{WORD_DURING_TYPING.slice(0, wordChars)}</span>
      ) : null}
      {showComma ? ',' : ''}
      <br />
      {SUFFIX.slice(0, suffixChars)}
    </h1>
  )
}

interface HeroShowcaseProps {
  className?: string
}

export function HeroShowcase({ className }: HeroShowcaseProps) {
  const [readyCount, setReadyCount] = useState(0)
  const handleRowReady = useCallback(() => setReadyCount((c) => c + 1), [])

  return (
    <section
      className={cn(
        'relative z-0 flex w-full flex-1 overflow-hidden bg-canvas',
        className,
      )}
    >
      <div className="hidden lg:flex flex-col justify-center w-1/2 px-xxl">
        <HeroHeading />
        <p className="max-w-[75%] font-body text-body-large text-muted pt-xl">
          Filo organizes, finds, and shares your documents with AI-powered precision — so you can focus on what matters.
        </p>
        <div className="flex items-center gap-xl pt-xxl">
          <Link
            to="/get-started"
            className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-on-primary font-body text-button leading-button rounded-pill px-xl py-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2"
          >
            Get Started
          </Link>
          <a
            href="/know-more"
            className="font-body text-body text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2"
          >
            Know More
          </a>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center overflow-hidden">
        {readyCount < ROWS.length && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-md bg-canvas transition-opacity duration-500">
            <div className="flex items-center gap-md">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="h-2 w-2 animate-pulse rounded-full bg-muted"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
            <span className="font-body text-body text-muted">Loading showcase</span>
          </div>
        )}

        <div className="pointer-events-none" style={{ transform: 'rotate(45deg)' }}>
          <div className="flex flex-col gap-lg">
            {ROWS.map((config, i) => (
              <MarqueeRow
                key={i}
                cards={ROW_CARDS[i]}
                direction={config.direction}
                speed={config.speed}
                rowIndex={i}
                onReady={handleRowReady}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
