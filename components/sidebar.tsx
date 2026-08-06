'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AlertTriangle, ChevronLeft, ChevronRight, LogOut, User, X, Bell } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { NAV_GROUPS, isNavItemActive } from '@/lib/nav-config'
import { SIDEBAR_ALERTS } from '@/lib/mock-data'

interface SidebarProps {
  isMobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

/** Matches DVT-Committee-Main Sidebar chrome (layout, active state, collapse tab, logout). */
export function Sidebar({ isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
  const { user, language, sidebarCollapsed, toggleSidebar, logout, isRtl, toggleLanguage } = useApp()
  const pathname = usePathname()
  const router = useRouter()
  const isCollapsed = sidebarCollapsed && !isMobileMenuOpen

  const closeMobile = () => onCloseMobileMenu?.()

  const handleLogout = () => {
    closeMobile()
    logout()
    router.push('/login')
  }

  const displayName = isRtl ? user?.nameAr ?? user?.name : user?.name
  const displayRole = isRtl ? user?.roleAr ?? user?.role : user?.role

  const flatItems = NAV_GROUPS.flatMap((g) => g.items)

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-x-hidden">
      {/* Fixed Header Section */}
      <div className="shrink-0 p-4 pb-0">
        {isMobileMenuOpen && (
          <div className="mb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onCloseMobileMenu}
              className="rounded-lg p-1 transition-colors duration-200 hover:bg-surface-elevated"
            >
              <X className="h-5 w-5 cursor-pointer text-gray-600" />
            </button>
          </div>
        )}

        {/* User Section — Committee Main */}
        <div className="mb-4 border-b border-border pb-4">
          <Link
            href="/profile"
            onClick={closeMobile}
            className="flex items-center gap-3 rounded-lg bg-surface px-2 py-1 no-underline"
          >
            <User className="text-brand" size={20} />
            {(!isCollapsed || isMobileMenuOpen) && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text" lang="en">
                  {displayName}
                </p>
                <p className="truncate text-xs text-text-muted">{displayRole}</p>
              </div>
            )}
          </Link>
        </div>

        {/* Mobile-only navbar items — Committee Main */}
        {isMobileMenuOpen && (
          <div className="mb-4 border-b border-border pb-4">
            <div className="space-y-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-dark transition-colors duration-200 hover:bg-gray-200 hover:text-primary-rich"
              >
                <span className="text-lg">🌐</span>
                <span>{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-dark transition-colors duration-200 hover:bg-gray-200 hover:text-primary-rich"
              >
                <Bell size={20} />
                <span>{isRtl ? 'الإشعارات' : 'Notifications'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Routes — Committee Main spacing/active styles */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <ul className="space-y-2">
          {flatItems.map((item) => {
            const active = isNavItemActive(pathname, item)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-text transition-colors duration-200 ${
                    active ? 'bg-brand text-white' : ''
                  }`}
                  title={isCollapsed && !isMobileMenuOpen ? (isRtl ? item.labelAr : item.labelEn) : ''}
                >
                  <span>
                    <Icon size={22} strokeWidth={1} />
                  </span>
                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      isCollapsed && !isMobileMenuOpen ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
                    } ${isRtl ? 'text-[0.95rem]' : ''}`}
                  >
                    {isRtl ? item.labelAr : item.labelEn}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Alerts — kept for portal requirements, styled with Committee tokens */}
        {(!isCollapsed || isMobileMenuOpen) && (
          <div className="mt-4 space-y-2 border-t border-border pt-4 pb-2">
            {SIDEBAR_ALERTS.map((a) => (
              <div
                key={a.id}
                className={`rounded-lg border-s-4 p-2 text-[11px] leading-snug text-text ${
                  a.severity === 'high' ? 'border-red-500 bg-red-500/10' : 'border-amber-500 bg-amber-500/10'
                }`}
              >
                <div className="mb-0.5 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="h-3 w-3" />
                  {a.severity === 'high' ? 'High' : 'Medium'}
                </div>
                {isRtl ? a.bodyAr || a.titleAr : a.bodyEn || a.titleEn}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Logout — Committee Main */}
      <div className="shrink-0 border-t border-border px-4 pt-4 pb-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
          title={isCollapsed && !isMobileMenuOpen ? (isRtl ? 'تسجيل الخروج' : 'Logout') : ''}
        >
          <LogOut size={22} strokeWidth={1} />
          {(!isCollapsed || isMobileMenuOpen) && (
            <span className="whitespace-nowrap">{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar — starts below the h-14 navbar (Committee Main) */}
      <aside
        className={`fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] border-x border-border bg-surface-elevated text-white transition-all duration-300 ease-in-out lg:block ${
          isRtl ? 'right-0' : 'left-0'
        } ${isCollapsed ? 'w-20' : 'w-58'}`}
      >
        {sidebarContent}
        {/* Floating collapse toggle tab — Committee Main */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`absolute top-1/2 z-40 flex h-10 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted shadow-sm transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white ${
            isRtl ? '-left-3' : '-right-3'
          }`}
        >
          {isCollapsed ? (
            isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : isRtl ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Menu Overlay — Committee Main */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={onCloseMobileMenu}
          role="presentation"
        >
          <div
            className={`fixed top-0 z-[60] h-screen w-64 transform border-x border-border bg-surface-elevated text-white shadow-lg transition-transform duration-300 ease-in-out ${
              isRtl ? 'right-0' : 'left-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
