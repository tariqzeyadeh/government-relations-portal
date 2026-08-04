'use client'

import { useApp } from '@/lib/app-context'
import { Sidebar } from '@/components/sidebar'
import { TopHeader } from '@/components/top-header'
import { DashboardView } from '@/components/views/dashboard-view'
import { CountriesView } from '@/components/views/countries-view'
import { OrganizationsView } from '@/components/views/organizations-view'
import { CommitteesView } from '@/components/views/committees-view'
import { DocumentsView } from '@/components/views/documents-view'
import { TasksView } from '@/components/views/tasks-view'
import { VisitsView } from '@/components/views/visits-view'
import { DecisionsView } from '@/components/views/decisions-view'
import { ReportsView } from '@/components/views/reports-view'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const { activeTab, sidebarCollapsed, language } = useApp()
  const isRtl = language === 'ar'

  const VIEW_MAP = {
    dashboard: <DashboardView />,
    countries: <CountriesView />,
    organizations: <OrganizationsView />,
    committees: <CommitteesView />,
    documents: <DocumentsView />,
    tasks: <TasksView />,
    visits: <VisitsView />,
    decisions: <DecisionsView />,
    reports: <ReportsView />,
  }

  return (
    <div
      className="min-h-screen bg-[var(--color-surface)]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Fixed top navbar */}
      <TopHeader />

      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content — offset by navbar height (mt-14) and sidebar width */}
      <main
        className="mt-14 min-h-[calc(100vh-3.5rem)] p-2 md:p-4 md:pb-12"
        style={{
          [isRtl ? 'marginRight' : 'marginLeft']: sidebarCollapsed
            ? 'var(--sidebar-collapsed)'
            : 'var(--sidebar-expanded)',
          transition: `margin var(--duration) var(--ease-out)`,
        }}
        role="main"
      >
        <div className="container-app">
          {VIEW_MAP[activeTab]}
        </div>
      </main>
    </div>
  )
}
