import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar />

        <main className="flex-1 overflow-auto bg-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
