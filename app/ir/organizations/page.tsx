'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Building2, Globe, FileSignature } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { ORGANIZATIONS } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui-kit'

export default function OrganizationsListPage() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('الكل')

  const types = useMemo(() => {
    const set = new Set(ORGANIZATIONS.map((o) => (isAr ? o.typeAr : o.typeEn)))
    return ['الكل', ...Array.from(set)]
  }, [isAr])

  const filtered = ORGANIZATIONS.filter((o) => {
    const matchSearch =
      !search ||
      o.nameAr.includes(search) ||
      o.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      o.acronym.toLowerCase().includes(search.toLowerCase())
    const typeLabel = isAr ? o.typeAr : o.typeEn
    const matchType = typeFilter === 'الكل' || typeLabel === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'المنظمات الدولية' : 'International Organizations'}
        subtitle={
          isAr
            ? `${ORGANIZATIONS.length} منظمة في قاعدة البيانات`
            : `${ORGANIZATIONS.length} organizations in database`
        }
      />

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث في المنظمات…' : 'Search organizations…'}
            className="input-base ps-9 text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-base w-auto text-sm"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'الكل' ? (isAr ? 'كل الأنواع' : 'All types') : t}
            </option>
          ))}
        </select>
        <span className="text-xs text-text-muted">
          {filtered.length} {isAr ? 'منظمة' : 'orgs'}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((org) => (
          <Link key={org.id} href={`/ir/organizations/${org.id}`} className="no-underline">
            <div className="card card-hover h-full cursor-pointer p-5 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/10 text-xs font-extrabold text-[var(--color-brand)]">
                  {org.acronym.slice(0, 4)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--color-text)] line-clamp-2">
                    {isAr ? org.nameAr : org.nameEn}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[var(--color-brand)]">{org.acronym}</p>
                </div>
              </div>
              <p className="mb-3 text-xs text-text-muted">{isAr ? org.typeAr : org.typeEn}</p>
              <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <Globe size={12} className="text-brand" />
                  {isAr ? org.headquartersAr : org.headquartersEn}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Building2 size={12} className="text-brand" />
                  {org.memberStates} {isAr ? 'عضو' : 'members'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FileSignature size={12} className="text-brand" />
                  {org.activeMoUs} MoU
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center text-sm text-text-muted">
          {isAr ? 'لا توجد منظمات مطابقة' : 'No matching organizations'}
        </div>
      )}
    </div>
  )
}
