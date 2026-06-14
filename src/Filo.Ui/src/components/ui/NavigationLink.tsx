import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  isActive?: boolean
  animated?: boolean
}

const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ children, isActive, animated, className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'group relative font-body text-caption text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2',
          className,
        )}
        {...props}
      >
        {animated ? (
          <span className="inline-block bg-gradient-to-r from-action-blue via-coral to-form-focus bg-[length:200%_100%] animate-gradient-shift bg-clip-text text-transparent">
            {children}
          </span>
        ) : (
          children
        )}
        <span
          className={cn(
            'absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-action-blue via-coral to-form-focus transition-transform duration-300 ease-out',
            animated && 'bg-[length:200%_100%] animate-gradient-shift',
            isActive ? 'scale-x-100' : 'group-hover:scale-x-100',
          )}
          aria-hidden="true"
        />
      </a>
    )
  },
)
NavigationLink.displayName = 'NavigationLink'

export { NavigationLink }
export type { NavigationLinkProps }
