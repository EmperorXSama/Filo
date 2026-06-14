import { useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutDashboard, Plus, Folder, Settings } from 'lucide-react'
import { useSpacesStore } from '@/store/spacesStore'
import { CreateSpaceDialog } from '@/components/layout/CreateSpaceDialog'

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const spaces = useSpacesStore((s) => s.spaces)

  return (
    <>
      <aside
        className="relative flex flex-col border-r border-hairline bg-soft-stone transition-all duration-300 ease-in-out"
        style={{ width: collapsed ? 60 : 240 }}
      >
        <div className="flex h-16 items-center border-b border-hairline px-3">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-[5px] bg-muted/20" />
            {!collapsed && (
              <span className="text-sm font-medium text-ink">Filo</span>
            )}
          </div>
        </div>

        <button
          onClick={onToggle}
          className="absolute left-full top-4 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-hairline bg-soft-stone text-muted transition-colors hover:border-muted hover:text-ink"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          <button className="flex w-full items-center gap-3 rounded-xs px-2.5 py-[7px] text-caption text-muted transition-colors hover:bg-white/60 hover:text-ink">
            <LayoutDashboard className="h-[18px] w-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">Dashboard</span>}
          </button>

          <div className="py-2">
            {collapsed ? (
              <div className="mx-auto h-px w-5 bg-hairline" />
            ) : (
              <div className="flex items-center gap-2 px-2.5">
                <div className="h-px flex-1 bg-hairline" />
                <span className="text-micro font-medium tracking-wider text-muted">SPACES</span>
                <div className="h-px flex-1 bg-hairline" />
              </div>
            )}
          </div>

          <button
            onClick={() => setDialogOpen(true)}
            className="flex w-full items-center gap-3 rounded-xs px-2.5 py-[7px] text-caption text-muted transition-colors hover:bg-white/60 hover:text-ink"
          >
            <Plus className="h-[18px] w-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">New Space</span>}
          </button>

          {spaces.length > 0 && (
            <div className="pt-1">
              {spaces.map((space) => (
                <button
                  key={space.id}
                  className="flex w-full items-center gap-3 rounded-xs px-2.5 py-[7px] text-caption text-muted transition-colors hover:bg-white/60 hover:text-ink"
                >
                  <Folder className="h-[18px] w-[18px] flex-shrink-0" />
                  {!collapsed && <span className="truncate">{space.name}</span>}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-hairline p-2">
          <button className="flex w-full items-center gap-3 rounded-xs px-2.5 py-[7px] text-caption text-muted transition-colors hover:bg-white/60 hover:text-ink">
            <Settings className="h-[18px] w-[18px] flex-shrink-0" />
            {!collapsed && <span className="truncate">Settings</span>}
          </button>
        </div>
      </aside>

      <CreateSpaceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
