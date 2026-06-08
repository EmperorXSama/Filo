import { useState, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { label: 'Story', href: '#story' },
  { label: 'Investing', href: '#investing' },
  { label: 'Building', href: '#building' },
  { label: 'Advisory', href: '#advisory' },
] as const

const HEADING_TEXT = 'Shaping tomorrow\nwith vision and action.'
const CHAR_DELAY = 30
const INITIAL_DELAY = 200

function FadeIn({
  children,
  delay = 0,
  duration = 1000,
}: {
  children: ReactNode
  delay?: number
  duration?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className="transition-opacity"
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

function AnimatedHeading() {
  const [started, setStarted] = useState(false)
  const lines = HEADING_TEXT.split('\n')
  const words = lines.map((l) => l.split(' '))

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), INITIAL_DELAY)
    return () => clearTimeout(timer)
  }, [])

  return (
    <h1 className="font-display text-feature-heading font-normal leading-none tracking-tight text-on-dark sm:text-card-heading md:text-section-heading lg:text-section-display xl:text-product-display">
      {words.map((lineWords, lineIndex) => (
        <span key={lineIndex} className="block">
          {lineWords.flatMap((word, wordIndex) => {
            let wordStartIdx = 0
            for (let l = 0; l < lineIndex; l++) {
              wordStartIdx += lines[l].length + 1
            }
            for (let w = 0; w < wordIndex; w++) {
              wordStartIdx += lineWords[w].length + 1
            }

            const chars = Array.from(word)
            const wordSpan = (
              <span key={`w-${wordIndex}`} className="inline-block whitespace-nowrap">
                {chars.map((char, ci) => {
                  const idx = wordStartIdx + ci
                  return (
                    <span
                      key={ci}
                      className="inline-block transition-all ease-out"
                      style={{
                        opacity: started ? 1 : 0,
                        transform: started ? 'translateX(0)' : 'translateX(-18px)',
                        transitionDuration: '500ms',
                        transitionDelay: `${idx * CHAR_DELAY}ms`,
                      }}
                    >
                      {char}
                    </span>
                  )
                })}
              </span>
            )

            if (wordIndex < lineWords.length - 1) {
              return [wordSpan, <span key={`s-${wordIndex}`}>{'\u00A0'}</span>]
            }

            return [wordSpan]
          })}
        </span>
      ))}
    </h1>
  )
}

function BackgroundVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    >
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        type="video/mp4"
      />
    </video>
  )
}

function HeroNavLogo() {
  return (
    <a href="/" className="font-display text-2xl font-semibold tracking-tight text-on-dark">
      VEX
    </a>
  )
}

function NavList() {
  return (
    <ul className="hidden items-center gap-xxl md:flex">
      {NAV_LINKS.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="font-body text-button text-on-dark/70 transition-colors hover:text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function HeroNav() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-10 pt-xl" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-xl lg:px-xxl">
        <div className="liquid-glass flex items-center justify-between rounded-md px-lg py-sm">
          <HeroNavLogo />
          <NavList />
          <Button
            variant="default"
            className="rounded-sm bg-canvas px-xxl py-md font-medium text-ink shadow-none hover:bg-soft-stone"
          >
            Join
          </Button>
        </div>
      </div>
    </nav>
  )
}

function HeroContent() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <div className="mx-auto max-w-7xl px-xl lg:px-xxl">
        <div className="flex min-h-[60vh] flex-col justify-end pb-xxl lg:pb-section">
          <div>
            <AnimatedHeading />

            <FadeIn delay={800} duration={1000}>
              <p className="mb-xl mt-lg font-body text-body text-muted sm:text-body-large">
                We back visionaries and craft ventures that define what comes next.
              </p>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-lg">
                <Button
                  variant="default"
                  className="rounded-sm bg-on-dark px-xxl py-md font-medium text-primary shadow-none hover:bg-on-dark/90"
                >
                  Join
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="rounded-sm border border-on-dark/20 bg-transparent px-xxl py-md font-medium text-on-dark shadow-none hover:bg-on-dark hover:text-primary"
                >
                  <Link to="/system-info">Know more</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary">
      <BackgroundVideo />
      <HeroNav />
      <HeroContent />
    </section>
  )
}
