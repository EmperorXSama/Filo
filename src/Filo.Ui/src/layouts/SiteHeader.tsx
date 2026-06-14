import { AnnouncementBar } from '@/components/ui/AnnouncementBar'
import { Button } from '@/components/ui/Button'
import { FiloLogo } from '@/components/ui/FiloLogo'
import { Navbar } from '@/components/ui/Navbar'
import { NAV_ITEMS } from '@/config/navigation'
import { login } from '@/services/auth'

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar>
        This website is a showcase project under development.{' '}
        <a
          href="https://github.com/EmperorXSama/Filo"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          Repository &rarr;
        </a>
      </AnnouncementBar>

      <Navbar
        logo={
          <a
            href="/"
            className="block transition-opacity hover:opacity-80"
          >
            <FiloLogo className="h-8" showIndicator={false} />
          </a>
        }
        items={NAV_ITEMS}
        secondaryAction={
          <Button variant="link" onClick={() => login('/dashboard')} className="text-muted hover:text-ink no-underline hover:no-underline">
            Sign in
          </Button>
        }
        primaryAction={
          <a
            href="#"
            className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-on-primary font-body text-body leading-button rounded-pill px-xl py-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2"
          >
            Get started
          </a>
        }
      />
    </>
  )
}
