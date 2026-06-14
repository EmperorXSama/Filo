import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { NavigationLink } from './NavigationLink'
import { MegaMenu } from './MegaMenu'
import type { NavItem } from '@/types/navigation'

interface NavbarProps {
  logo: ReactNode
  items: NavItem[]
  secondaryAction?: ReactNode
  primaryAction?: ReactNode
  className?: string
}

function MobileNavPanel({
  isOpen,
  onClose,
  items,
  activeMegaMenu,
  onMegaMenuToggle,
  secondaryAction,
  primaryAction,
}: {
  isOpen: boolean
  onClose: () => void
  items: NavItem[]
  activeMegaMenu: number | null
  onMegaMenuToggle: (index: number | null) => void
  secondaryAction?: ReactNode
  primaryAction?: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelRef.current) return

    let cancelled = false

    import('animejs').then(({ animate }) => {
      if (cancelled || !panelRef.current) return

      if (isOpen) {
        animate(panelRef.current, {
          translateX: ['100%', 0],
          duration: 300,
          easing: 'easeOutCubic',
        })
      } else {
        animate(panelRef.current, {
          translateX: [0, '100%'],
          duration: 250,
          easing: 'easeInCubic',
        })
      }
    })

    return () => { cancelled = true }
  }, [isOpen])

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-canvas shadow-[0_0_32px_-8px_rgba(0,0,0,0.12)]',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between border-b border-hairline/40 px-xl py-lg">
        <span className="font-display text-xl font-medium tracking-tight text-ink">Filo</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
          aria-label="Close menu"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-xl py-xl" aria-label="Mobile navigation">
        <ul className="space-y-lg">
          {items.map((item, index) => (
            <li key={item.label}>
              {item.megaMenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      onMegaMenuToggle(activeMegaMenu === index ? null : index)
                    }
                    className="flex w-full items-center justify-between font-body text-body text-ink transition-colors hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
                    aria-expanded={activeMegaMenu === index}
                  >
                    {item.label}
                    <svg
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        activeMegaMenu === index && 'rotate-180',
                      )}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {activeMegaMenu === index && item.megaMenu && (
                    <div className="mt-lg space-y-lg pl-lg">
                      {item.megaMenu.columns?.map((col) => (
                        <div key={col.title}>
                          <span className="font-body text-micro text-muted">{col.title}</span>
                          {col.links && (
                            <ul className="mt-sm space-y-sm">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <a
                                    href={link.href}
                                    className="font-body text-caption text-ink transition-colors hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block font-body text-body text-ink transition-colors hover:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-hairline/40 px-xl py-xl">
        <div className="flex flex-col gap-lg">
          {secondaryAction}
          {primaryAction}
        </div>
      </div>
    </div>
  )
}

export function Navbar({
  logo,
  items,
  secondaryAction,
  primaryAction,
  className,
}: NavbarProps) {
  const [activeMegaMenu, setActiveMegaMenu] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navbarRef = useRef<HTMLElement>(null)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const closeMegaMenu = useCallback(() => {
    setActiveMegaMenu(null)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = undefined
    }
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActiveMegaMenu(null)
    }, 150)
  }, [cancelClose])

  const handleMouseEnter = useCallback(
    (index: number) => {
      cancelClose()
      setActiveMegaMenu(index)
    },
    [cancelClose],
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(e.target as Node)
      ) {
        closeMegaMenu()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMegaMenu()
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [closeMegaMenu])

  return (
    <header
      ref={navbarRef}
      className={cn('relative bg-canvas', className)}
    >
      <div
        className="relative border-b border-hairline/40"
        onMouseLeave={closeMegaMenu}
      >
        <div className="px-xl lg:px-xxl">
        <div className="flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center">{logo}</div>

            <nav
              className="hidden items-center justify-center gap-16 md:flex self-stretch"
              aria-label="Main navigation"
            >
              {items.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(item.megaMenu?.projects && 'relative flex items-center h-full')}
                  onMouseEnter={() => item.megaMenu ? handleMouseEnter(index) : closeMegaMenu()}
                  onMouseLeave={() => item.megaMenu && scheduleClose()}
                >
                  {item.megaMenu ? (
                    <button
                      type="button"
                      onClick={() => {
                        cancelClose()
                        setActiveMegaMenu(
                          activeMegaMenu === index ? null : index,
                        )
                      }}
                      onMouseEnter={cancelClose}
                      className={cn(
                        'group relative flex items-center font-body text-caption text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2',
                        activeMegaMenu === index && 'text-ink',
                      )}
                      aria-expanded={activeMegaMenu === index}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-action-blue via-coral to-form-focus bg-[length:200%_100%] animate-gradient-shift transition-transform duration-300 ease-out',
                          activeMegaMenu === index
                            ? 'scale-x-100'
                            : 'group-hover:scale-x-100',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <NavigationLink
                      href={item.href}
                      animated={item.label === 'Repository'}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {item.label}
                    </NavigationLink>
                  )}
                  {item.megaMenu?.projects && (
                    <MegaMenu
                      isOpen={activeMegaMenu === index}
                      projects={item.megaMenu.projects}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                </div>
              ))}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-lg">
              <div className="hidden items-center gap-lg md:flex">
                {secondaryAction}
                {primaryAction}
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {items.map((item, index) => item.megaMenu && !item.megaMenu.projects && (
          <MegaMenu
            key={item.label}
            isOpen={activeMegaMenu === index}
            columns={item.megaMenu.columns}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        ))}
      </div>

      <MobileNavPanel
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={items}
        activeMegaMenu={activeMegaMenu}
        onMegaMenuToggle={setActiveMegaMenu}
        secondaryAction={secondaryAction}
        primaryAction={primaryAction}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-cohere-black/30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
