'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/lib/app-context'
import { Sidebar } from '@/components/sidebar'
import { TopHeader } from '@/components/top-header'
import { Breadcrumbs } from '@/components/breadcrumbs'

/** Layout chrome aligned with DVT-Committee-Main MainLayout */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, sidebarCollapsed, isRtl } = useApp()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLogin = pathname === '/login'

  useEffect(() => {
    if (!isLogin && !isLoggedIn) {
      router.replace('/login')
    }
  }, [isLogin, isLoggedIn, router])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  if (isLogin) {
    return <>{children}</>
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-brand">
        جاري التوجيه…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      <TopHeader onToggleMobileMenu={() => setMobileOpen((o) => !o)} />

      <div className="mt-14 flex flex-1">
        <Sidebar isMobileMenuOpen={mobileOpen} onCloseMobileMenu={() => setMobileOpen(false)} />
        <div
          className={`flex h-auto max-w-full flex-1 flex-col transition-all duration-300 ${
            sidebarCollapsed
              ? isRtl
                ? 'lg:pr-20'
                : 'lg:pl-20'
              : isRtl
                ? 'lg:pr-58'
                : 'lg:pl-58'
          }`}
        >
          {/* Breadcrumbs flush under navbar — same as Committee Main */}
          <Breadcrumbs />
          <div className="flex h-full flex-1 flex-col p-2 md:p-4 md:pb-12">
            <main className="container-app flex h-full w-full flex-1 flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
