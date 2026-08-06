'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import { BREADCRUMB_LABELS } from '@/lib/nav-config'
import { getCountryById } from '@/lib/countries-world'
import { ORGANIZATIONS } from '@/lib/mock-data'
import { getCompanyById } from '@/lib/companies-mock'
import { useApp } from '@/lib/app-context'

function labelForSegment(seg: string, prev?: string, parts?: string[]): string {
  if (seg === 'new') {
    if (prev === 'minutes') return 'إنشاء محضر'
    if (prev === 'reports') return 'إنشاء تقرير'
    if (prev === 'meetings') return 'إنشاء اجتماع'
    if (prev === 'companies') return 'إضافة شركة جديدة'
    return 'إنشاء'
  }
  if (seg === 'edit' && prev && parts) {
    const companiesIdx = parts.indexOf('companies')
    if (companiesIdx >= 0) return 'تعديل الشركة'
  }
  if (BREADCRUMB_LABELS[seg]) return BREADCRUMB_LABELS[seg]
  if (prev === 'countries') {
    const c = getCountryById(seg)
    if (c) return c.nameAr
  }
  if (prev === 'organizations') {
    const org = ORGANIZATIONS.find((o) => o.id === seg || String(o.numericId) === seg)
    if (org) return org.nameAr
  }
  if (prev === 'companies') {
    const company = getCompanyById(seg)
    if (company) return company.nameAr
  }
  if (prev === 'meetings' || prev === 'minutes' || prev === 'voting') {
    if (seg === 'mining-2026' || seg === '1') return 'لجنة التعدين 2026'
  }
  if (prev === 'tasks' && seg.startsWith('TSK-')) return 'تفاصيل المهمة'
  return decodeURIComponent(seg)
}

/** Matches DVT-Committee-Main Breadcrumbs — flush under appbar, no outer margin */
export function Breadcrumbs() {
  const pathname = usePathname()
  const { isRtl } = useApp()

  if (!pathname || pathname === '/login') return null

  const parts = pathname.split('/').filter(Boolean)
  const crumbs: { href: string; label: string }[] = []

  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'portal')) {
    crumbs.push({ href: '/portal', label: isRtl ? 'الرئيسية' : 'Home' })
  } else {
    crumbs.push({ href: '/portal', label: isRtl ? 'الرئيسية' : 'Home' })
    let acc = ''
    parts.forEach((seg, i) => {
      if (seg === 'portal' || seg === 'ir') return
      acc += `/${seg}`
      // Keep real href under /ir/... when path includes ir
      const href = parts[0] === 'ir' ? `/ir${acc}` : acc.startsWith('/') ? acc : `/${acc}`
      crumbs.push({
        href,
        label: labelForSegment(seg, parts[i - 1], parts),
      })
    })
  }

  return (
    <nav className="z-10 flex items-center gap-2 border-b border-border bg-surface-elevated px-4 py-1.5 md:px-6">
      <Link href="/portal" className="text-text-muted no-underline hover:text-text" aria-label="Home">
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((c, idx) => {
        const last = idx === crumbs.length - 1
        return (
          <div className="flex items-center gap-2" key={`${c.href}-${idx}`}>
            <span className="text-text-muted">{'>'}</span>
            {last ? (
              <span className="text-xs font-medium text-brand">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-xs font-medium text-text no-underline hover:text-brand">
                {c.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
