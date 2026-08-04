'use client'

import {
  LayoutDashboard,
  Globe2,
  Building2,
  Users2,
  FileArchive,
  CheckSquare,
  Plane,
  Vote,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useApp, type ActiveTab } from '@/lib/app-context'
import { cn } from '@/lib/utils'

interface NavItem {
  id: ActiveTab
  icon: React.ComponentType<{ className?: string }>
  labelEn: string
  labelAr: string
}

const NAV_GROUPS: { groupEn: string; groupAr: string; items: NavItem[] }[] = [
  {
    groupEn: 'Overview',
    groupAr: 'نظرة عامة',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, labelEn: 'Dashboard', labelAr: 'لوحة التحكم' },
    ],
  },
  {
    groupEn: 'Diplomacy',
    groupAr: 'الدبلوماسية',
    items: [
      { id: 'countries', icon: Globe2, labelEn: 'Country Profiles', labelAr: 'ملفات الدول' },
      { id: 'organizations', icon: Building2, labelEn: 'Organizations & MoUs', labelAr: 'المنظمات والمذكرات' },
      { id: 'visits', icon: Plane, labelEn: 'Visits & Events', labelAr: 'الزيارات والمناسبات' },
    ],
  },
  {
    groupEn: 'Governance',
    groupAr: 'الحوكمة',
    items: [
      { id: 'committees', icon: Users2, labelEn: 'Committees & Meetings', labelAr: 'اللجان والاجتماعات' },
      { id: 'decisions', icon: Vote, labelEn: 'Decisions & Voting', labelAr: 'القرارات والتصويت' },
      { id: 'tasks', icon: CheckSquare, labelEn: 'Task Management', labelAr: 'إدارة المهام' },
    ],
  },
  {
    groupEn: 'Intelligence',
    groupAr: 'المعلومات',
    items: [
      { id: 'reports', icon: BarChart2, labelEn: 'Reports & KPIs', labelAr: 'التقارير والمؤشرات' },
      { id: 'documents', icon: FileArchive, labelEn: 'Document Center', labelAr: 'مركز الوثائق' },
    ],
  },
]

export function Sidebar() {
  const { activeTab, setActiveTab, user, logout, language, sidebarCollapsed: collapsed, toggleSidebar } = useApp()
  const isRtl = language === 'ar'

  return (
    <aside
      className={cn(
        'fixed top-14 h-[calc(100vh-3.5rem)] border-x border-[var(--color-border)] bg-[var(--color-surface-elevated)] z-30 flex flex-col overflow-hidden',
        isRtl ? 'right-0' : 'left-0'
      )}
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-expanded)',
        transition: `width var(--duration) var(--ease-out)`,
      }}
    >
      {/* Collapse toggle chip — outer edge */}
      <button
        onClick={toggleSidebar}
        className={cn(
          'absolute top-8 z-40 w-6 h-6 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-all duration-150 shadow-[var(--shadow-sm)]',
          isRtl ? '-left-3' : '-right-3'
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isRtl
          ? (collapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)
          : (collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />)
        }
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupEn} className="mb-1">
            {!collapsed && (
              <div className={cn('px-4 mb-1 mt-2', isRtl ? 'text-right' : 'text-left')}>
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  {isRtl ? group.groupAr : group.groupEn}
                </span>
              </div>
            )}
            <ul className="space-y-0.5 px-3">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = activeTab === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      title={collapsed ? (isRtl ? item.labelAr : item.labelEn) : undefined}
                      className={cn(
                        'w-full flex items-center gap-3 py-2.5 rounded-[var(--radius-md)] text-[13px] font-medium transition-all duration-150 group',
                        collapsed ? 'justify-center px-2' : 'px-3',
                        active
                          ? 'bg-[var(--color-brand)] text-white shadow-[var(--shadow-sm)]'
                          : 'text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)]'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className={cn(
                        'w-4 h-4 shrink-0 transition-transform duration-150',
                        active ? 'text-white' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] group-hover:scale-110'
                      )} />
                      {!collapsed && (
                        <span className={cn('truncate flex-1', isRtl ? 'text-right' : 'text-left')}>
                          {isRtl ? item.labelAr : item.labelEn}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--color-border)] p-3 shrink-0">
        {user && !collapsed && (
          <div className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-md)] mb-2 hover:bg-[var(--color-surface)] transition-colors',
            isRtl && 'flex-row-reverse'
          )}>
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-[11px] font-bold shrink-0 ring-2 ring-[var(--color-brand)]/30">
              {user.avatar}
            </div>
            <div className={cn('min-w-0 flex-1', isRtl ? 'text-right' : 'text-left')}>
              <div className="text-[12px] font-semibold text-[var(--color-text)] truncate leading-snug">
                {user.name.split(' ').slice(-2).join(' ')}
              </div>
              <div className="text-[10px] text-[var(--color-text-muted)] capitalize truncate mt-0.5">
                {user.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}
        {user && collapsed && (
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-[var(--color-brand)]/30">
              {user.avatar}
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(
            'w-full flex items-center gap-2 py-2 rounded-[var(--radius-md)] text-[12px] font-medium text-[var(--color-destructive)]/60 hover:text-[var(--color-destructive)] hover:bg-red-50 transition-all duration-150',
            collapsed ? 'justify-center px-0' : 'px-3',
            isRtl && !collapsed && 'flex-row-reverse'
          )}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>{isRtl ? 'تسجيل الخروج' : 'Sign Out'}</span>}
        </button>
      </div>
    </aside>
  )
}
