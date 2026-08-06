'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Globe } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { WORLD_COUNTRIES, REGION_LABELS, type WorldRegion } from '@/lib/countries-world'
import { PageHeader } from '@/components/ui-kit'

const REGIONS: WorldRegion[] = ['Asia', 'Europe', 'Africa', 'Americas', 'Middle East', 'Oceania']

function CountriesContent() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const searchParams = useSearchParams()
  const initialRegion = (searchParams.get('region') as WorldRegion | null) ?? 'الكل'

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<WorldRegion | 'الكل'>(initialRegion as WorldRegion | 'الكل')

  useEffect(() => {
    const r = searchParams.get('region') as WorldRegion | null
    if (r) setRegion(r)
  }, [searchParams])

  const filtered = WORLD_COUNTRIES.filter((c) => {
    const matchSearch =
      !search ||
      c.nameAr.includes(search) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.capitalAr.includes(search) ||
      c.iso2.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === 'الكل' || c.region === region
    return matchSearch && matchRegion
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title={isAr ? 'ملفات الدول' : 'Country Profiles'}
        subtitle={isAr ? `${WORLD_COUNTRIES.length} دولة في قاعدة البيانات` : `${WORLD_COUNTRIES.length} countries in database`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن دولة...' : 'Search countries...'}
            className="input-base ps-9"
          />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as WorldRegion | 'الكل')}
          className="input-base h-11 w-auto text-sm"
        >
          <option value="الكل">{isAr ? 'كل المناطق' : 'All Regions'}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {isAr ? REGION_LABELS[r].ar : REGION_LABELS[r].en}
            </option>
          ))}
        </select>
        <div className="flex h-11 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 text-xs text-[var(--color-text-muted)]">
          <Globe size={13} />
          {filtered.length} {isAr ? 'نتيجة' : 'results'}
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ id: 'الكل', ar: 'الكل', en: 'All' }, ...REGIONS.map((r) => ({ id: r, ar: REGION_LABELS[r].ar, en: REGION_LABELS[r].en }))].map(
          ({ id, ar, en }) => (
            <button
              key={id}
              onClick={() => setRegion(id as WorldRegion | 'الكل')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                region === id
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-[var(--color-bg-elev)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {isAr ? ar : en}
            </button>
          ),
        )}
      </div>

      {/* Grid */}
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((country) => (
          <Link
            key={country.id}
            href={`/ir/countries/${country.id}`}
            className="no-underline"
          >
            <div className="card card-hover cursor-pointer p-3 flex items-center gap-3">
              <span className="text-2xl shrink-0">{country.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {isAr ? country.nameAr : country.nameEn}
                </p>
                <p className="truncate text-xs text-[var(--color-text-muted)]">
                  {isAr ? country.capitalAr : country.capitalEn}
                </p>
                <p className="text-[10px] text-[var(--color-brand)] font-medium mt-0.5">
                  {isAr ? REGION_LABELS[country.region].ar : REGION_LABELS[country.region].en}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Globe size={40} className="mx-auto mb-3 opacity-20 text-[var(--color-text-muted)]" />
          <p className="text-sm text-[var(--color-text-muted)]">
            {isAr ? 'لا توجد نتائج مطابقة للبحث' : 'No countries match your search'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function CountriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--color-text-muted)]">جاري التحميل…</div>}>
      <CountriesContent />
    </Suspense>
  )
}
