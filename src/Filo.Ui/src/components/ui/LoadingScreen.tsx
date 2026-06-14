import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { FiloLogo } from '@/components/ui/FiloLogo'

interface LoadingScreenProps {
  minimumDuration?: number
  className?: string
}

export function LoadingScreen({ minimumDuration = 2000, className }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), minimumDuration)
    return () => clearTimeout(timer)
  }, [minimumDuration])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-lg bg-canvas',
        'transition-opacity duration-700 ease-out',
        !visible && 'pointer-events-none opacity-0',
        className,
      )}
    >
      <FiloLogo showIndicator={false} loop className="h-10 w-auto" />
    </div>
  )
}
